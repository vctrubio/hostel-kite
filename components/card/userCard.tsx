"use client";

import { formatDate } from "@/utils/dateFormatter";

type UserRole = "admin" | "student" | "teacher" | "inactive" | null;

type UserCardProps = {
  user: {
    _id: string;
    name?: string;
    email?: string;
    _creationTime: number;
  };
  role?: UserRole;
};

export default function UserCard({ user, role }: UserCardProps) {
  // Define colors based on role
  const getBorderColor = () => {
    switch (role) {
      case "admin":
        return "border-purple-300";
      case "student":
        return "border-blue-300";
      case "teacher":
        return "border-green-300";
      case "inactive":
        return "border-gray-300";
      default:
        return "border-gray-200";
    }
  };

  const getBadgeColor = () => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "student":
        return "bg-blue-100 text-blue-800";
      case "teacher":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getRoleName = () => {
    return role ? role.charAt(0).toUpperCase() + role.slice(1) : "Unknown";
  };

  return (
    <div className={`border ${getBorderColor()} rounded-md p-4 hover:border-gray-800 transition duration-200`}>
      <h4 className="font-bold">{user.name || user.email || "Unnamed User"}</h4>
      
      {user.email && (
        <p className="text-sm text-gray-600">Email: {user.email}</p>
      )}
      
      <div className="flex justify-between items-center mt-2">
        <div>
          <p className="text-xs text-gray-500">ID: {user._id}</p>
          <p className="text-xs text-gray-500">Created: {formatDate(user._creationTime)}</p>
        </div>
        
        {role && (
          <span className={`px-2 py-1 text-xs ${getBadgeColor()} rounded-full`}>
            {getRoleName()}
          </span>
        )}
      </div>
    </div>
  );
}