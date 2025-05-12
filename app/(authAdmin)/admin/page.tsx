"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import UserList from "@/components/list/userList";
import Link from "next/link";
import { Card } from "antd";
import GenericEntityForm from "@/components/forms/GenericEntityForm";

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

  // Show warning message if not admin, but STILL show the dashboard
  let warningMessage = null;
  if (userData && userData.role !== "admin") {
    let redirectLink = "/";
    let dashboardType = "home";
    
    if (userData.role === "student") {
      redirectLink = "/student";
      dashboardType = "student";
    } else if (userData.role === "teacher") {
      redirectLink = "/teacher";
      dashboardType = "teacher";
    }
    
    warningMessage = (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8" role="alert">
        <h1 className="text-3xl font-bold mb-4">Not Authorized!</h1>
        <div className="mt-6">
          <Link 
            href={redirectLink} 
            className="font-bold py-2 px-4 border rounded"
          >
            Go to {dashboardType} dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Show the admin dashboard for everyone
  return (
    <div className="mx-auto p-8">
      {/* Show warning if not admin */}
      {warningMessage}
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        {userData && (
          <p>Role: <span className="font-medium">{userData.role || "Not assigned"}</span></p>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column - User List */}
        <div>
          <Card title="User Management" className="shadow-md mb-8">
            <UserList />
          </Card>
        </div>

        {/* Right column - Create Forms */}
        <div className="flex flex-col gap-8">
          {/* Student Form */}
          <Card title="Create Student" className="shadow-md">
            <GenericEntityForm entityType="students" />
          </Card>

          {/* Teacher Form */}
          <Card title="Create Teacher" className="shadow-md">
            <GenericEntityForm entityType="teachers" />
          </Card>
        </div>
      </div>
    </div>
  );
}
