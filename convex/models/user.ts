import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

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
    
    return user;
  },
});
