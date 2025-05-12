import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { lessonSchemaFields } from "../schemaFields";

export const create = mutation({
  args: {
    teacherId: v.id("teachers"),
    bookingId: v.id("bookings"),
    sessionId: v.optional(v.array(v.id("sessions"))),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("lessons", {
      teacherId: args.teacherId,
      bookingId: args.bookingId,
      sessionId: args.sessionId || [],
    });
  },
});

export const get = query({
  handler: async (ctx) => {
    const lessons = await ctx.db.query("lessons").collect();
    return lessons;
  },
});

export const getById = query({
  args: { id: v.id("lessons") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateId = mutation({
  args: {
    id: v.id("lessons"),
    teacherId: v.id("teachers"),
    bookingId: v.id("bookings"),
    sessionId: v.array(v.id("sessions")),
  },
  handler: async (ctx, args) => {
    const { id, ...lessonData } = args;
    return await ctx.db.patch(id, lessonData);
  },
});

export const addSessionToLesson = mutation({
  args: {
    lessonId: v.id("lessons"),
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) {
      throw new Error(`Lesson with id ${args.lessonId} not found`);
    }
    
    const sessionIds = [...(lesson.sessionId || []), args.sessionId];
    
    return await ctx.db.patch(args.lessonId, {
      sessionId: sessionIds,
    });
  },
});

export const removeSessionFromLesson = mutation({
  args: {
    lessonId: v.id("lessons"),
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) {
      throw new Error(`Lesson with id ${args.lessonId} not found`);
    }
    
    const sessionIds = (lesson.sessionId || []).filter(
      id => id !== args.sessionId
    );
    
    return await ctx.db.patch(args.lessonId, {
      sessionId: sessionIds,
    });
  },
});

export const deleteId = mutation({
  args: { id: v.id("lessons") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});