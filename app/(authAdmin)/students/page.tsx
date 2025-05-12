"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GenericTable } from "@/utils/genericTableMaster";

export default function StudentsPage() {
  const students = useQuery(api.models.student.get);
  
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Students Management</h1>
      <GenericTable 
        modelKey="students"
        data={students}
      />
    </main>
  );
}