import { Button } from "@/components/ui/button";
import FormGenerator from "./form-generator/FormGenerator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <FormGenerator></FormGenerator>
    </main>
  );
}
