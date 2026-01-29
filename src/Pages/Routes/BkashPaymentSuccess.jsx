import React from "react";

const PaymentSuccess = () => {
  // You can enhance this with more details or fetch payment info via query params
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="mb-4">Your bKash payment was completed successfully.</p>
        <a href="/admin/payments" className="text-blue-600 underline">
          Go to Payments
        </a>
      </div>
    </div>
  );
};

export default PaymentSuccess;
