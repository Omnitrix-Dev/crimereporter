import { z } from "zod";
import { posts, reports, users } from "~/server/db/schema";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({ name: z.string(), email: z.string(), password: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.insert(users).values({
        name: input.name,
        email: input.email,
        password: input.password,
      });

      return {
        success: true,
        user,
      };
    }),
});
