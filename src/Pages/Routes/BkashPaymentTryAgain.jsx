import React from "react";

const BkashPaymentTryAgain = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">Payment Not Completed</h2>
      <p className="mb-2">
        Your bKash payment was not completed. Please try again.
      </p>
      <a href="/" className="text-blue-600 underline">
        Try Payment Again
      </a>
    </div>
  </div>
);

export default BkashPaymentTryAgain;
