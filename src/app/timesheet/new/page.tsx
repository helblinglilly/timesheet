"use server";

import { createTranslation } from "~/i18n/server";
import NewTimesheetForm from "./form";

export default async function NewTimesheetPage(){
  const { t } = await createTranslation();

  return (
    <div className="grid gap-4 px-4 pt-4 pb-8">
      <h1 className="text-2xl font-semibold">{t('timesheet.new.title')}</h1>
      <NewTimesheetForm />
    </div>
  )
}
