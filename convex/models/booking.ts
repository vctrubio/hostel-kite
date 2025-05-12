import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { bookingSchemaFields } from "../schemaFields";

export const create = mutation({
  args: bookingSchemaFields,
  handler: async (ctx, args) => {
    return await ctx.db.insert("bookings", args);
  },
});

export const get = query({
  handler: async (ctx) => {
    const bookings = await ctx.db.query("bookings").collect();
    return bookings;
  },
});

export const getById = query({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateId = mutation({
  args: {
    id: v.id("bookings"),
    ...bookingSchemaFields,
  },
  handler: async (ctx, args) => {
    const { id, ...bookingData } = args;
    return await ctx.db.patch(id, bookingData);
  },
});

export const deleteId = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});