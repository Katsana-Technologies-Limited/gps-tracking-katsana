const BkashPaymentError = ({ message }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
      <p className="mb-2">
        {message ||
          "There was an error processing your bKash payment. Please try again or contact support."}
      </p>
      <a href="/" className="text-blue-600 underline">
        Go to Dashboard
      </a>
    </div>
  </div>
);

export default BkashPaymentError;
