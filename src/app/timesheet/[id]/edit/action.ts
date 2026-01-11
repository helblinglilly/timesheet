'use server';

import { formSchema } from './form.schema';
import { serverSideAuth } from '~/pocketbase/server';
import { createTranslation } from '~/i18n/server';
import { withNewRelicWebTransaction } from '~/utils/observability/withNewRelicWebTransaction';
import { redirect } from 'next/navigation';
import newrelic from 'newrelic';
import { TableNames } from '~/pocketbase/tables.types';
import z from 'zod';

export interface TimesheetFormState {
  errors: string[];
  properties?: {
    id?: { errors: string[]; } | undefined;
    minutesPerDay?: { errors: string[]; } | undefined;
    daysPerWeek?: { errors: string[]; } | undefined;
    unpaidLunchMinutes?: { errors: string[]; } | undefined;
    paidLunchMinutes?: { errors: string[]; } | undefined;
    mode?: { errors: string[]; } | undefined;
  } | undefined;
}

async function updateTimesheet(formData: FormData): Promise<TimesheetFormState> {
  const pb = await serverSideAuth();
  const { t } = await createTranslation();
  const schema = formSchema(t);

  const hoursPerDay = formData.get('minutesPerDay.hours');
  const unpaidLunchMinutesRaw = formData.get('unpaidLunchMinutes');
  const paidLunchMinutesRaw = formData.get('paidLunchMinutes');

  const values = {
    id: formData.get('id'),
    minutesPerDay: {
      hours: hoursPerDay ? Number(hoursPerDay) : undefined,
      minutes: Number(formData.get('minutesPerDay.minutes') ?? '0'),
    },
    daysPerWeek: Number(formData.get('daysPerWeek')),
    unpaidLunchMinutes: unpaidLunchMinutesRaw ? Number(unpaidLunchMinutesRaw) : undefined,
    paidLunchMinutes: paidLunchMinutesRaw ? Number(paidLunchMinutesRaw) : undefined,
    mode: formData.get('mode'),
  };

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const { error } = parsed;
    return z.treeifyError(error);
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
    return { errors: [t('timesheet.new.error_generic')] };
  }

  redirect(`/timesheet/${parsed.data.id}`);
}

export async function updateTimesheetWithState(
  _prevState: TimesheetFormState,
  formData: FormData,
): Promise<TimesheetFormState> {
  return await withNewRelicWebTransaction('timesheet/edit', () => updateTimesheet(formData));
}
