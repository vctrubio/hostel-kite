"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function UserList() {
  const userData = useQuery(api.models.users.getUserData);
  const { viewer } = useQuery(api.models.users.getViewer) ?? {};

  return (
    <div className="p-6 rounded-lg border">
      <h2 className="text-2xl font-bold mb-6">User Information</h2>
      <p className="text-xl mb-4">Welcome {viewer ?? "Anonymous"}!</p>
      
      {userData ? (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">User Data:</h3>
          <pre className="p-4 border rounded-md overflow-auto">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
}