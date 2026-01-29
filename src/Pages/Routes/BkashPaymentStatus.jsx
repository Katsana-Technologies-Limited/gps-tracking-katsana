import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAxios } from "../../hooks/useAxios";

const statusConfig = {
  success: {
    color: "bg-[#85E085]",
    icon: (
      <svg
        className="w-10 h-10 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    title: "Payment Successful",
    message: "Your payment was successful. Thank you!",
  },
  failure: {
    color: "bg-red-500",
    icon: (
      <svg
        className="w-10 h-10 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={3}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    title: "Payment Failed",
    message: "Your payment could not be completed. Please try again.",
  },
  cancel: {
    color: "bg-yellow-500",
    icon: (
      <svg
        className="w-10 h-10 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={3}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    title: "Payment Cancelled",
    message: "You cancelled the payment. No money was deducted.",
  },
  pending: {
    color: "bg-blue-400",
    icon: (
      <svg
        className="w-10 h-10 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={3}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Payment Pending",
    message: "Your payment is being processed. Please wait.",
  },
};

const BkashPaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const axiosUrl = useAxios();
  const [status, setStatus] = useState("pending");
  const [message, setMessage] = useState("");
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const paymentID =
      searchParams.get("paymentID") || searchParams.get("paymentId");

    const statusParam = searchParams.get("status");
    setStatus(statusParam || "pending");

    if (!paymentID) {
      setMessage("No payment ID found in URL.");
      return;
    }

    let retryCount = 0;
    const MAX_RETRY = 5;

    const fetchPayment = () => {
      setLoading(true);
      axiosUrl
        .get(`/api/vts/payment/bkash/query?paymentId=${paymentID}`)
        .then((res) => {
          setPaymentInfo(res.data);
          setMessage(
            res.data.errorMessageEn || res.data.transactionStatus || "",
          );

          // ✅ Stop retry when completed
          if (
            res.data.transactionStatus === "Completed" ||
            res.data.transactionStatus === "Authorized"
          ) {
            setLoading(false);
            return;
          }

          // 🔁 Retry if not completed
          if (retryCount < MAX_RETRY) {
            retryCount++;
            setTimeout(fetchPayment, 2000); // ⏳ 2 sec
          }
        })
        .catch(() => {
          if (retryCount < MAX_RETRY) {
            retryCount++;
            setTimeout(fetchPayment, 2000);
          }
        })
        .finally(() => {
          if (retryCount >= MAX_RETRY) {
            setLoading(false);
          }
        });
    };

    fetchPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const config = statusConfig[status] || statusConfig["pending"];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8f8f8]">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
        {/* Icon & Title */}
        <div className="mb-6">
          <div
            className={`w-20 h-20 ${config.color} rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            {config.icon}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {config.title}
          </h1>
          <p className="text-sm text-gray-600">{message || config.message}</p>
        </div>

        {/* Payment Details Card */}
        {paymentInfo && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 text-left shadow-sm">
            <h2 className="text-base font-bold text-gray-800 mb-4">
              Payment Details
            </h2>
            <div className="space-y-3 text-sm">
              {paymentInfo.trxId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">TrxID</span>
                  <span className="font-medium text-gray-800">
                    {paymentInfo.trxId}
                  </span>
                </div>
              )}
              {paymentInfo.amount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium text-gray-800">
                    {paymentInfo.amount} {paymentInfo.currency}
                  </span>
                </div>
              )}
              {paymentInfo.transactionStatus && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-gray-800">
                    {paymentInfo.transactionStatus}
                  </span>
                </div>
              )}
              {(paymentInfo.merchantInvoiceNumber ||
                paymentInfo.merchantInvoice) && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice</span>
                  <span className="font-medium text-gray-800">
                    {paymentInfo.merchantInvoiceNumber ||
                      paymentInfo.merchantInvoice}
                  </span>
                </div>
              )}
              {paymentInfo.payerReference && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payer</span>
                  <span className="font-medium text-gray-800">
                    {paymentInfo.payerReference}
                  </span>
                </div>
              )}
              {(paymentInfo.paymentExecuteTime ||
                paymentInfo.paymentCreateTime) && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium text-gray-800">
                    {paymentInfo.paymentExecuteTime ||
                      paymentInfo.paymentCreateTime}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {status === "success" ? (
            <button
              onClick={() => navigate("/dashboard/payment")}
              className="w-full bg-[#FF7A00] cursor-pointer text-white py-3.5 rounded-xl font-semibold text-base hover:bg-[#ff8a1a] transition-colors shadow-md"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={() => navigate("/dashboard/payment")}
              className="w-full bg-gray-200 cursor-pointer text-gray-700 py-3.5 rounded-xl font-semibold text-base hover:bg-gray-300 transition-colors"
            >
              Back to Payment
            </button>
          )}
        </div>
        {loading && (
          <div className="mt-4 text-gray-500 text-sm animate-pulse">
            Verifying payment with bKash...
          </div>
        )}
      </div>
    </div>
  );
};

export default BkashPaymentStatus;
