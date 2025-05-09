"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StudentPage() {
  const router = useRouter();
  const userData = useQuery(api.models.users.getUserData);
  
  // Redirect if user is not logged in or not a student
  useEffect(() => {
    if (userData && 'role' in userData && userData.role !== "student") {
      router.push("/");
    }
  }, [userData, router]);

  if (!userData) {
    return (
      <>
        <Navbar />
        <main className="p-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-pulse text-xl">Loading...</div>
          </div>
        </main>
      </>
    );
  }

  // Handle case where userData is null or userData doesn't have expected properties
  const name = 'name' in userData ? userData.name : 'Student';
  const email = 'email' in userData ? userData.email : 'No email available';

  return (
    <>
      <Navbar />
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-blue-600 p-6">
              <h1 className="text-3xl font-bold text-white">
                Hello, Welcome {name}!
              </h1>
              <p className="text-blue-100 mt-2">
                {new Date().toLocaleDateString("en-US", { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">Your Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{email}</p>
                  </div>
                  {/* Add more student info here as needed */}
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">Dashboard</h2>
                <p className="text-gray-600">
                  Welcome to your student dashboard. Here you can manage your hostel information,
                  view room assignments, and access other student services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}