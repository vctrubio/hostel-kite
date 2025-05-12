import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { kiteSchemaFields, barSchemaFields, boardSchemaFields } from "../schemaFields";

// Kites
export const getKites = query({
  handler: async (ctx) => {
    return await ctx.db.query("kites").collect();
  },
});

export const getKiteById = query({
  args: { id: v.id("kites") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createKite = mutation({
  args: kiteSchemaFields,
  handler: async (ctx, args) => {
    return await ctx.db.insert("kites", args);
  },
});

export const updateKite = mutation({
  args: {
    id: v.id("kites"),
    ...kiteSchemaFields,
  },
  handler: async (ctx, args) => {
    const { id, ...kiteData } = args;
    return await ctx.db.patch(id, kiteData);
  },
});

export const deleteKite = mutation({
  args: { id: v.id("kites") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Boards
export const getBoards = query({
  handler: async (ctx) => {
    return await ctx.db.query("boards").collect();
  },
});

export const getBoardById = query({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createBoard = mutation({
  args: boardSchemaFields,
  handler: async (ctx, args) => {
    return await ctx.db.insert("boards", args);
  },
});

export const updateBoard = mutation({
  args: {
    id: v.id("boards"),
    ...boardSchemaFields,
  },
  handler: async (ctx, args) => {
    const { id, ...boardData } = args;
    return await ctx.db.patch(id, boardData);
  },
});

export const deleteBoard = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Bars
export const getBars = query({
  handler: async (ctx) => {
    return await ctx.db.query("bars").collect();
  },
});

export const getBarById = query({
  args: { id: v.id("bars") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createBar = mutation({
  args: barSchemaFields,
  handler: async (ctx, args) => {
    return await ctx.db.insert("bars", args);
  },
});

export const updateBar = mutation({
  args: {
    id: v.id("bars"),
    ...barSchemaFields,
  },
  handler: async (ctx, args) => {
    const { id, ...barData } = args;
    return await ctx.db.patch(id, barData);
  },
});

export const deleteBar = mutation({
  args: { id: v.id("bars") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});