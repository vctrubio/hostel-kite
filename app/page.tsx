"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Navbar from "@/components/Navbar";
import StudentForm from "@/components/forms/studentForm";
import StudentList from "@/components/list/studentList";
import UserList from "@/components/list/userList";

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

  if (viewer === undefined) {
    return (
      <div className="mx-auto">
        <p>loading... (consider a loading skeleton)</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <UserList />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Student Form */}
        <div>
          <StudentForm />
        </div>

        {/* Students List */}
        <StudentList />
      </div>
    </div>
  );
}
