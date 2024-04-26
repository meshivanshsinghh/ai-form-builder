import React, { ChangeEvent } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  FieldOptionsSelectModel,
  QuestionSelectModel,
} from "@/types/form-types";
import { FormControl, FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  element: QuestionSelectModel & {
    fieldOptions: Array<FieldOptionsSelectModel>;
  };
  value: string;
  onChange: (value?: string | ChangeEvent<HTMLInputElement>) => void;
}

const FormField = ({ element, value, onChange }: FormFieldProps) => {
  if (!element) return null;
  const components = {
    Input: () => <Input type="text" onChange={onChange} />,
    Switch: () => <Switch />,
    Textarea: () => <Textarea />,
    Select: () => (
      <Select onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue>Select an option</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {element.fieldOptions.map((option, index) => (
            <SelectItem
              key={`${option.text}_${option.value}`}
              value={`answerId_${option.id}`}
            >
              {option.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    RadioGroup: () => (
      <RadioGroup onValueChange={onChange}>
        {element.fieldOptions.map((option, index) => (
          <div
            key={`${option.text}_${option.value}`}
            className="flex items-center space-x-2"
          >
            <FormControl>
              <RadioGroupItem
                value={`answerId_${option.id}`}
                id={option?.value?.toString() || `answerId_${option.id}`}
              >
                {option.text}
              </RadioGroupItem>
            </FormControl>
            <Label>{option.text}</Label>
          </div>
        ))}
      </RadioGroup>
    ),
  };
  return element.fieldType && components[element.fieldType]
    ? components[element.fieldType]()
    : null;
};

export default FormField;
