"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

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
            <div 
              key={student._id} 
              className="border rounded-md p-4 hover:bg-gray-50"
            >
              <h3 className="font-bold text-lg">
                {student.fullName || "Unnamed Student"}
              </h3>
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
          ))}
        </div>
      )}
    </div>
  );
}