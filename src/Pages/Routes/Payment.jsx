import { useState, useMemo, useEffect, startTransition, useRef } from "react";
import { Search, Check } from "lucide-react";
import { Link } from "react-router-dom";
import useCustomerVehicle from "../../hooks/useCustomerVehicle";
import Modal from "../../components/utils/Modal";
import LottieLoading from "../../components/utils/LottieLoading";
import { useAxios } from "../../hooks/useAxios";
import { formatDue } from "../../utilits/formatDate";

const Card = ({ children, className = "" }) => (
  <div className={`${className} bg-white rounded-xl shadow-sm p-4`}>
    {children}
  </div>
);

const PaymentPage = () => {
  const axiosUrl = useAxios();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [savePaymentInfo, setSavePaymentInfo] = useState(false);
  const [vehicleDurations, setVehicleDurations] = useState({});
  const [showSavedPaymentModal, setShowSavedPaymentModal] = useState(false);
  const { data: customerVehicles = [], isLoading } = useCustomerVehicle();
  const hasInitialized = useRef(false);

  const vehicles = useMemo(() => {
    return (customerVehicles || []).map((v) => ({
      id: v.subscription_id,
      subscriptionId: v.subscription_id,
      subscriptionNumber: v.subscription_number || `KAT-${v.subscription_id}`,
      vehicleName: v.vehicle_name || "No Name",
      dueDate: v.expire_date || "",
      subscriptionFee: Number(v.subscription_fee || 0),
      suspended: Boolean(v.suspended),
      expired:
        Boolean(v.suspended) ||
        (v.subscription_status || "").toUpperCase() === "EXPIRED" ||
        (v.expire_date ? new Date(v.expire_date) < new Date() : false),
    }));
  }, [customerVehicles]);

  useEffect(() => {
    if (!vehicles || vehicles.length === 0) return;
    if (hasInitialized.current) return;

    hasInitialized.current = true;
    startTransition(() => {
      setSelectedVehicles(vehicles.map((v) => v.id));
      const initDur = {};
      vehicles.forEach((v) => {
        initDur[v.id] = 1;
      });
      setVehicleDurations(initDur);
    });
  }, [vehicles]);

  const formatCurrency = (val) => {
    const n = Number(val) || 0;
    return n.toLocaleString("en-BD", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const toggleVehicle = (vehicleId) => {
    setSelectedVehicles((prev) => {
      if (prev.includes(vehicleId)) {
        setVehicleDurations((d) => {
          const copy = { ...d };
          delete copy[vehicleId];
          return copy;
        });
        return prev.filter((id) => id !== vehicleId);
      } else {
        return [...prev, vehicleId];
      }
    });
  };

  const selectAllVehicles = () => {
    if (selectedVehicles.length === vehicles.length) {
      setSelectedVehicles([]);
    } else {
      setSelectedVehicles(vehicles.map((v) => v.id));
    }
  };

  const getVehicleDuration = (vehicleId) => {
    return vehicleDurations[vehicleId] || 1;
  };

  const setVehicleDuration = (vehicleId, months) => {
    setVehicleDurations((prev) => ({
      ...prev,
      [vehicleId]: months,
    }));
  };

  const calculateVehicleTotal = (vehicle) => {
    const duration = getVehicleDuration(vehicle.id);
    return vehicle.subscriptionFee * duration;
  };

  const calculateTotal = () => {
    return selectedVehicles.reduce((total, vehicleId) => {
      const vehicle = vehicles.find((v) => v.id === vehicleId);
      return total + calculateVehicleTotal(vehicle);
    }, 0);
  };

  const canPay = agreeTerms && selectedVehicles.length > 0;

  const onConfirmPayment = () => {
    if (!canPay) return;
    console.log("Processing payment for vehicles:", selectedVehicles);
    console.log("Vehicle durations:", vehicleDurations);
  };

  const onBkashPayment = async () => {
    if (!canPay) return;
    // Prepare common payment data
    const paymentVehicles = selectedVehicles.map((id) => {
      const v = vehicles.find((x) => x.id === id);
      return {
        subscriptionId: v.subscriptionId,
        duration: vehicleDurations[id] || 1,
        amount: v.subscriptionFee * (vehicleDurations[id] || 1),
      };
    });
    const totalAmount = calculateTotal();

    if (savePaymentInfo) {
      // 1. Create Agreement API (backend endpoint should handle bKash agreement creation)
      try {
        const agreementRes = await axiosUrl.post(
          "/api/vts/payment/bkash/agreement/create",
          {
            vehicles: paymentVehicles,
            totalAmount,
          },
          { withCredentials: true },
        );
        // Expecting backend to return { bkashURL, agreementId, ... }
        if (agreementRes.data && agreementRes.data.bkashURL) {
          // Redirect user to bKash agreement page
          window.location.href = agreementRes.data.bkashURL;
        } else {
          alert("Failed to initiate bKash agreement. Please try again.");
        }
      } catch (err) {
        alert(
          err?.response?.data?.errorMessageEn ||
            "Agreement creation failed. Please try again.",
        );
      }
    } else {
      // 2. Normal Payment API (without agreement)
      try {
        const paymentRes = await axiosUrl.post(
          "/api/vts/payment/bkash/payment/create",
          {
            vehicles: paymentVehicles,
            totalAmount,
          },
          { withCredentials: true },
        );
        // Expecting backend to return { bkashURL, paymentId, ... }
        if (paymentRes.data && paymentRes.data.bkashURL) {
          // Redirect user to bKash payment page
          window.location.href = paymentRes.data.bkashURL;
        } else {
          alert("Failed to initiate bKash payment. Please try again.");
        }
      } catch (err) {
        alert(
          err?.response?.data?.errorMessageEn ||
            "Payment initiation failed. Please try again.",
        );
      }
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      v.vehicleName.toLowerCase().includes(searchLower) ||
      v.subscriptionNumber.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) return <LottieLoading />;

  return (
    <div className="">
      <h1 className="text-lg font-semibold text-gray-800 mb-2">
        Vehicle Payment
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by vehicle name or subscription number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:border-yellow-400 text-sm"
                />
              </div>
              <div className="flex gap-2 ml-3">
                <button
                  className="px-4 py-2 cursor-pointer bg-yellow-400 text-gray-800 rounded-md font-medium hover:bg-yellow-500 transition-colors text-sm"
                  onClick={() => setShowSavedPaymentModal(true)}
                >
                  Saved Payment Method
                </button>
                <button className="px-4 py-2 cursor-pointer bg-yellow-400 text-gray-800 rounded-md font-medium hover:bg-yellow-500 transition-colors text-sm">
                  Payment History
                </button>
                <button className="px-4 py-2 cursor-pointer bg-yellow-400 text-gray-800 rounded-md font-medium hover:bg-yellow-500 transition-colors text-sm">
                  Unpaid Invoices
                </button>
              </div>
            </div>
            <div className="bg-yellow-100 rounded-md p-3 grid grid-cols-12 gap-4 items-center mb-3 font-semibold text-gray-700 text-sm">
              <div className="col-span-1 flex items-center">
                <button
                  onClick={selectAllVehicles}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                    selectedVehicles.length === vehicles.length
                      ? "bg-yellow-400 border-yellow-400"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {selectedVehicles.length === vehicles.length && (
                    <Check className="w-4 h-4 text-gray-800" />
                  )}
                </button>
              </div>
              <div className="col-span-3">Vehicle (x {vehicles.length})</div>
              <div className="col-span-4">Duration (Month)</div>
              <div className="col-span-2">Due</div>
              <div className="col-span-2 text-center">Subscription Fee</div>
            </div>
            <div className="space-y-2">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-yellow-50 rounded-md p-3 grid grid-cols-12 gap-4 items-center transition-colors"
                >
                  <div className="col-span-1 flex items-center">
                    <button
                      onClick={() => toggleVehicle(vehicle.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                        selectedVehicles.includes(vehicle.id)
                          ? "bg-yellow-400 border-yellow-400"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {selectedVehicles.includes(vehicle.id) && (
                        <Check className="w-4 h-4 text-gray-800" />
                      )}
                    </button>
                  </div>

                  <div className="col-span-3">
                    <div className="font-semibold text-gray-800 text-sm">
                      {vehicle.subscriptionNumber}
                    </div>
                    <div className="text-xs text-gray-600">
                      {vehicle.vehicleName}
                    </div>
                  </div>
                  <div className="col-span-4">
                    <div className="border border-[#f1db79] rounded-md p-2">
                      <div className="text-[10px] mb-1.5 font-medium">
                        Choose Plan
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setVehicleDuration(vehicle.id, 1)}
                          className={`px-2 py-0.5 text-xs rounded-full cursor-pointer border transition-colors ${
                            getVehicleDuration(vehicle.id) === 1
                              ? "bg-yellow-400 border-yellow-500 text-gray-800 font-semibold"
                              : "border-gray-300 text-gray-700 hover:border-yellow-400"
                          }`}
                        >
                          1 Month
                        </button>
                        <button
                          onClick={() => setVehicleDuration(vehicle.id, 6)}
                          className={`px-2 py-0.5 text-xs rounded-full cursor-pointer border transition-colors ${
                            getVehicleDuration(vehicle.id) === 6
                              ? "bg-yellow-400 border-yellow-500 text-gray-800 font-semibold"
                              : "border-gray-300 text-gray-700 hover:border-yellow-400"
                          }`}
                        >
                          6 Month
                        </button>
                        <button
                          onClick={() => setVehicleDuration(vehicle.id, 12)}
                          className={`px-2 py-0.5 text-xs rounded-full cursor-pointer border transition-colors ${
                            getVehicleDuration(vehicle.id) === 12
                              ? "bg-yellow-400 border-yellow-500 text-gray-800 font-semibold"
                              : "border-gray-300 text-gray-700 hover:border-yellow-400"
                          }`}
                        >
                          1 Year
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={getVehicleDuration(vehicle.id)}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setVehicleDuration(vehicle.id, Math.max(1, val));
                          }}
                          className="w-14 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm font-medium text-gray-800">
                      {vehicle.dueDate
                        ? formatDue(vehicle.dueDate)
                        : "No due date"}
                    </div>
                    {vehicle.expired && (
                      <div className="text-xs text-red-500 font-medium">
                        Expired
                      </div>
                    )}
                    {vehicle.suspended && (
                      <div className="text-xs text-orange-500 font-medium">
                        Suspended
                      </div>
                    )}
                  </div>
                  <div className="col-span-2 text-center">
                    <div className="text-base font-bold text-gray-800">
                      {formatCurrency(calculateVehicleTotal(vehicle))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-bold text-center text-orange-500 mb-2">
              Cost Summary
            </h2>
            <div className="animate-pulse text-xs text-green-500 ">
              <p className="mb-0.5 text-center">Stay Longer, Pay Less.</p>
              <p className="mb-6 text-center">
                Get Free Months With 6-12 Month Plans
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vehicles:</span>
                <span className="font-semibold text-gray-800">
                  {selectedVehicles.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sub Total:</span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Discount:</span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(0)}
                </span>
              </div>
              <div className="border-t-2 border-yellow-400 pt-4">
                <div className="bg-yellow-50 border shadow-sm border-primary-orange rounded-lg p-3 flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total Cost:</span>
                  <span className="font-bold text-xl text-gray-800">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>

            {/* Selection Status Message */}
            {agreeTerms && selectedVehicles.length === 0 && (
              <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-center">
                <p className="text-sm text-yellow-700">
                  Please select at least one vehicle to proceed with payment
                </p>
              </div>
            )}

            <div className="mx-5 mb-4">
              <label className="flex items-start gap-3 font-medium max-w-4/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 cursor-pointer h-4 w-7 accent-white bg-white border border-gray-300 rounded"
                />
                <span className="text-xs">
                  By checking you agree to our{" "}
                  <Link to="/refund-policy" className="text-blue-500 underline">
                    Refund Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/terms-conditions"
                    className="text-blue-500 underline"
                  >
                    Terms & Conditions
                  </Link>
                </span>
              </label>
            </div>

            <div className="mx-5 mb-4">
              <label className="flex items-start gap-2 font-medium max-w-4/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={savePaymentInfo}
                  onChange={(e) => setSavePaymentInfo(e.target.checked)}
                  className="mt-1 cursor-pointer h-4 w-6 accent-white bg-white border border-gray-300 rounded"
                />
                <span className="text-xs">
                  Save your payment Information for faster payment.
                </span>
              </label>
            </div>

            <button
              onClick={onConfirmPayment}
              disabled={!canPay}
              className={`w-full py-3 rounded-lg font-semibold mb-3 transition-colors ${
                canPay
                  ? "bg-yellow-400 text-gray-800 hover:bg-yellow-500 cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              title={
                !agreeTerms
                  ? "Please agree to terms & conditions"
                  : selectedVehicles.length === 0
                    ? "Please select at least one vehicle"
                    : "Proceed with payment"
              }
            >
              Confirm Payment
            </button>

            <button
              onClick={onBkashPayment}
              disabled={!canPay}
              className={`w-full py-3 ${
                canPay
                  ? "bg-pink-300 hover:bg-pink-400 text-gray-800 cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              } rounded-lg font-semibold transition-colors`}
              title={
                !agreeTerms
                  ? "Please agree to terms & conditions"
                  : selectedVehicles.length === 0
                    ? "Please select at least one vehicle"
                    : "Proceed with bKash payment"
              }
            >
              Bkash Payment
            </button>
          </Card>
        </div>
      </div>

      {/* Saved Payment Method Modal - New Design */}
      <Modal
        open={showSavedPaymentModal}
        onClose={() => setShowSavedPaymentModal(false)}
        title={null}
        sizeClass="max-w-lg"
      >
        {/* Header with back button */}
        <div className="flex items-center mb-6 pb-4 border-b">
          <button
            onClick={() => setShowSavedPaymentModal(false)}
            className="mr-3 text-gray-700 hover:text-gray-900"
            aria-label="Back"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            Payment Methods
          </h2>
        </div>

        <div className="space-y-6">
          {/* Saved Payment Method Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Saved Payment Method
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* bKash Logo */}
                  <div className="w-10 h-10 bg-pink-500 rounded flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">
                      019####690
                    </div>
                    <div className="text-xs text-gray-500">Saved by bkash</div>
                  </div>
                </div>
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                  <span>Remove payment method</span>
                </button>
              </div>
            </div>
          </div>

          {/* Add Other Payment Methods Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Add Other Payment Methods
            </h3>
            <div className="space-y-2">
              {/* Nagad Option */}
              <button className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <img
                    src="https://seeklogo.com/images/N/nagad-logo-7A70CCFEE1-seeklogo.com.png"
                    alt="Nagad"
                    className="w-10 h-10"
                  />
                  <span className="font-medium text-gray-800 text-sm">
                    Pay with Nagad
                  </span>
                </div>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400 group-hover:text-orange-500"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              {/* Card Option */}
              <button className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                      alt="Visa"
                      className="w-8 h-5"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg"
                      alt="Mastercard"
                      className="w-8 h-5"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
                      alt="Amex"
                      className="w-8 h-5"
                    />
                  </div>
                  <span className="font-medium text-gray-800 text-sm">
                    Pay with Debit / Credit Card
                  </span>
                </div>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400 group-hover:text-blue-500"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Continue Button */}
          <button className="w-full bg-gray-200 text-gray-500 py-3 rounded-lg font-medium text-sm cursor-not-allowed">
            Continue
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentPage;
