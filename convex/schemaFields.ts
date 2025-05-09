import { v } from "convex/values";

export const profileSchema = v.optional(
  v.object({
    languages: v.array(
      v.union(v.literal("English"), v.literal("Spanish"), v.literal("French"))
    ),
    fullName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    userId: v.optional(v.id("users")),
  })
);

export const studentSchemaFields = {
  profile: profileSchema,
  age: v.number(),
};

export const teacherSchemaFields = {
  profile: profileSchema,
};

// Define admin schema fields
export const adminSchemaFields = {
  userId: v.id("users"),
  role: v.union(v.literal("manager"), v.literal("teacher")),
};