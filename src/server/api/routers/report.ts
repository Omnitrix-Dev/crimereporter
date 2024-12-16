import { eq } from "drizzle-orm";
import { z } from "zod";
import { posts, reports } from "~/server/db/schema";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const reportRouter = createTRPCRouter({
  publicCreateReport: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        reportType: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const r = await ctx.db
        .insert(reports)
        .values({
          title: input.title,
          description: "This is a description",
          reportType: input.reportType,
        })
        .returning({ id: reports.id });

      return {
        success: true,
        r,
      };
    }),

  createReport: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const r = await ctx.db.insert(reports).values({
        title: input.title,
        description: "This is a description",
        reportType: "EMERGENCY",
      });

      return {
        success: true,
      };
    }),
});
