import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { packageSchemaFields } from "../schemaFields";

export const create = mutation({
  args: packageSchemaFields,
  handler: async (ctx, args) => {
    return await ctx.db.insert("packages", args);
  },
});

export const get = query({
  handler: async (ctx) => {
    const packages = await ctx.db.query("packages").collect();
    return packages;
  },
});

export const getById = query({
  args: { id: v.id("packages") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateId = mutation({
  args: {
    id: v.id("packages"),
    ...packageSchemaFields,
  },
  handler: async (ctx, args) => {
    const { id, ...packageData } = args;
    return await ctx.db.patch(id, packageData);
  },
});

export const deleteId = mutation({
  args: { id: v.id("packages") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});