import React from "react";
import { Wrench } from "lucide-react";

export default function Maintenance() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Wrench size={48} className="text-[#fe8e1c] mb-4" />
      <h1 className="text-2xl font-bold mb-2">Maintenance</h1>
      <p className="text-gray-600">Maintenance features coming soon.</p>
    </div>
  );
}
