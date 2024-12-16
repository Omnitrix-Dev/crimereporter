import { eq } from "drizzle-orm";
import { z } from "zod";
import { posts, reports } from "~/server/db/schema";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const reportRouter = createTRPCRouter({
  getAllReports: publicProcedure.query(async ({ ctx }) => {
    const reports = await ctx.db.query.reports.findMany();

    return reports;
  }),

  getReportById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const report = await ctx.db
        .select()
        .from(reports)
        .where(eq(reports.id, input.id));

      return {
        success: true,
        report,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
        createdById: ctx.session.user.id,
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  createReport: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const r = await ctx.db.insert(reports).values({
        title: input.title,
        description: "This is a description",
      });

      return {
        success: true,
      };
    }),
});
