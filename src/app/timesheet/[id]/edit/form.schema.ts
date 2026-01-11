
import type { Namespace, TFunction } from 'i18next';
import z from 'zod';

export const formSchema = (t: TFunction<Namespace, undefined>) =>
  z.discriminatedUnion('mode', [
    z.object({
      mode: z.literal('no_target'),
      id: z.string().length(15),
    }),
    z.object({
      mode: z.literal('target'),
      id: z.string().length(15),
      minutesPerDay: z.object({
        hours: z.number({
          error: (iss) => iss.input === undefined ? t('timesheet.new.fields.minutesPerDay.hours.error_required') : undefined
        }).min(0).max(24, {
          message: t('timesheet.new.fields.minutesPerDay.hours.error_max'),
        }),
        minutes: z.number({
          error: (iss) => iss.input === undefined ? t('timesheet.new.fields.minutesPerDay.minutes.error_required') : undefined
        }).min(0).max(59, {
          message: t('timesheet.new.fields.minutesPerDay.minutes.error_max'),
        }),
      }),
      daysPerWeek: z.number({
        error: (iss) => iss.input === undefined ? t('timesheet.new.fields.daysPerWeek.error_required') : undefined
      }).min(0.5, {
        message: t('timesheet.new.fields.daysPerWeek.error_min'),
      }).max(7, {
        message: t('timesheet.new.fields.daysPerWeek.error_max'),
      }),
      unpaidLunchMinutes: z.number().optional(),
      paidLunchMinutes: z.number().optional(),
    }),
  ]);
