"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  const student = useQuery(api.models.student.getById, { 
    id: params.id as Id<"students">
  });

  const users = useQuery(api.models.users.get) || [];
  
  // Get user data for role information
  const getUserRole = (userId: string) => {
    if (!userId) return null;
    const user = users.find(user => user._id === userId);
    return user?.role || null;
  };

  if (student === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (student === null) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-6">
        <Link href="/home" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{student.fullName}</h1>
          <p className="text-gray-600 mb-4">Age: {student.age}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Contact Information</h2>
              <div className="space-y-2">
                {student.email && (
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Email:</span> {student.email}
                  </p>
                )}
                
                {student.phone && (
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Phone:</span> {student.phone}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3">User Information</h2>
              {student.userId ? (
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">User ID:</span> 
                    <span className="text-sm text-gray-500">{student.userId}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Role:</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                      {getUserRole(student.userId) || "User"}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No user account linked</p>
              )}
            </div>
          </div>
          
          {student.languages && student.languages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {student.languages.map(language => (
                  <span key={language} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}