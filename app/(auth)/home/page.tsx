"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import UserList from "@/components/list/userList";
import StudentForm from "@/components/forms/studentForm";
import StudentList from "@/components/list/studentList";
import TeacherForm from "@/components/forms/teacherForm";
import TeacherList from "@/components/list/teacherList";

export default function HomePage() {
  const { viewer } = useQuery(api.models.users.getViewer) ?? {};
  const userData = useQuery(api.models.users.getUserData);

  if (viewer === undefined) {
    return (
      <div className="mx-auto p-8">
        <p className="text-xl text-center">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        {userData && (
          <p>Role: <span className="font-medium">{userData.role || "Not assigned"}</span></p>
        )}
      </header>

      <div className="flex flex-col gap-8">
        <UserList />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">Students</h2>
            <StudentForm />
            <StudentList />
          </div>
          
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">Teachers</h2>
            <TeacherForm />
            <TeacherList />
          </div>
        </div>
      </div>
    </div>
  );
}
