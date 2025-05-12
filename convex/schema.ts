import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { 
  adminSchemaFields, 
  studentSchemaFields, 
  teacherSchemaFields,
  dateSpanSchemaFields,
  kiteSchemaFields,
  barSchemaFields,
  boardSchemaFields,
  packageSchemaFields,
  bookingSchemaFields,
  equipmentSessionSchemaFields,
  lessonSchemaFields,
  paymentSchemaFields,
  postLesson
} from "./schemaFields";

export default defineSchema({
  ...authTables,

  admins: defineTable(adminSchemaFields),
  students: defineTable(studentSchemaFields),
  teachers: defineTable(teacherSchemaFields),
  dateSpans: defineTable(dateSpanSchemaFields),
  kites: defineTable(kiteSchemaFields),
  bars: defineTable(barSchemaFields),
  boards: defineTable(boardSchemaFields),
  packages: defineTable(packageSchemaFields),
  bookings: defineTable(bookingSchemaFields),
  equipmentSessions: defineTable(equipmentSessionSchemaFields),
  lessons: defineTable(lessonSchemaFields),
  payments: defineTable(paymentSchemaFields),
  postLessons: defineTable(postLesson)
});
