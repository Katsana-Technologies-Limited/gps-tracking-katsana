import React from "react";
import { Users } from "lucide-react";

export default function UserManagement() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Users size={48} className="text-[#fe8e1c] mb-4" />
      <h1 className="text-2xl font-bold mb-2">User Management</h1>
      <p className="text-gray-600">User management features coming soon.</p>
    </div>
  );
}
