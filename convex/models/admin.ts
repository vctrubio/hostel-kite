import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

/**
 * Link a student account to a user account
 * 
 * This function will:
 * - Verify that the provided ID is for a student
 * - Check if the student already has a userId assigned
 * - Update the student's profile to include the userId
 */
export const linkStudentAccount = mutation({
  args: {
    studentId: v.id("students"),
    userId: v.id("users")
  },
  handler: async (ctx, args) => {
    const { studentId, userId } = args;
    
    // Verify student exists
    const student = await ctx.db.get(studentId);
    if (!student) {
      throw new Error(`Student with ID ${studentId} not found`);
    }
    
    // Check if student already has a userId assigned
    if (student.userId) {
      throw new Error(`Student with ID ${studentId} is already linked to user ID ${student.userId}`);
    }
    
    // Verify user exists
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Check if this user is already linked to another student
    const existingStudent = await ctx.db.query("students")
      .filter(q => q.eq(q.field("userId"), userId))
      .first();
    
    if (existingStudent) {
      throw new Error(`User with ID ${userId} is already linked to another student with ID ${existingStudent._id}`);
    }
    
    // Update the student record with the userId
    await ctx.db.patch(studentId, {
      userId: userId
    });
    
    return { success: true, studentId, userId };
  }
});

/**
 * Link a teacher account to a user account
 * 
 * This function will:
 * - Verify that the provided ID is for a teacher
 * - Check if the teacher already has a userId assigned
 * - Update the teacher's profile to include the userId
 */
export const linkTeacherAccount = mutation({
  args: {
    teacherId: v.id("teachers"),
    userId: v.id("users")
  },
  handler: async (ctx, args) => {
    const { teacherId, userId } = args;
    
    // Verify teacher exists
    const teacher = await ctx.db.get(teacherId);
    if (!teacher) {
      throw new Error(`Teacher with ID ${teacherId} not found`);
    }
    
    // Check if teacher already has a userId assigned
    if (teacher.userId) {
      throw new Error(`Teacher with ID ${teacherId} is already linked to user ID ${teacher.userId}`);
    }
    
    // Verify user exists
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Check if this user is already linked to another teacher
    const existingTeacher = await ctx.db.query("teachers")
      .filter(q => q.eq(q.field("userId"), userId))
      .first();
    
    if (existingTeacher) {
      throw new Error(`User with ID ${userId} is already linked to another teacher with ID ${existingTeacher._id}`);
    }
    
    // Update the teacher record with the userId
    await ctx.db.patch(teacherId, {
      userId: userId
    });
    
    return { success: true, teacherId, userId };
  }
});

/**
 * Create a new admin entry with manager role for a user
 * 
 * This function will:
 * - Verify that the provided user exists
 * - Create a new admin entry with the role of manager
 */
export const linkManagerAccount = mutation({
  args: {
    userId: v.id("users")
  },
  handler: async (ctx, args) => {
    const { userId } = args;
    
    // Verify user exists
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Check if this user is already an admin
    const existingAdmin = await ctx.db.query("admins")
      .filter(q => q.eq(q.field("userId"), userId))
      .first();
    
    if (existingAdmin) {
      throw new Error(`User with ID ${userId} is already an admin`);
    }
    
    // Create a new admin entry with manager role
    const adminId = await ctx.db.insert("admins", {
      userId,
      role: "manager"
    });
    
    return { success: true, adminId, userId };
  }
});