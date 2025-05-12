import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { sessionSchemaFields } from "../schemaFields";

export const create = mutation({
  args: sessionSchemaFields,
  handler: async (ctx, args) => {
    return await ctx.db.insert("sessions", args);
  },
});

export const get = query({
  handler: async (ctx) => {
    const sessions = await ctx.db.query("sessions").collect();
    return sessions;
  },
});

export const getSessionsByLessonId = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson || !lesson.sessionId || lesson.sessionId.length === 0) {
      return [];
    }

    const sessions = await Promise.all(
      lesson.sessionId.map(id => ctx.db.get(id))
    );
    
    return sessions.filter(Boolean);
  },
});

export const getById = query({
  args: { id: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateId = mutation({
  args: {
    id: v.id("sessions"),
    ...sessionSchemaFields,
  },
  handler: async (ctx, args) => {
    const { id, ...sessionData } = args;
    return await ctx.db.patch(id, sessionData);
  },
});

export const deleteId = mutation({
  args: { id: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});