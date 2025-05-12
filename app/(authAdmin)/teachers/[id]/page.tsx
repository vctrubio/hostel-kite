"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import VerificationBadge from "@/components/custom/VerificationBadge";

export default function TeacherDetailPage({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const teacherId = unwrappedParams.id;
  
  const teacher = useQuery(api.models.teacher.getById, { 
    id: teacherId as Id<"teachers">
  });

  if (teacher === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (teacher === null) {
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
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Teacher Data</h1>
            <VerificationBadge isVerified={!!teacher.userId} />
          </div>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(teacher, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}