import React from "react";
import { LifeBuoy } from "lucide-react";

export default function Support() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <LifeBuoy size={48} className="text-primary-orange mb-4" />
      <h1 className="text-2xl font-bold mb-2">Support</h1>
      <p className="text-gray-600">Support and help desk coming soon.</p>
    </div>
  );
}
