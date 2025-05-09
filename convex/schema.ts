import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const profileSchema = v.object({
  languages: v.array(
    v.union(v.literal("English"), v.literal("Spanish"), v.literal("French"))
  ),
  fullName: v.string(),
  email: v.string(),
  phone: v.string(),
});

export default defineSchema({
  ...authTables,

  admins: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("manager"), v.literal("teacher")),
  }),

  // ✅ Remove `profile` table. We're embedding the profile directly.
  students: defineTable({
    profile: profileSchema,
    age: v.number(),
  }),

  teacher: defineTable({
    profile: profileSchema,
  }),
});
