"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import VerificationBadge from "@/components/custom/VerificationBadge";

export default function StudentList() {
  const students = useQuery(api.models.student.get) || [];

  return (
    <div className="p-6 rounded-lg shadow-md border">
      <h2 className="text-2xl font-bold mb-6">Students List</h2>
      
      {students.length === 0 ? (
        <p className="text-gray-500">No students added yet.</p>
      ) : (
        <div className="space-y-4">
          {students.map((student) => (
            <Link href={`/students/${student._id}`} key={student._id}>
              <div 
                className="border rounded-md p-4 hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">
                    {student.fullName || "Unnamed Student"}
                  </h3>
                  <VerificationBadge isVerified={!!student.userId} size="sm" />
                </div>
                <p className="text-sm text-gray-600">Age: {student.age}</p>
                
                {student.email && (
                  <p className="text-sm">Email: {student.email}</p>
                )}
                
                {student.phone && (
                  <p className="text-sm">Phone: {student.phone}</p>
                )}
                
                {student.languages && student.languages.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-semibold">Languages:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {student.languages.map(language => (
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