import React from "react";

const PaymentCancel = () => {
  // You can enhance this with more details or fetch cancel info via query params
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold text-yellow-600 mb-4">
          Payment Cancelled
        </h1>
        <p className="mb-4">You have cancelled the bKash payment process.</p>
        <a href="/admin/payments" className="text-blue-600 underline">
          Go to Payments
        </a>
      </div>
    </div>
  );
};

export default PaymentCancel;
