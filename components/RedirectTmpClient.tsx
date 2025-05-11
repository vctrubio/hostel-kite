"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Redirects user based on role
 * @param role The user role
 * @param router The Next.js router
 */
export const redirectRole = (role: string | undefined, router: ReturnType<typeof useRouter>) => {
  if (!role) return;
  
  const roleRoutes: Record<string, string> = {
    admin: '/admin',
    student: '/student',
    teacher: '/teacher'
  };
  
  const route = roleRoutes[role];
  if (route) {
    console.log(`Redirecting ${role} to ${route}`);
    router.push(route);
  }
};

/**
 * Validates that the user has the expected role, redirects to home if not
 * @param userRole The current user's role from the database
 * @param expectedRole The role required for this page
 * @param router The Next.js router
 * @returns boolean indicating if user has the correct role
 */
export const validateRole = (
  userRole: string | undefined,
  expectedRole: string,
  router: ReturnType<typeof useRouter>
): boolean => {
  if (!userRole) {
    console.log('No role found, redirecting to home');
    router.push('/');
    return false;
  }
  
  if (userRole !== expectedRole) {
    console.log(`Invalid role: ${userRole}, expected: ${expectedRole}, redirecting to home`);
    router.push('/');
    return false;
  }
  
  return true;
};

/**
 * Hook to validate user role and redirect if necessary
 */
export const useRoleValidation = (userData: any, expectedRole: string) => {
  const router = useRouter();
  
  useEffect(() => {
    if (userData) {
      validateRole(userData.role, expectedRole, router);
    }
  }, [userData, expectedRole, router]);
};

type RedirectTmpClientProps = {
  role?: string;
};

/**
 * A component that redirects users based on their role
 */
export default function RedirectTmpClient({ role }: RedirectTmpClientProps) {
  const router = useRouter();
  
  useEffect(() => {
    redirectRole(role, router);
  }, [role, router]);
  
  return null; // This component doesn't render anything
}
