"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
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

  const data = parse.data;
  const promptExplanation =
    "Based on the description, generate a survey with questions array where every element has 2 fields: text and the fieldType and fieldType can be of these options RadioGroup, Select, Input, Textarea, Switch; and return it in json format. For RadioGroup, and Select types also return fieldOptions array with text and value fields. For example, for RadioGroup, and Select types, the field options array can be [{text: 'YES', value: 'yes'}, {text: 'NO', value: 'no'}] and for Input, Textarea, and Switch types, the field options array can be empty. For example, for Input, Textarea, and Switch types, the field options array can be []";

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // defining the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(
      `${data.description} ${promptExplanation}`
    );
    // const response = await fetch("https://api.openai.com/v1/chat/completions", {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    //   },
    //   method: "POST",
    //   body: JSON.stringify({
    //     model: "gpt-3.5-turbo",
    //     message: {
    //       role: "system",
    //       content: `${data.description} ${promptExplanation}`,
    //     },
    //   }),
    // });
    const response = await result.response;
    const text = response.text();
    console.log(text);
    const json = {};
    // const response = await result.response;
    // const json = response.
    revalidatePath("/");
    return {
      message: "success",
      data: json,
    };
  } catch (e) {
    console.log(e);
    return {
      message: "Failed to create form",
    };
  }
}
