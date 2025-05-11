"use client";

import React from 'react';

type VerificationBadgeProps = {
  isVerified: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
};

export default function VerificationBadge({ isVerified, size = 'md', showText = true }: VerificationBadgeProps) {
  if (!isVerified) return null;

  // Determine icon size based on prop
  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };
  
  // Determine text size based on prop
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  // Determine padding based on prop
  const paddings = {
    sm: 'px-2 py-0.5',
    md: 'px-3 py-1',
    lg: 'px-4 py-1.5',
  };

  return (
    <div className={`flex items-center bg-green-100 text-green-800 ${paddings[size]} rounded-full`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSizes[size]} ${showText ? 'mr-1' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {showText && <span className={`${textSizes[size]} font-medium`}>Verified User</span>}
    </div>
  );
}