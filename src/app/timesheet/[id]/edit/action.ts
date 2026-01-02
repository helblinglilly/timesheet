'use server';

import { formSchema } from './form.schema';
import { serverSideAuth } from '~/pocketbase/server';
import { createTranslation } from '~/i18n/server';
import { withNewRelicWebTransaction } from '~/utils/observability/withNewRelicWebTransaction';
import { redirect } from 'next/navigation';
import newrelic from 'newrelic';
import { TableNames } from '~/pocketbase/tables.types';

export interface TimesheetFormState {
  errors?: {
    id?: string[] | undefined;
    minutesPerDay?: string[] | undefined;
    daysPerWeek?: string[] | undefined;
    unpaidLunchMinutes?: string[] | undefined;
    paidLunchMinutes?: string[] | undefined;
    mode?: string[] | undefined;
  };
  message?: string | undefined;
}

async function updateTimesheet(formData: FormData): Promise<TimesheetFormState> {
  const pb = await serverSideAuth();
  const { t } = await createTranslation();
  const schema = formSchema(t);

  const values = {
    id: formData.get('id'),
    minutesPerDay: {
      hours: formData.get('minutesPerDay.hours'),
      minutes: formData.get('minutesPerDay.minutes'),
    },
    daysPerWeek: formData.get('daysPerWeek'),
    unpaidLunchMinutes: formData.get('unpaidLunchMinutes'),
    paidLunchMinutes: formData.get('paidLunchMinutes'),
    mode: formData.get('mode'),
  };

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const { error } = parsed;
    return {
      errors: error.flatten().fieldErrors,
    };
  }

  try {
    if (parsed.data.mode === 'target'){
      await pb.collection(TableNames.TimesheetConfig).update(parsed.data.id, {
        minutesPerDay: (parsed.data.minutesPerDay.hours * 60) + parsed.data.minutesPerDay.minutes,
        daysPerWeek: parsed.data.daysPerWeek,
        paidLunchMinutes: parsed.data.paidLunchMinutes,
        unpaidLunchMinutes: parsed.data.unpaidLunchMinutes,
      });
    } else {
      await pb.collection(TableNames.TimesheetConfig).update(parsed.data.id, {
        minutesPerDay: 0,
        daysPerWeek: 0,
        paidLunchMinutes: 0,
        unpaidLunchMinutes: 0,
      });
    }

  }
  catch (err) {
    const pbError = err instanceof Error ? err.message : 'Unknown';
    newrelic.noticeError(new Error(`Failed to update timesheet with error ${pbError}`));
    return { message: t('timesheet.new.error_generic') };
  }

  redirect(`/timesheet/${parsed.data.id}`);
}

export async function updateTimesheetWithState(
  _prevState: TimesheetFormState,
  formData: FormData,
): Promise<TimesheetFormState> {
  return await withNewRelicWebTransaction('timesheet/edit', () => updateTimesheet(formData));
}
