import { FC } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const FormSuccess = () => {
  return (
    <Alert variant="default">
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        Your answers were recorded successfully. Thank you for submitting the
        form!
      </AlertDescription>
    </Alert>
  );
};

export default FormSuccess;
