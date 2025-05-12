"use client";

import React from "react";
import { useParams } from "next/navigation";
import GenericEntityForm from "@/components/forms/GenericEntityForm";

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id as string;
  
  return (
    <div className="max-w-3xl mx-auto p-8">
      <GenericEntityForm 
        entityType="students" 
        entityId={studentId} 
      />
    </div>
  );
}