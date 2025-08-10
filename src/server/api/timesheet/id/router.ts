import z from "zod";
import { createTRPCRouter, signedInProcedure } from "../../trpc";
import { getTimesheetByDate, clockIn, clockOut, breakIn, breakOut, deleteAllEntries } from "./today";
import type { TimesheetConfig } from "~/pocketbase/data.types";
import { TableNames } from "~/pocketbase/tables.types";

export const timesheetRouter = createTRPCRouter({
  /**
   * Returns timesheet_config.minutesPerDay
   */
  getMinutesPerDay: signedInProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const timesheetConfig = await ctx.pb.collection<TimesheetConfig>(TableNames.TimesheetConfig).getOne(input.id);

      return timesheetConfig.minutesPerDay;
    }),

  /**
   * Returns combined timesheet_entries and timesheet_breaks for a given timesheet_config
   */
  getTimesheetDayById: signedInProcedure
    .input(z.object({ id: z.string(), day: z.string() }))
    .query(async ({ input, ctx }) => {
      return await getTimesheetByDate(ctx.pb, input.id, new Date(input.day))
    }),

  /**
   * Creates a new timesheet_entries clock in entry.
   * If a clock in for this day already exists, it will update it
   */
  clockIn: signedInProcedure.input(z.object({ id: z.string(), day: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await clockIn(ctx.pb, input.id, new Date(input.day))
    }),

  /**
   * Updates the timesheet_entries record with the clock out field
   * If a clock out already exists, it will update it
   */
  clockOut: signedInProcedure.input(z.object({ timesheetEntryId: z.string() }))
    .mutation(async({ input, ctx }) => {
      await clockOut(ctx.pb, input.timesheetEntryId)
    }),

  /**
   * Creates a new timesheet_breaks entry with a break_in record
   * If the entry already exists, it will error
   */
  breakIn: signedInProcedure.input(z.object({ timesheetEntryId: z.string() }))
    .mutation(async({ input, ctx }) => {
      await breakIn(ctx.pb, input.timesheetEntryId)
    }),
  /**
   * Updates a timesheet_breaks entry with a break_out field
   * If the entry already has a break_out entry, it will error
   */
  breakOut: signedInProcedure.input(z.object({ breakEntryId: z.string() }))
    .mutation(async({ input, ctx }) => {
      await breakOut(ctx.pb, input.breakEntryId)
    }),

  /**
   * Deletes all timesheet_entries and timesheet_break entries tied to a given timesheet_config
   */
  deleteAllEntries: signedInProcedure.input(z.object({ timesheetConfigId: z.string() }))
    .mutation(async ({ input, ctx}) => {
      await deleteAllEntries(ctx.pb, input.timesheetConfigId)
    }),

  deleteTimesheet: signedInProcedure.input(z.object({ timesheetConfigId: z.string() }))
    .mutation(async ({ input, ctx}) => {
      await ctx.pb.collection(TableNames.TimesheetConfig).delete(input.timesheetConfigId);
    }),
});
