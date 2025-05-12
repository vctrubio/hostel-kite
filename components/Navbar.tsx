"use client";

import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminNavRoutes } from "@/utils/routesNavigation";

export function UnAuthNavbar() {
  return (
    <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
      <span>The Kite Hostel Management App</span>
      <SignOutButton />
    </header>
  );
}

export function AuthAdminNavbar() {
  return (
    <div className="border-b-2 p-8">
      <nav className="flex flex-row justify-center gap-8">
        {Object.entries(adminNavRoutes).map(([name, path]) => (
          <Link 
            key={name} 
            href={path}
            className="hover:underline capitalize text-2xl"
          >
            {name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function AuthUserNavbar() {
  return (
    <div className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-col">
      <div className="flex flex-row justify-between items-center mb-2">
        <span>User FullName - User Role</span>
        <SignOutButton />
      </div>
    </div>
  );
}

function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  return (
    <>
      {isAuthenticated && (
        <button
          className="border rounded-xl text-foreground rounded-md p-2"
          onClick={() =>
            void signOut().then(() => {
              router.push("/signin");
            })
          }
        >
          Sign out
        </button>
      )}
    </>
  );
}

