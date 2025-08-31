import type { Namespace, TFunction } from "i18next"
import z from "zod"

export const formSchema = (t: TFunction<Namespace, undefined>) => z.object({
  id: z.string(),
  day: z.string(),
  clockIn: z.string(),
  breaks: z.array(z.object({
    breakIn: z.string(),
    breakOut: z.string().optional()
  })),
  clockOut: z.string().optional()
})
