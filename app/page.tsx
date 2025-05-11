"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect } from "react";
import { adminSchemaFields } from "@/convex/schemaFields";
import { useRouter } from "next/navigation";
import { redirectRole } from "@/components/RedirectTmpClient";

export default function Home() {
  const userData = useQuery(api.models.users.getUserData);
  const { viewer } = useQuery(api.models.users.getViewer) ?? {};
  const router = useRouter();
  
  // Navigation links
  const navLinks = [
    { title: "Admin", href: "/admin" },
    { title: "Student", href: "/student" },
    { title: "Teacher", href: "/teacher" },
    // { title: "Packages", href: "/packages" },
    // { title: "Instructors", href: "/instructors" },
    // { title: "Forecast", href: "/forecast" },
  ];

  useEffect(() => {
    if (userData?.role) {
      console.log('we have a role:', userData.role);
      redirectRole(userData.role, router);
    } else {
      console.log('no role found');
    }
  }, [userData, router]);

  return (
    <>
      <Navbar />
      <main className="p-8 flex flex-col gap-8">
       
        {viewer !== undefined ? (
          <div className="text-center">
            <p className="text-xl mb-2">Welcome, {viewer ?? "Anonymous"}!</p>
            {userData && (
              <p className="mb-6">Your role: <span className="font-medium">{userData.role || "Not assigned"}</span></p>
            )}
          </div>
        ) : (
          <p className="text-center">Loading user info...</p>
        )}
        
        <section className="max-w-4xl mx-auto">

          <nav className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {navLinks.map((link, index) => (
                <Link 
                  key={index} 
                  href={link.href} 
                  className="p-3 border rounded-md text-center hover:bg-gray-50 transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </nav>
        </section>
      </main>
    </>
  );
}
