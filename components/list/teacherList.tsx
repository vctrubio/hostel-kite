"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import VerificationBadge from "@/components/ui/VerificationBadge";

export default function TeacherList() {
  const teachers = useQuery(api.models.teacher.get) || [];
  const users = useQuery(api.models.users.get) || [];

  // Get user data for role information
  const getUserRole = (userId: string) => {
    if (!userId) return null;
    const user = users.find(user => user._id === userId);
    return user?.role || null;
  };

  return (
    <div className="p-6 rounded-lg shadow-md border">
      <h2 className="text-2xl font-bold mb-6">Teachers List</h2>
      
      {teachers.length === 0 ? (
        <p className="text-gray-500">No teachers added yet.</p>
      ) : (
        <div className="space-y-4">
          {teachers.map((teacher) => (
            <Link href={`/teachers/${teacher._id}`} key={teacher._id}>
              <div className="border rounded-md p-4 hover:bg-gray-100 cursor-pointer">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">
                    {teacher.fullName || "Unnamed Teacher"}
                  </h3>
                  <VerificationBadge isVerified={!!teacher.userId} size="sm" />
                </div>
                
                {teacher.email && (
                  <p className="text-sm">Email: {teacher.email}</p>
                )}
                
                {teacher.phone && (
                  <p className="text-sm">Phone: {teacher.phone}</p>
                )}
                
                {teacher.userId && (
                  <p className="text-sm mt-1 font-medium">
                    Role: <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                      {getUserRole(teacher.userId) || "User"}
                    </span>
                  </p>
                )}
                
                {teacher.languages && teacher.languages.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-semibold">Languages:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {teacher.languages.map(language => (
                        <span key={language} className="px-2 py-1 text-xs border rounded-full">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}