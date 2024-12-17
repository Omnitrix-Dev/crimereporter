import { z } from "zod";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

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
      const isExistUser = await ctx.db
        .select()
        .from(users)
        .where(eq(users.email, input.email));
      console.log("is exist user", isExistUser);

      if (isExistUser?.length > 0) {
        console.log("throw this");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "email already exist",
        });
      }

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
