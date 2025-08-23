"use server"

import { createTranslation } from "~/i18n/server";
import { serverSideAuth } from "~/pocketbase/server";
import { withNewRelicWebTransaction } from "~/utils/observability/withNewRelicWebTransaction";
import { formSchema } from "./form.schema";

export type TimesheetEditFormState = {
  errors?: {
    day?: string[] | undefined;
    clockIn?: string[] | undefined;
    clockOut?: string[] | undefined;
    breaks?: string[] | undefined;
  },
  message?: string | undefined;
};

async function editTimesheetDay(formData: FormData): Promise<TimesheetEditFormState> {
  const pb = await serverSideAuth();
  const { t } = await createTranslation();
  const schema = formSchema(t);

  const values = {
    day: formData.get('day'),
    timesheetId: formData.get('timesheetId'),
    clockIn: formData.get('clock_in'),
    clockOut: formData.get('clock_out'),
    breaks: formData.get('breaks'),
  };

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const { error } = parsed;
    return {
      errors: error.flatten().fieldErrors,
    }
  }

  console.log(parsed.data);

  return {}
}


export async function editTimesheetDayWithState(
  _prevState: TimesheetEditFormState,
  formData: FormData
): Promise<TimesheetEditFormState> {

  return await withNewRelicWebTransaction('timesheet/[id]/edit', () => editTimesheetDay(formData));
}
