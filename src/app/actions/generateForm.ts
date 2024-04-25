"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { saveForm } from "./mutateForm";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateForm(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  const schema = z.object({
    description: z.string().min(1),
  });
  const parse = schema.safeParse({
    description: formData.get("description"),
  });
  if (!parse.success) {
    console.log(parse.error);
    return {
      message: "Failed to parse data",
    };
  }

  if (!process.env.GEMINI_API_KEY) {
    return {
      message: "No Gemimi API key found",
    };
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const data = parse.data;
  const promptExplanation =
    "Based on the description, generate a json object with 3 fields: name(string) for the form, description(string) for the form and a questions array where every element of questions array has 2 fields: text and the fieldType and fieldType can be of these options RadioGroup, Select, Input, Textarea, Switch; and return it in json format. For RadioGroup, and Select types also return fieldOptions array with text and value fields. For example, for RadioGroup, and Select types, the field options array can be [{text: 'YES', value: 'yes'}, {text: 'NO', value: 'no'}] and for Input, Textarea, and Switch types, the field options array can be empty. For example, for Input, Textarea, and Switch types, the field options array can be []. Make sure questions array is always present even if empty and here is the survey requirement from user:";

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });
    const result = await model.generateContent(
      `${data.description} ${promptExplanation}`
    );
    const response = result.response;
    const text = response.text();

    const cleanedData = text.trim().replace(/^```json\s*|\s*```$/g, "");
    const jsonData = JSON.parse(cleanedData);
    const dbFormId = await saveForm({
      name: jsonData.name,
      description: jsonData.description,
      questions: jsonData.questions,
    });
    revalidatePath("/");
    return {
      message: "success",
      data: { formId: dbFormId },
    };
  } catch (e) {
    console.log(e);
    return {
      message: "Failed to create form",
    };
  }
}
