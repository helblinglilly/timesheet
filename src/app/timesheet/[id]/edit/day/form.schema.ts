import type { Namespace, TFunction } from 'i18next';
import z from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const formSchema = (t: TFunction<Namespace, undefined>) => z.object({
  id: z.string(),
  day: z.string(),
  timesheet_entry_id: z.string().nullable().optional(),
  clockIn: z.string()
    .refine(
      val => val || timeRegex.test(val),
      { message: t('timesheet.[id].edit.fields.errors.invalid_time') },
    ),
  breaks: z.array(z.object({
    breakIn: z.string()
      .refine(
        val => val || timeRegex.test(val),
        { message: t('timesheet.[id].edit.fields.errors.invalid_time') },
      ),
    breakOut: z.string()
      .refine(
        val => !val || timeRegex.test(val),
        { message: t('timesheet.[id].edit.fields.errors.invalid_time') },
      ).optional(),
    breakEntryId: z.string().nullable().optional(),
  })),
  clockOut: z.string()
    .refine(
      val => !val || timeRegex.test(val),
      { message: t('timesheet.[id].edit.fields.errors.invalid_time') },
    ).optional(),
}).refine(
  (data) => {
    if (!data.clockOut) return true;
    const [inH, inM] = data.clockIn.split(':').map(Number) as [number, number];
    const [outH, outM] = data.clockOut.split(':').map(Number) as [number, number];
    const clockInMinutes = inH * 60 + inM;
    const clockOutMinutes = outH * 60 + outM;
    return clockOutMinutes >= clockInMinutes;
  },
  {
    message: t('timesheet.[id].edit.fields.clock_out.error_before'),
    path: ['clockOut'],
  },
);
