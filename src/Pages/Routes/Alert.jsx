import React from "react";
import { AlertTriangle } from "lucide-react";

export default function Alert() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <AlertTriangle size={48} className="text-[#fe8e1c] mb-4" />
      <h1 className="text-2xl font-bold mb-2">Alert</h1>
      <p className="text-gray-600">Alert and notifications coming soon.</p>
    </div>
  );
}
