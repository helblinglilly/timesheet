import type { Namespace, TFunction } from "i18next"
import z from "zod"

export const formSchema = (t: TFunction<Namespace, undefined>) => z.object({
  day: z.string()
    .refine(val => !isNaN(Date.parse(val)), { message: t('timesheet.[id].edit.fields.errors.not_a_date') }),
  timesheetId: z.string(),
  clockIn: z.string()
    .refine(val => !isNaN(Date.parse(val)), { message: t('timesheet.[id].edit.fields.errors.not_a_date') }),
  clockOut: z.string()
    .optional()
    .refine(val => !val || !isNaN(Date.parse(val)), { message: t('timesheet.[id].edit.fields.errors.not_a_date') }),
  breaks: z.array(z.object({
    breakIn: z.string()
      .refine(val => !isNaN(Date.parse(val)), { message: t('timesheet.[id].edit.fields.errors.not_a_date') }),
    breakOut: z.string()
      .optional()
      .refine(val => !val || !isNaN(Date.parse(val)), { message: t('timesheet.[id].edit.fields.errors.not_a_date') })
  })).optional()
});
