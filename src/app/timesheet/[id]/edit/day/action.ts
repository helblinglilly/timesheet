'use server';

import { serverSideAuth } from '~/pocketbase/server';
import { createTranslation } from '~/i18n/server';
import { withNewRelicWebTransaction } from '~/utils/observability/withNewRelicWebTransaction';
import { redirect } from 'next/navigation';
import { formSchema } from './form.schema';
import { format, parseISO, set } from 'date-fns';
import { TableNames } from '~/pocketbase/tables.types';
import log from '~/utils/log';

export interface TimesheetEditFormState {
  errors?: {
    id?: string[] | undefined;
    day?: string[] | undefined;
    clockIn?: string[] | undefined;
    clockOut?: string[] | undefined;
    breaks?: string[] | undefined;
  };
  message?: string | undefined;
}

function parseBreaksFromFormData(formData: FormData) {
  const breaks: { breakIn: string | null; breakOut: string | null }[] = [];

  for (const [key, value] of formData.entries()) {
    const match = /^breaks\[(\d+)\]\[(breakIn|breakOut)\]$/.exec(key);
    if (match) {
      const idx = Number(match[1]);
      const field = match[2] as 'breakIn' | 'breakOut';

      breaks[idx] = {
        breakIn: breaks[idx]?.breakIn ?? null,
        breakOut: breaks[idx]?.breakOut ?? null,
      };

      breaks[idx][field] = value as string;
    }
  }

  return breaks.filter(Boolean);
}

async function editTimesheetDay(formData: FormData): Promise<TimesheetEditFormState> {
  const pb = await serverSideAuth();
  const { t } = await createTranslation();
  const schema = formSchema(t);

  const values = {
    id: formData.get('id'),
    day: formData.get('day'),
    timesheet_entry_id: formData.get('timesheet_entry_id'),
    clockIn: formData.get('clockIn') ?? null,
    clockOut: formData.get('clockOut') ?? null,
    breaks: parseBreaksFromFormData(formData),
  };

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const { error } = parsed;
    return {
      errors: error.flatten().fieldErrors,
    };
  }

  const additionalErrors: Record<string, string[]> = {};

  for (let i = 0; i < parsed.data.breaks.length; i++) {
    const breakObj = parsed.data.breaks[i];
    if (!breakObj?.breakOut) continue;

    const [breakInHours, breakInMins] = breakObj.breakIn.split(':').map(Number) as [number, number];
    const [breakOutHours, breakOutMins] = breakObj.breakOut.split(':').map(Number) as [number, number];
    const [clockInHours, clockInMins] = parsed.data.clockIn.split(':').map(Number) as [number, number];
    const [clockOutHours, clockOutMins] = parsed.data.clockOut?.split(':').map(Number) as [number, number];

    const breakInMinutes = breakInHours * 60 + breakInMins;
    const breakOutMinutes = breakOutHours * 60 + breakOutMins;
    const clockInMinutes = clockInHours * 60 + clockInMins;
    const clockOutMinutes = clockOutHours * 60 + clockOutMins;

    // Before clock in
    if (breakInMinutes < clockInMinutes) {
      additionalErrors[`breaks.${i}.breakIn`] = [t('timesheet.[id].edit.fields.breaks.break_in.error_before_clock_in')];
    }
    if (breakOutMinutes < clockInMinutes) {
      additionalErrors[`breaks.${i}.breakOut`] = [t('timesheet.[id].edit.fields.breaks.break_out.error_before_clock_in')];
    }

    // Break finish before break started
    if (breakOutMinutes < breakInMinutes) {
      additionalErrors[`breaks.${i}.breakOut`] = [t('timesheet.[id].edit.fields.breaks.break_out.error_before')];
    }

    // After clock out
    if (clockOutMinutes < breakInMinutes) {
      additionalErrors[`breaks.${i}.breakIn`] = [t('timesheet.[id].edit.fields.breaks.break_in.error_after_clock_out')];
    }
    if (clockOutMinutes < breakOutMinutes) {
      additionalErrors[`breaks.${i}.breakOut`] = [t('timesheet.[id].edit.fields.breaks.break_out.error_after_clock_out')];
    }
  }

  if (Object.keys(additionalErrors).length > 0) {
    return { errors: additionalErrors };
  }

  try {
    const clockInDate: Date = set(
      parseISO(parsed.data.day), {
        hours: Number(parsed.data.clockIn.split(':')[0]),
        minutes: Number(parsed.data.clockIn.split(':')[1]),
        seconds: 0,
      },
    );

    const clockOutDate: Date | null = parsed.data.clockOut ? set(
      parseISO(parsed.data.day), {
        hours: Number(parsed.data.clockOut.split(':')[0]),
        minutes: Number(parsed.data.clockOut.split(':')[1]),
        seconds: 0,
      },
    ) : null;

    let timesheetEntryId = parsed.data.timesheet_entry_id;
    if (!timesheetEntryId){
      timesheetEntryId = (await pb.collection(TableNames.TimesheetEntry).create({
        user: pb.authStore?.record?.id,
        config: parsed.data.id,
        clockIn: clockInDate,
        clockOut: clockOutDate
      })).id
    } else {
      await pb.collection(TableNames.TimesheetEntry).update(timesheetEntryId, {
        clockIn: clockInDate,
        clockOut: clockOutDate
      })
    }

    const deleteBreaksBatch = pb.createBatch();

    if (parsed.data.breaks.length > 0){
      const allBreaks = await pb.collection(TableNames.TimesheetBreaks).getFullList({
        filter: `timesheet_entry.id = "${timesheetEntryId}"`
      });

      allBreaks.map((a) => {
        deleteBreaksBatch.collection(TableNames.TimesheetBreaks).delete(a.id)
      })

      await deleteBreaksBatch.send();
    }

    const breakBatch = pb.createBatch();

    parsed.data.breaks.forEach((breakEntry) => {
      const breakInDate: Date = set(
        parseISO(parsed.data.day), {
          hours: Number(breakEntry.breakIn.split(':')[0]),
          minutes: Number(breakEntry.breakIn.split(':')[1]),
          seconds: 0,
        },
      );

      const breakOutDate: Date | null = breakEntry.breakOut ? set(
        parseISO(parsed.data.day), {
          hours: Number(breakEntry.breakOut.split(':')[0]),
          minutes: Number(breakEntry.breakOut.split(':')[1]),
          seconds: 0,
        },
      ) : null;

      breakBatch.collection(TableNames.TimesheetBreaks).create({
        user: pb.authStore?.record?.id,
        timesheet_entry: timesheetEntryId,
        breakIn: breakInDate,
        breakOut: breakOutDate
      })
    })

    if (parsed.data.breaks.length > 0){
      await breakBatch.send();
    }
  }
  catch (err) {
    const pbError = err instanceof Error ? err.message : 'Unknown';
    log.error('Failed to edit timesheet', pbError);
    return { message: t('timesheet.[id].edit.fields.errors.generic') };
  }

  redirect(`/timesheet/${parsed.data.id}?date=${format(new Date(parsed.data.day), 'yyy-LL-dd')}&refetch_date=${format(new Date(parsed.data.day), 'yyy-LL-dd')}`);
}

export async function editTimesheetDayWithState(
  _prevState: TimesheetEditFormState,
  formData: FormData,
): Promise<TimesheetEditFormState> {
  return await withNewRelicWebTransaction('timesheet/[id]/edit', () => editTimesheetDay(formData));
}
