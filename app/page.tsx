"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Navbar from "@/components/Navbar";
import StudentForm from "@/components/forms/studentForm";
import StudentList from "@/components/list/studentList";
import UserList from "@/components/list/userList";

export default function Home() {
  const { viewer } = useQuery(api.models.users.getViewer) ?? {};

  return (
    <>
      <Navbar />
      <main className="p-8 flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-center">
          The Kite Hostel Management App2
        </h1>
        {viewer !== undefined ? (
          <p className="text-center text-xl">Welcome, {viewer ?? "Anonymous"}!</p>
        ) : (
          <p className="text-center">Loading user info...</p>
        )}
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
    <div className="flex mx-auto gap-8">
      <UserList />

      <div className="flex gap-2">
          <StudentForm />
        <StudentList />
      </div>
    </div>
  );
}
