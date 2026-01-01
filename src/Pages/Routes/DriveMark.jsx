import React from "react";
import { MapPin } from "lucide-react";

export default function DriveMark() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <MapPin size={48} className="text-[#fe8e1c] mb-4" />
      <h1 className="text-2xl font-bold mb-2">Drive Mark</h1>
      <p className="text-gray-600">Drive mark and trip data coming soon.</p>
    </div>
  );
}
