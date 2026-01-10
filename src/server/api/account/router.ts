import z from 'zod';
import type { TimesheetConfig, User } from '~/pocketbase/data.types';
import { TableNames } from '~/pocketbase/tables.types';
import { createTRPCRouter, signedInProcedure } from '../trpc';

export const accountRouter = createTRPCRouter({
  /**
    * Get current authenticated user
    */
  getFullUserDetails: signedInProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.pb.authStore.record?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const user = await ctx.pb.collection<User>(TableNames.User).getOne(userId);

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        memberSince: user.created,
      };
    }),
  updateName: signedInProcedure
    .input(z.object({ userId: z.string(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.pb.collection<User>(TableNames.User).update(input.userId, {
        name: input.name
      })
    }),

  getNumberOfOwnedTimesheets: signedInProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const timesheets = await ctx.pb.collection<TimesheetConfig>(TableNames.TimesheetConfig).getList(1, 10, {
        filter: `user="${input.userId}"`
      })

      return {
        totalNumber: timesheets.totalItems,
        timesheets: timesheets.items.map((timesheet) => ({
          slug: `/timesheet/${timesheet.id}#dangerZone`,
          name: timesheet.name,
        }))
      }
    }),

  deleteAccount:  signedInProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.pb.collection<User>(TableNames.User).delete(input.userId)
    }),
});
