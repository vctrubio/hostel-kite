import { v } from "convex/values";
import { action, query } from "./_generated/server";

export const getId = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    try {
      // Here we directly use ctx.db.get with the provided ID string
      const retrievedUser = await ctx.db.get(args.id as any);
      return retrievedUser;
    } catch (error) {
      console.error("Error fetching ID:", error);
      return null;
    }
  },
});

export const myFt = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return identity;
  },
})

