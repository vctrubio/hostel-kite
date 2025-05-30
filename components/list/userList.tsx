"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect, useMemo } from "react";
import UserCard from "../card/userCard";

export default function UserList() {
  const userData = useQuery(api.models.users.getUserData);
  const { viewer } = useQuery(api.models.users.getViewer) ?? {};
  const usersQuery = useQuery(api.models.users.get);
  const users = useMemo(() => usersQuery || [], [usersQuery]);

  // Try to get user categories from isActive query
  let adminUsers: any[] = [];
  let studentUsers: any[] = [];
  let teacherUsers: any[] = [];
  let inactiveUsers: any[] = [];
  
  try {
    const userCategories = useQuery(api.models.users.isActive);
    
    if (userCategories) {
      adminUsers = userCategories.admins || [];
      studentUsers = userCategories.students || [];
      teacherUsers = userCategories.teachers || [];
      inactiveUsers = userCategories.inactive || [];
    }
  } catch (error) {
    // Fall back to showing all users if isActive isn't available
  }

  return (
    <div className="p-6 rounded-lg border">
      {/* User Categories Count */}
      <div className="mt-4 grid grid-cols-4 gap-3">
        <div className="p-3 border-2 border-purple-500 rounded-md text-center">
          <span className="block font-medium">Admin</span>
          <span className="text-lg">{adminUsers.length}</span>
        </div>
        <div className="p-3 border-2 border-green-500 rounded-md text-center">
          <span className="block font-medium">Teacher</span>
          <span className="text-lg">{teacherUsers.length}</span>
        </div>
        <div className="p-3 border-2 border-blue-500 rounded-md text-center">
          <span className="block font-medium">Student</span>
          <span className="text-lg">{studentUsers.length}</span>
        </div>
        <div className="p-3 border-2 border-gray-400 rounded-md text-center">
          <span className="block font-medium">Inactive</span>
          <span className="text-lg">{inactiveUsers.length}</span>
        </div>
      </div>

      <div className="mt-8">
        {(!adminUsers.length && !studentUsers.length && !teacherUsers.length && !inactiveUsers.length && !users.length) ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <div className="space-y-8">
            {/* Admin Users Section */}
            {adminUsers.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-purple-700 border-b pb-2">
                  Administrators ({adminUsers.length})
                </h3>
                <div className="space-y-3">
                  {adminUsers.map((user) => (
                    <UserCard key={user._id} user={user} role="admin" />
                  ))}
                </div>
              </div>
            )}
            
            {/* Teacher Users Section */}
            {teacherUsers.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-green-700 border-b pb-2">
                  Teachers ({teacherUsers.length})
                </h3>
                <div className="space-y-3">
                  {teacherUsers.map((user) => (
                    <UserCard key={user._id} user={user} role="teacher" />
                  ))}
                </div>
              </div>
            )}
            
            {/* Student Users Section */}
            {studentUsers.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-blue-700 border-b pb-2">
                  Students ({studentUsers.length})
                </h3>
                <div className="space-y-3">
                  {studentUsers.map((user) => (
                    <UserCard key={user._id} user={user} role="student" />
                  ))}
                </div>
              </div>
            )}
            
            {/* User Account Activity Section */}
            {inactiveUsers.length > 0 ? (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-700 border-b pb-2">
                  User Account Activity ({inactiveUsers.length})
                </h3>
                <div className="space-y-3">
                  {inactiveUsers.map((user) => (
                    <UserCard key={user._id} user={user} role="inactive" />
                  ))}
                </div>
              </div>
            ) : (
              // Fallback if isActive isn't working yet - show all users
              !(adminUsers.length || studentUsers.length || teacherUsers.length) && users.length > 0 && (
                <div>
                  <div className="space-y-3">
                    {users.map((user) => (
                      <UserCard key={user._id} user={user} />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}