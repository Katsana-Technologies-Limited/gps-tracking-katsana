import React from "react";
import { CreditCard } from "lucide-react";

export default function Payment() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <CreditCard size={48} className="text-[#fe8e1c] mb-4" />
      <h1 className="text-2xl font-bold mb-2">Payment</h1>
      <p className="text-gray-600">Payment and billing coming soon.</p>
    </div>
  );
}
