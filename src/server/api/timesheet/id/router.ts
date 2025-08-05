import z from "zod";
import { createTRPCRouter, signedInProcedure } from "../../trpc";
import { getTimesheetByDate, clockIn, clockOut } from "./today";

export const timesheetRouter = createTRPCRouter({
  getTimesheetDayById: signedInProcedure
    .input(z.object({ id: z.string(), day: z.string() }))
    .query(async ({ input, ctx }) => {
      return await getTimesheetByDate(ctx.pb, input.id, new Date(input.day))
    }),

  clockIn: signedInProcedure.input(z.object({ id: z.string(), day: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await clockIn(ctx.pb, input.id, new Date(input.day))
    }),

  clockOut: signedInProcedure.input(z.object({ timesheetEntryId: z.string() }))
    .mutation(async({ input, ctx }) => {
      await clockOut(ctx.pb, input.timesheetEntryId)
    })
});
