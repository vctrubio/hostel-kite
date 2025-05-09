import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { adminSchemaFields, studentSchemaFields, teacherSchemaFields } from "./schemaFields";

export default defineSchema({
  ...authTables,

  admins: defineTable(adminSchemaFields),
  students: defineTable(studentSchemaFields),
  teachers: defineTable(teacherSchemaFields),
});
