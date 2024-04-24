import FormGenerator from "./form-generator/FormGenerator";
import Header from "@/components/ui/header";
import { SessionProvider } from "next-auth/react";

export default function Home() {
  return (
    <SessionProvider>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center">
        <FormGenerator></FormGenerator>
      </main>
    </SessionProvider>
  );
}
