"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="p-8 flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-center">
          The Kite Hostel Management App2
        </h1>
        <Content />
      </main>
    </>
  );
}

function Content() {
  const { viewer } = useQuery(api.models.user.getViewer) ?? {};
  const userData = useQuery(api.models.user.getUserData);

  if (viewer === undefined) {
    return (
      <div className="mx-auto">
        <p>loading... (consider a loading skeleton)</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-lg mx-auto">
      <p>Welcome {viewer ?? "Anonymous"}!</p>
      
      {userData ? (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">User Data:</h2>
          <pre className="p-4 rounded-md overflow-auto">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
}
