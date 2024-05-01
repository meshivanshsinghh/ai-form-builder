import { FC } from "react";
import FormsList from "@/app/forms/FormsList";
import { forms as dbForm } from "@/db/schema";
import { getUsersForms } from "@/app/actions/getUserForms";
import { InferSelectModel } from "drizzle-orm";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const forms: InferSelectModel<typeof dbForm>[] = await getUsersForms();

  return (
    <div>
      <FormsList forms={forms}></FormsList>
    </div>
  );
};

export default page;
