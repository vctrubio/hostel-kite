import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { studentSchemaFields } from "../schemaFields";

export const create = mutation({
  args: studentSchemaFields,
  handler: async (ctx, args) => {
    const { age, ...profileFields } = args;
    
    return await ctx.db.insert("students", {
      ...profileFields,
      age,
    });
  },
});

export const get = query({
  handler: async (ctx) => {
    const students = await ctx.db.query("students").collect();
    return students;
  },
});

export const getById = query({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateId = mutation({
  args: {
    id: v.id("students"),
    ...studentSchemaFields,
  },
  handler: async (ctx, args) => {
    const { id, age, ...profileFields } = args;
    
    return await ctx.db.patch(id, {
      ...profileFields,
      age,
    });
  },
});

export const deleteId = mutation({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});