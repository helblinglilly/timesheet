import z from "zod";
import { createTRPCRouter, signedInProcedure } from "../../trpc";
import { getTimesheetByDate, clockIn, clockOut, breakIn, breakOut } from "./today";
import type { Timesheet } from "~/pocketbase/data.types";

export const timesheetRouter = createTRPCRouter({
  getMinutesPerDay: signedInProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const timesheet = await ctx.pb.collection<Timesheet>('timesheet').getOne(input.id);

      return timesheet.minutesPerDay;
    }),

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
    }),

  breakIn: signedInProcedure.input(z.object({ timesheetEntryId: z.string() }))
    .mutation(async({ input, ctx }) => {
      await breakIn(ctx.pb, input.timesheetEntryId)
    }),

  breakOut: signedInProcedure.input(z.object({ breakEntryId: z.string() }))
    .mutation(async({ input, ctx }) => {
      await breakOut(ctx.pb, input.breakEntryId)
    })
});
