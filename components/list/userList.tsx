"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";
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
  let totalUsers = users.length;
  let isCategorized = false;
  
  try {
    const userCategories = useQuery(api.models.users.isActive);
    
    if (userCategories) {
      adminUsers = userCategories.admins || [];
      studentUsers = userCategories.students || [];
      teacherUsers = userCategories.teachers || [];
      inactiveUsers = userCategories.inactive || [];
      totalUsers = userCategories.allUsers?.length || users.length;
      isCategorized = true;
    }
  } catch (error) {
    // Fall back to showing all users if isActive isn't available
  }

  return (
    <div className="p-6 rounded-lg border">
      <h2 className="text-2xl font-bold mb-6">User Information</h2>
      <p className="text-xl mb-4">Welcome {viewer ?? "Anonymous"}!</p>
      
      {userData ? (
        <div className="mt-4 mb-6">
          <h3 className="text-xl font-semibold mb-2">Current User Data:</h3>
          <pre className="p-4 border rounded-md overflow-auto">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
      ) : (
        <p className="mb-6">No user data available</p>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">
          All Users <span className="text-lg font-normal">({totalUsers})</span>
        </h3>
        
        {totalUsers === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <div className="space-y-8">
            {/* Stats summary */}
            {isCategorized && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border border-purple-200 rounded-md bg-purple-50">
                  <p className="text-sm text-purple-800">Admins</p>
                  <p className="text-2xl font-bold text-purple-700">{adminUsers.length}</p>
                </div>
                <div className="p-4 border border-green-200 rounded-md bg-green-50">
                  <p className="text-sm text-green-800">Teachers</p>
                  <p className="text-2xl font-bold text-green-700">{teacherUsers.length}</p>
                </div>
                <div className="p-4 border border-blue-200 rounded-md bg-blue-50">
                  <p className="text-sm text-blue-800">Students</p>
                  <p className="text-2xl font-bold text-blue-700">{studentUsers.length}</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                  <p className="text-sm text-gray-800">Inactive</p>
                  <p className="text-2xl font-bold text-gray-700">{inactiveUsers.length}</p>
                </div>
              </div>
            )}

            {isCategorized ? (
              <>
                {/* Admin Users Section - always display */}
                <div>
                  <h4 className="text-lg font-medium mb-3 flex items-center">
                    <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                    Admin Users ({adminUsers.length})
                  </h4>
                  {adminUsers.length === 0 ? (
                    <p className="text-gray-500 ml-5">No admin users found.</p>
                  ) : (
                    <div className="space-y-3">
                      {adminUsers.map((user) => (
                        <UserCard key={user._id} user={user} role="admin" />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Teacher Users Section - always display */}
                <div>
                  <h4 className="text-lg font-medium mb-3 flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Teacher Users ({teacherUsers.length})
                  </h4>
                  {teacherUsers.length === 0 ? (
                    <p className="text-gray-500 ml-5">No teacher users found.</p>
                  ) : (
                    <div className="space-y-3">
                      {teacherUsers.map((user) => (
                        <UserCard key={user._id} user={user} role="teacher" />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Student Users Section - always display */}
                <div>
                  <h4 className="text-lg font-medium mb-3 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    Student Users ({studentUsers.length})
                  </h4>
                  {studentUsers.length === 0 ? (
                    <p className="text-gray-500 ml-5">No student users found.</p>
                  ) : (
                    <div className="space-y-3">
                      {studentUsers.map((user) => (
                        <UserCard key={user._id} user={user} role="student" />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Inactive Users Section - always display */}
                <div>
                  <h4 className="text-lg font-medium mb-3 flex items-center">
                    <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                    Inactive Users ({inactiveUsers.length})
                  </h4>
                  {inactiveUsers.length === 0 ? (
                    <p className="text-gray-500 ml-5">No inactive users found.</p>
                  ) : (
                    <div className="space-y-3">
                      {inactiveUsers.map((user) => (
                        <UserCard key={user._id} user={user} role="inactive" />
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Fallback if isActive isn't working yet - show all users
              <div>
                <h4 className="text-lg font-medium mb-3">All Users ({users.length})</h4>
                <div className="space-y-3">
                  {users.map((user) => (
                    <UserCard key={user._id} user={user} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}