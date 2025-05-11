import { v } from "convex/values";
import { query, mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "../_generated/dataModel";

// Get the current user's information
export const getViewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    
    if (userId === null) {
      return { viewer: null };
    }
    
    const user = await ctx.db.get(userId);
    return {
      viewer: user?.email ?? null
    };
  },
});

// Get the current user's data as JSON
export const getUserData = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    
    if (userId === null) {
      return { userData: null };
    }
    const user = await ctx.db.get(userId);
    
    if (!user) {
      return { userData: null };
    }
    
    // Determine the user's role
    let role = null;
    
    // Check if admin
    const admin = await ctx.db.query("admins")
      .filter(q => q.eq(q.field("userId"), userId))
      .first();
    if (admin) {
      role = "admin";
    } else {
      // Check if student
      const student = await ctx.db.query("students")
        .filter(q => q.eq(q.field("userId"), userId))
        .first();
      if (student) {
        role = "student";
      } else {
        // Check if teacher
        const teacher = await ctx.db.query("teachers")
          .filter(q => q.eq(q.field("userId"), userId))
          .first();
        if (teacher) {
          role = "teacher";
        }
      }
    }
    
    // Return user data with role
    return {
      ...user,
      role
    };
  },
});


// Get all users
export const get = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

// Get a specific user by ID
export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Update a user by ID
export const updateId = mutation({
  args: {
    id: v.id("users"),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    tokenIdentifier: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    return await ctx.db.patch(id, fields);
  },
});

// Delete a user by ID
export const deleteId = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Check which users are active and categorize them
export const isActive = query({
  handler: async (ctx) => {
    // Get all users
    const allUsers = await ctx.db.query("users").collect();
    
    // Get all admin users
    const admins = await ctx.db.query("admins").collect();
    const adminUserIds = new Set(admins.map(admin => admin.userId));
    
    // Get all students with userId field
    const students = await ctx.db.query("students")
      .filter(q => q.neq(q.field("userId"), undefined))
      .collect();
    const studentUserIds = new Set(students
      .map(student => student.userId)
      .filter((id): id is Id<"users"> => id !== undefined));
    
    // Get all teachers with userId field
    const teachers = await ctx.db.query("teachers")
      .filter(q => q.neq(q.field("userId"), undefined))
      .collect();
    const teacherUserIds = new Set(teachers
      .map(teacher => teacher.userId)
      .filter((id): id is Id<"users"> => id !== undefined));
    
    // Categorize users
    const adminUsers: Doc<"users">[] = [];
    const studentUsers: Doc<"users">[] = [];
    const teacherUsers: Doc<"users">[] = [];
    const inactiveUsers: Doc<"users">[] = [];
    
    allUsers.forEach(user => {
      if (adminUserIds.has(user._id)) {
        adminUsers.push(user);
      } else if (studentUserIds.has(user._id)) {
        studentUsers.push(user);
      } else if (teacherUserIds.has(user._id)) {
        teacherUsers.push(user);
      } else {
        inactiveUsers.push(user);
      }
    });
    
    return {
      admins: adminUsers,
      students: studentUsers,
      teachers: teacherUsers,
      inactive: inactiveUsers,
      allUsers
    };
  }
});
