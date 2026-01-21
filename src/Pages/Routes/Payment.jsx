/* eslint-disable no-unused-vars */
import { useState, useMemo } from "react";
import { Search, Check } from "lucide-react";
import useCustomerVehicle from "../../hooks/useCustomerVehicle";
import LottieLoading from "../../components/utils/LottieLoading";
import { formatDue } from "../../utilits/formatDate";

const Card = ({ children, className = "" }) => (
  <div className={`${className} bg-white rounded-xl shadow-sm p-4`}>
    {children}
  </div>
);

const PaymentPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { data: customerVehicles = [], isLoading } = useCustomerVehicle();

  const vehicles = useMemo(() => {
    return (customerVehicles || []).map((v) => ({
      id: v.id,
      bstid: v.subscription_number || v.id,
      name: v.vehicle_name || v.vehicle_name || v.vehicle_type_name || "",
      dueDate: v.expire_date || v.expire_date || "",
      subscriptionFee:
        Number(v.subscription_fee ?? v.subscription_amount ?? 0) || 0,
      suspended: Boolean(v.suspended),
      expired:
        Boolean(v.suspended) ||
        (v.subscription_status || "").toUpperCase() === "EXPIRED" ||
        (v.expire_date ? new Date(v.expire_date) < new Date() : false),
    }));
  }, [customerVehicles]);

  const formatCurrency = (val) => {
    const n = Number(val) || 0;
    if (Number.isInteger(n)) return n.toLocaleString();
    return n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const toggleVehicle = (vehicleId) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId],
    );
  };

  const selectAllVehicles = () => {
    if (selectedVehicles.length === vehicles.length) {
      setSelectedVehicles([]);
    } else {
      setSelectedVehicles(vehicles.map((v) => v.id));
    }
  };

  const calculateTotal = () => {
    return selectedVehicles.reduce((total, vehicleId) => {
      const vehicle = vehicles.find((v) => v.id === vehicleId);
      const plan = selectedPlans[vehicleId] || "1 Month";
      let multiplier = 1;
      if (plan === "6 Month") multiplier = 6;
      if (plan === "1 Year") multiplier = 12;
      return total + vehicle.subscriptionFee * multiplier;
    }, 0);
  };

  const canPay = agreeTerms;

  const onConfirmPayment = () => {
    if (!canPay) return;
    if (selectedVehicles.length === 0) {
      // keep buttons enabled but require selection to proceed
      alert("Please select at least one vehicle to proceed with payment.");
      return;
    }
    // TODO: integrate Citybank payment flow
    console.log("Confirm (Citybank) payment for:", selectedVehicles);
  };

  const onBkashPayment = () => {
    if (!canPay) return;
    if (selectedVehicles.length === 0) {
      alert(
        "Please select at least one vehicle to proceed with bKash payment.",
      );
      return;
    }
    // TODO: integrate bKash payment flow
    // console.log("bKash payment for:", selectedVehicles);
  };

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.bstid.includes(searchTerm),
  );

  if (isLoading) return <LottieLoading />;

  return (
    <div className="">
      <h1 className="text-lg font-semibold text-gray-800 mb-2">
        Vehicle Payment
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Section - Vehicle List */}
        <div className="lg:col-span-3">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search Vehicle"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:border-yellow-400 text-sm"
                />
              </div>
              <div className="flex gap-2 ml-3">
                <button className="px-4 py-2 cursor-pointer bg-yellow-400 text-gray-800 rounded-md font-medium hover:bg-yellow-500 transition-colors text-sm">
                  Payment History
                </button>
                <button className="px-4 py-2 cursor-pointer bg-yellow-400 text-gray-800 rounded-md font-medium hover:bg-yellow-500 transition-colors text-sm">
                  Unpaid Invoices
                </button>
              </div>
            </div>

            {/* Header Row */}
            <div className="bg-yellow-100 rounded-md p-3 grid grid-cols-12 gap-3 items-center mb-3 font-semibold text-gray-700 text-sm">
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
              <div className="col-span-6">Vehicle (x {vehicles.length})</div>
              <div className="col-span-3">Due</div>
              <div className="col-span-2">Subscription Fee</div>
            </div>

            {/* Vehicle Rows */}
            <div className="space-y-3">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-yellow-50 rounded-md p-3 grid grid-cols-12 gap-3 items-start"
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
                  <div className="col-span-6">
                    <div className="font-medium text-gray-800 text-sm">
                      BSTID: {vehicle.bstid}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {vehicle.name}
                    </div>

                    {/* Plan selection removed per request */}
                  </div>
                  <div className="col-span-3">
                    <div className="text-sm font-medium text-gray-800">
                      {formatDue(vehicle.dueDate)}
                    </div>
                    {vehicle.expired && (
                      <div className="text-xs text-red-500 font-medium">
                        Expired
                      </div>
                    )}
                  </div>
                  <div className="col-span-2 text-right">
                    <div className="text-base font-semibold text-gray-800">
                      {formatCurrency(vehicle.subscriptionFee)}
                    </div>
                    <div className="text-[11px] text-red-500">
                      No Privilege Gained
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Section - Cost Summary */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-bold text-orange-500 mb-2">
              Cost Summary
            </h2>
            <div className="animate-pulse text-xs text-green-500 ">
              <p className="mb-1 text-center">Stay Longer, Pay Less.</p>
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
                  {calculateTotal()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Discount:</span>
                <span className="font-semibold text-gray-800">0</span>
              </div>
              <div className="border-t-2 border-yellow-400 pt-4">
                <div className="bg-yellow-50 rounded-lg p-3 flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total Cost:</span>
                  <span className="font-bold text-xl text-gray-800">
                    {calculateTotal()}
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 cursor-pointer"
                />
                <span className="text-xs text-gray-600">
                  By checking you agree to our{" "}
                  <a href="#" className="text-blue-500 underline">
                    Refund Policy
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-500 underline">
                    Terms & Conditions
                  </a>
                </span>
              </label>
            </div>
            <button
              onClick={onConfirmPayment}
              disabled={!canPay}
              className={`w-full py-3 cursor-pointer rounded-lg font-semibold mb-3 transition-colors ${
                canPay
                  ? "bg-yellow-400 text-gray-800 hover:bg-yellow-500"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Confirm Payment
            </button>

            <button
              onClick={onBkashPayment}
              disabled={!canPay}
              className={`w-full py-3 cursor-pointer ${
                canPay
                  ? "bg-pink-300 hover:bg-pink-400 text-gray-800"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              } rounded-lg font-semibold transition-colors`}
            >
              Bkash Payment
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
