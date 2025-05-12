import { v } from "convex/values";

// USERS - students, teachers, admins/managers //////////////////////////////////////////
const profileFields = {
  languages: v.array(
    v.union(v.literal("English"), v.literal("Spanish"), v.literal("French")),
  ),
  fullName: v.string(),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  userId: v.optional(v.id("users")),
};

export const studentSchemaFields = {
  ...profileFields,
  age: v.number(),
};
export const teacherSchemaFields = {
  ...profileFields,
};
export const adminSchemaFields = {
  userId: v.id("users"),
  role: v.union(v.literal("manager"), v.literal("teacher")),
};

// DATESpan to track users availability for bookings and organisation ///////////////////////////////////////////////////////////////////// ////////////////////
export const dateSpanSchemaFields = {
  startDate: v.string(),
  endDate: v.string(),
  studentId: v.array(v.id("students")), //array if multiple students arriving together.
};

// Equipment - This is fixed for now, idea is to make the admin able to create their models - kite, bar, board /////////////////////////////////////////////////
export const kiteSchemaFields = {
  model: v.string(),
  size: v.number(),
};

export const barSchemaFields = {
  model: v.string(),
  size: v.number(), // length of lines
};

export const boardSchemaFields = {
  model: v.string(),
  size: v.number(),
};

// Pre Lessons (everything needed before a lesson) - Packages, Bookings, DateSpan? //////////////////// DateSPan to be implemented last please /////////////////

export const packageSchemaFields = {
  price: v.number(),
  hours: v.number(),
  capacity: v.number(),
  desc: v.optional(v.string()),
  // creationDate: v.string(), // Store as ISO string like "2024-03-21T14:37:15Z"
};

export const bookingSchemaFields = {
  packageId: v.id("packages"),
  studentsIds: v.array(v.id("students")),
  startDate: v.string(),
  //can add a comments field if needed
};

// Lessons Settings (this can be in pre lessons creation, or after a lesson is created, it can be added. and it must be added) EquipmentSessions ////////////////////////

export const sessionSchemaFields = {
  kiteId: v.id("kites"),
  barId: v.id("bars"),
  boardId: v.id("boards"),
  date: v.string(),
  duration: v.number(), // in minutes, = hours, to know what to subtract from the bookingPackage
};

export const lessonSchemaFields = {
  teacherId: v.id("teachers"),
  bookingId: v.id("bookings"),
  sessionId: v.array(v.id("sessions")),
  paymentId: v.id("payments"),
  postLesson: v.id("postLessons"),
};

// Post Lessons (fired after a lesson occurs) - Payment, PostLessonStudentConfirmation, //////////////////// ///////////////////////////////////////////////////

export const paymentSchemaFields = {
  cash: v.boolean(), //if false, it is a bank transfer
  date: v.string(), // Store as ISO string like "2024-03-21T14:37:15Z"
  amount: v.number(),
  //paymentMethod: v.union(v.literal("cash"), v.literal("bankTransfer"), v.literal("stripeInApp")),
};

export const postLesson = {
  studentConfirmation: v.boolean(), //if false, it is a bank transfer
  // teacherConfirmation
  // studentFeedback = rating 1-5, or desc
};
