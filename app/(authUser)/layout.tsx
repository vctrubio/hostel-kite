import React from 'react';
import { AuthUserNavbar } from '@/components/Navbar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthUserNavbar />
        {children}
    </>
  );
}
