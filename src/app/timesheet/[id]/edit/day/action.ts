"use server"

import { serverSideAuth } from "~/pocketbase/server"
import { createTranslation } from "~/i18n/server";
import { withNewRelicWebTransaction } from "~/utils/observability/withNewRelicWebTransaction";
import { redirect } from "next/navigation";
import newrelic from 'newrelic'
import { formSchema } from "./form.schema";
import { format } from "date-fns";

export type TimesheetEditFormState = {
  errors?: {
    id?: string[] | undefined;
    day?: string[] | undefined;
    clockIn?: string[] | undefined;
    clockOut?: string[] | undefined;
    breaks?: string[] | undefined;
  },
  message?: string | undefined;
};

function parseBreaksFromFormData(formData: FormData) {
  const breaks: { breakIn: string; breakOut: string }[] = [];

  for (const [key, value] of formData.entries()) {
    const match = /^breaks\[(\d+)\]\[(breakIn|breakOut)\]$/.exec(key);
    if (match) {
      const idx = Number(match[1]);
      const field = match[2] as "breakIn" | "breakOut";

      breaks[idx] = {
        breakIn: breaks[idx]?.breakIn ?? '',
        breakOut: breaks[idx]?.breakOut ?? ''
      }

      breaks[idx][field] = value as string;
    }
  }

  // Remove any undefined holes (if any)
  return breaks.filter(Boolean);
}

async function editTimesheetDay(formData: FormData): Promise<TimesheetEditFormState> {
  const pb = await serverSideAuth();
  const { t } = await createTranslation();
  const schema = formSchema(t);

  const values = {
    id: formData.get('id'),
    day: formData.get('day'),
    clockIn: formData.get('clockIn'),
    clockOut: formData.get('clockOut'),
    breaks: parseBreaksFromFormData(formData),
  };

  console.log(values);
  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const { error } = parsed;
    return {
      errors: error.flatten().fieldErrors,
    }
  }

  try {
    // something
  } catch(err){
    const pbError = err instanceof Error ? err.message : 'Unknown';
    newrelic.noticeError(new Error(`Failed to edit timesheet with error ${pbError}`));
    return { message: t('timesheet.[id].edit.error_generic') }
  }

  redirect(`/timesheet/${parsed.data.id}?date=${parsed.data.day.split('T')[0]}`);
}


export async function editTimesheetDayWithState(
  _prevState: TimesheetEditFormState,
  formData: FormData
): Promise<TimesheetEditFormState> {

  return await withNewRelicWebTransaction('timesheet/[id]/edit', () => editTimesheetDay(formData));
}
