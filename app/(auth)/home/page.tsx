"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import UserList from "@/components/list/userList";
import StudentForm from "@/components/forms/studentForm";
import StudentList from "@/components/list/studentList";

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

      <div className="flex gap-8">
        <UserList />
        <div className="flex gap-4">
          <StudentForm />
          <StudentList />
        </div>
      </div>
    </div>
  );
}
