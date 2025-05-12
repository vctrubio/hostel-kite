import React from 'react';
import { AuthAdminNavbar } from '@/components/Navbar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthAdminNavbar />
        {children}
    </>
  );
}
