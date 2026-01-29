import React from "react";

const PaymentError = () => {
  // You can enhance this with more details or fetch error info via query params
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h1>
        <p className="mb-4">
          There was an error processing your bKash payment. Please try again or
          contact support.
        </p>
        <a href="/admin/payments" className="text-blue-600 underline">
          Go to Payments
        </a>
      </div>
    </div>
  );
};

export default PaymentError;
