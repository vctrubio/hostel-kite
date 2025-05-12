"use client";

import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { adminNavRoutes } from "@/utils/routesNavigation";
import { Menu } from "antd"; // Import Menu from antd

export function UnAuthNavbar() {
  return (
    <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
      <span>The Kite Hostel Management App</span>
      <SignOutButton />
    </header>
  );
}

export function AuthAdminNavbar() {
  const pathname = usePathname();

  const menuItems = Object.entries(adminNavRoutes).map(([name, path]) => ({
    key: path,
    label: (
      <Link href={path} className="capitalize">
        {name}
      </Link>
    ),
  }));

  return (
    <div className="flex shadow-md justify-between">
      <div className="grow">
        <Menu
          mode="horizontal"
          selectedKeys={[pathname]}
          items={menuItems}
          theme="light"
        />
      </div>
      <SignOutButton />
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
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm"
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

