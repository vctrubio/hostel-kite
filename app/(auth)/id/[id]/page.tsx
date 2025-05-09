"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { notFound } from "next/navigation";
import React, { useState, useEffect } from "react";

// This page will try to get data from any table using the provided ID
export default function GenericIdPage({ params }: { params: { id: string } }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  
  const [entityType, setEntityType] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Try to fetch from different tables
  const student = useQuery(api.models.student.getById, { 
    id: id as Id<"students"> 
  });
  
  const teacher = useQuery(api.models.teacher.getById, { 
    id: id as Id<"teachers"> 
  });
  
  const user = useQuery(api.models.users.getById, { 
    id: id as Id<"users"> 
  });

  // Determine which entity the ID belongs to
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    if (student !== undefined && student !== null) {
      setData(student);
      setEntityType("student");
      setLoading(false);
      return;
    }
    
    if (teacher !== undefined && teacher !== null) {
      setData(teacher);
      setEntityType("teacher");
      setLoading(false);
      return;
    }
    
    if (user !== undefined && user !== null) {
      setData(user);
      setEntityType("user");
      setLoading(false);
      return;
    }
    
    // If all queries have completed but none returned data
    if (student === null && teacher === null && user === null) {
      setLoading(false);
      setError("No entity found with this ID");
    }
  }, [student, teacher, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">
            {entityType && entityType.charAt(0).toUpperCase() + entityType.slice(1)} Data
          </h1>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}