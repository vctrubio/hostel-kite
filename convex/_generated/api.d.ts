/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as models_admin from "../models/admin.js";
import type * as models_booking from "../models/booking.js";
import type * as models_equipment from "../models/equipment.js";
import type * as models_package from "../models/package.js";
import type * as models_student from "../models/student.js";
import type * as models_teacher from "../models/teacher.js";
import type * as models_users from "../models/users.js";
import type * as schemaFields from "../schemaFields.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  http: typeof http;
  "models/admin": typeof models_admin;
  "models/booking": typeof models_booking;
  "models/equipment": typeof models_equipment;
  "models/package": typeof models_package;
  "models/student": typeof models_student;
  "models/teacher": typeof models_teacher;
  "models/users": typeof models_users;
  schemaFields: typeof schemaFields;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
