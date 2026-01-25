import React from "react";
import { Bot } from "lucide-react";

export default function AIAssistant() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Bot size={48} className="text-primary-orange mb-4" />
      <h1 className="text-2xl font-bold mb-2">AI Assistant</h1>
      <p className="text-gray-600">AI assistant features coming soon.</p>
    </div>
  );
}
