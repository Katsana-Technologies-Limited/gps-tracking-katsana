import React from "react";
import { FileText } from "lucide-react";

export default function Reports() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <FileText size={48} className="text-primary-orange mb-4" />
      <h1 className="text-2xl font-bold mb-2">Reports</h1>
      <p className="text-gray-600">Reports and analytics coming soon.</p>
    </div>
  );
}
