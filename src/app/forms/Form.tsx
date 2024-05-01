"use client";
import {
  FieldOptionsSelectModel,
  FormSelectModel,
  QuestionSelectModel,
} from "@/types/form-types";

import {
  FormLabel,
  Form as ShadCnFormComponent,
  FormField as ShadCnFormField,
  FormItem as ShadCnFormItem,
  FormControl as ShadCnFormControl,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import FormField from "./FormField";
import { publishForm } from "../actions/mutateForm";
import FormPublishSuccess from "./FormPublishSuccess";
import { useRouter } from "next/navigation";

type Props = {
  form: Form;
  editMode?: boolean;
};

type QuestionWithOptionsModel = QuestionSelectModel & {
  fieldOptions: Array<FieldOptionsSelectModel>;
};

interface Form extends FormSelectModel {
  questions: Array<QuestionWithOptionsModel>;
}

const Form = (props: Props) => {
  const form = useForm();
  const router = useRouter();
  const { editMode } = props;
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const handleDialogChange = (open: boolean) => {
    setSuccessDialogOpen(open);
  };

  const onSubmit = async (data: any) => {
    if (editMode) {
      await publishForm(props.form.id);
      setSuccessDialogOpen(true);
    } else {
      let answers = [];
      for (const [questionId, value] of Object.entries(data)) {
        const id = parseInt(questionId.replace("question_", ""));
        let fieldOptionsId = null;
        let textValue = null;

        if (typeof value == "string" && value.includes("answerId_")) {
          fieldOptionsId = parseInt(value.replace("answerId_", ""));
        } else {
          if (value != null && value !== "") {
            textValue = value.toString();
          }
        }

        answers.push({
          questionId: id,
          fieldOptionsId,
          value: textValue,
        });
      }
      // submitting the form
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const response = await fetch(`${baseUrl}/api/form/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formId: props.form.id, answers }),
      });
      if (response.status === 200) {
        router.push(`/forms/${props.form.id}/success`);
      } else {
        console.log("Error submitting form");
        alert("Error submitting your answers, please try again later");
      }
    }
  };
  return (
    <div className="text-center">
      <h1 className="text-lg font-bold py-3">{props.form.name}</h1>
      <h3 className="text-md">{props.form.description}</h3>
      <ShadCnFormComponent {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid w-full max-w-3xl items-center gap-6 my-4 text-left"
        >
          {props.form.questions.map(
            (question: QuestionWithOptionsModel, index: number) => {
              const fieldValue = form.getValues(`question_${question.id}`);
              return (
                <ShadCnFormField
                  control={form.control}
                  name={`question_${question.id}`}
                  key={`${question.text}_${index}`}
                  render={({ field }) => (
                    <ShadCnFormItem>
                      <FormLabel className="text-base mt-3">
                        {index + 1}. {question.text}
                      </FormLabel>
                      <ShadCnFormControl>
                        <FormField
                          element={question}
                          key={index}
                          value={fieldValue}
                          onChange={field.onChange}
                        />
                      </ShadCnFormControl>
                    </ShadCnFormItem>
                  )}
                ></ShadCnFormField>
              );
            }
          )}
          <Button type="submit">{props.editMode ? "Publish" : "Submit"}</Button>
        </form>
      </ShadCnFormComponent>
      <FormPublishSuccess
        formId={props.form.id}
        open={successDialogOpen}
        onOpenChange={handleDialogChange}
      ></FormPublishSuccess>
    </div>
  );
};

export default Form;
