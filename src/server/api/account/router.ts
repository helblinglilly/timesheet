import z from 'zod';
import type { User } from '~/pocketbase/data.types';
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

  /**
   * Returns timesheet_config.minutesPerDay
   */
  updateName: signedInProcedure
    .input(z.object({ userId: z.string(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.pb.collection<User>(TableNames.User).update(input.userId, {
        name: input.name
      })
    }),


});
