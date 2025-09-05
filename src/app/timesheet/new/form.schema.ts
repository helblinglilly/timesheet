import type { Namespace, TFunction } from 'i18next';
import z from 'zod';

export const formSchema = (t: TFunction<Namespace, undefined>) => z.object({
  name: z.string().min(3, {
    message: t('timesheet.new.fields.name.error_short'),
  }),
  minutesPerDay: z.object({
    hours: z.coerce.number().min(0).max(24, {
      message: t('timesheet.new.fields.minutesPerDay.hours.error_max'),
    }),
    minutes: z.coerce.number().min(0).max(59, {
      message: t('timesheet.new.fields.minutesPerDay.minutes.error_max'),
    }),
  }).required(),
  daysPerWeek: z.coerce.number().min(0.5).max(7, {
    message: t('timesheet.new.fields.daysPerWeek.error_max'),
  }),
  unpaidLunchMinutes: z.coerce.number().optional(),
  paidLunchMinutes: z.coerce.number().optional(),
});
