"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { redirectRole } from "@/components/RedirectTmpClient";
import { AuthRoles } from "@/components/matching/authRoles";
import Link from "next/link";
import { UnAuthNavbar } from "@/components/Navbar";
import { Button, DatePicker } from "antd";
import { SmileOutlined } from "@ant-design/icons";

// Navigation component
const NavLinks = ({ links }: { links: { title: string; href: string }[] }) => {
  return (
    <nav className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">User should only be here if no role applied</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {links.map((link, index) => (
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
  );
};

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
      <UnAuthNavbar />
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
          <NavLinks links={navLinks} />
        </section>

        <div className="max-w-4xl border p-4 gap-4 flex justify-between mx-auto">
          <SmileOutlined style={{ fontSize: '24px', color: '#08c' }} />
          <DatePicker />
          <Button type="primary">Primary Button</Button>
        </div>

        <div className="mx-auto border p-4 rounded-md">
          <div>user can now</div>
          <ul>
            <li>see packages</li>
            <li>choose package = create new booking request</li>
          </ul>
        </div>

        <div className="mx-auto border p-4 rounded-md">
          <div>Intent to make matchmaking</div>
          {userData && (
            <div className="space-y-4">
              <AuthRoles userId={userData._id} userRole="admin" />
              <AuthRoles userId={userData._id} userRole="student" />
              <AuthRoles userId={userData._id} userRole="teacher" />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
