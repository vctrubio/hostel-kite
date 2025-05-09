import { v } from "convex/values";

// Define the profile fields without wrapping in v.optional yet
const profileFields = {
  languages: v.array(
    v.union(v.literal("English"), v.literal("Spanish"), v.literal("French"))
  ),
  fullName: v.string(),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  userId: v.optional(v.id("users")),
};

// Export the profile schema as optional for standalone use
export const profileSchema = v.optional(v.object(profileFields));

// Export student schema fields, spreading profile fields directly
export const studentSchemaFields = {
  ...profileFields,
  age: v.number(),
};

// Export teacher schema fields, spreading profile fields directly
export const teacherSchemaFields = {
  ...profileFields,
};

// Define admin schema fields
export const adminSchemaFields = {
  userId: v.id("users"),
  role: v.union(v.literal("manager"), v.literal("teacher")),
};