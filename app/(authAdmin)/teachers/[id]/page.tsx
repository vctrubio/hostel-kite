"use client";

import React from "react";
import { useParams } from "next/navigation";
import GenericEntityForm from "@/components/forms/GenericEntityForm";

export default function TeacherDetailPage() {
  const params = useParams();
  const teacherId = params.id as string;
  
  return (
    <div className="max-w-3xl mx-auto p-8">
      <GenericEntityForm 
        entityType="teachers" 
        entityId={teacherId} 
      />
    </div>
  );
}