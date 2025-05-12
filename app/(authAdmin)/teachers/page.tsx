"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GenericTable } from "@/utils/genericTableMaster";

export default function TeachersPage() {
  const teachers = useQuery(api.models.teacher.get);
  
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Teachers</h1>
      <GenericTable 
        modelKey="teachers"
        data={teachers}
      />
    </main>
  );
}