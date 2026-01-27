import React from "react";

const BkashPaymentSuccess = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
      <p className="mb-2">Your bKash payment was completed successfully.</p>
      <a href="/" className="text-blue-600 underline">
        Go to Dashboard
      </a>
    </div>
  </div>
);

export default BkashPaymentSuccess;
