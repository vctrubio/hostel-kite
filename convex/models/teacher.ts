import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { teacherSchemaFields } from "../schemaFields";

export const create = mutation({
  args: teacherSchemaFields,
  handler: async (ctx, args) => {
    const profileFields = args;
    
    return await ctx.db.insert("teachers", {
      ...profileFields,
    });
  },
});

export const get = query({
  handler: async (ctx) => {
    const teachers = await ctx.db.query("teachers").collect();
    return teachers;
  },
});

export const getById = query({
  args: { id: v.id("teachers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateId = mutation({
  args: {
    id: v.id("teachers"),
    ...teacherSchemaFields,
  },
  handler: async (ctx, args) => {
    const { id, ...profileFields } = args;
    
    return await ctx.db.patch(id, {
      ...profileFields,
    });
  },
});

export const deleteId = mutation({
  args: { id: v.id("teachers") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});