import { query, mutation } from "../_generated/server";
import { studentSchemaFields } from "../schemaFields";

// Function to create a new student
export const createStudent = mutation({
  args: studentSchemaFields,
  handler: async (ctx, args) => {
    return await ctx.db.insert("students", {
      profile: args.profile,
      age: args.age,
    });
  },
});

// Function to list all students
export const listStudents = query({
  handler: async (ctx) => {
    const students = await ctx.db.query("students").collect();
    return students;
  },
});