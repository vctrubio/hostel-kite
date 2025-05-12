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

export const getWithDetails = query({
  handler: async (ctx) => {
    const lessons = await ctx.db.query("lessons").collect();
    
    // Collect all the necessary details in parallel for better performance
    const lessonsWithDetails = await Promise.all(
      lessons.map(async (lesson) => {
        // Get teacher details
        const teacher = await ctx.db.get(lesson.teacherId);
        
        // Get booking details
        const booking = await ctx.db.get(lesson.bookingId);
        if (!booking) {
          return {
            ...lesson,
            teacherName: teacher ? teacher.fullName : "Unknown Teacher",
            packageName: "Unknown Package",
            packageInfo: null,
            bookingInfo: null,
            studentNames: "No students",
            date: "No date",
            sessionCount: (lesson.sessionId || []).length
          };
        }
        
        // Get package details directly from the booking
        const packageInfo = await ctx.db.get(booking.packageId);
        
        // Get student details
        const studentNames = await Promise.all(
          booking.studentsIds.map(async (studentId) => {
            const student = await ctx.db.get(studentId);
            return student ? student.fullName : "Unknown Student";
          })
        );
        
        return {
          ...lesson,
          teacherName: teacher ? teacher.fullName : "Unknown Teacher",
          packageName: packageInfo ? packageInfo.desc : "Unknown Package",
          packageInfo: packageInfo || null,
          bookingInfo: booking,
          studentNames: studentNames.join(", "),
          date: booking.startDate || "No date",
          sessionCount: (lesson.sessionId || []).length
        };
      })
    );
    
    return lessonsWithDetails;
  },
});