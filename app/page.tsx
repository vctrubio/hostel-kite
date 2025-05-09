"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Navbar from "@/components/Navbar";
import StudentForm from "@/components/forms/studentForm";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="p-8 flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-center">
          The Kite Hostel Management App2
        </h1>
        <Content />
      </main>
    </>
  );
}

function Content() {
  const { viewer } = useQuery(api.models.users.getViewer) ?? {};
  const userData = useQuery(api.models.users.getUserData);
  const students = useQuery(api.models.student.listStudents) || [];

  if (viewer === undefined) {
    return (
      <div className="mx-auto">
        <p>loading... (consider a loading skeleton)</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="p-6 rounded-lg border">
        <p className="text-xl">Welcome {viewer ?? "Anonymous"}!</p>
        
        {userData ? (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">User Data:</h2>
            <pre className="p-4 border rounded-md overflow-auto">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
        ) : (
          <p>No user data available</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Student Form */}
        <div>
          <StudentForm />
        </div>

        {/* Students List */}
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
                    {student.profile?.fullName || "Unnamed Student"}
                  </h3>
                  <p className="text-sm text-gray-600">Age: {student.age}</p>
                  
                  {student.profile?.email && (
                    <p className="text-sm">Email: {student.profile.email}</p>
                  )}
                  
                  {student.profile?.phone && (
                    <p className="text-sm">Phone: {student.profile.phone}</p>
                  )}
                  
                  {student.profile?.languages && student.profile.languages.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-semibold">Languages:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {student.profile.languages.map(language => (
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
      </div>
    </div>
  );
}
