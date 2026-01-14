/* eslint-disable no-unused-vars */
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import useCustomerVehicle from "../../hooks/useCustomerVehicle";
import useVtsAllDevices from "../../hooks/useVtsAllDevices";
import LottieLoading from "../utils/LottieLoading";

const CounterVehicles = () => {
  const { data = [], isLoading } = useCustomerVehicle();
  const { allDevices } = useVtsAllDevices();

  const vehiclesToCount = Array.isArray(data) ? data : [];
  const suspendedCount = vehiclesToCount.filter(
    (v) => v.suspended === true
  ).length;

  let onlineCount = 0;
  let offlineCount = 0;
  vehiclesToCount.forEach((v) => {
    if (v.suspended) return;
    
    const matching = Array.isArray(allDevices)
      ? allDevices.find((d) => {
          const deviceImei =
            d.device_data?.imei ||
            d.imei ||
            d.imei_number ||
            d.device_data?.imei_number;
          return (
            deviceImei && v.imei && deviceImei.toString() === v.imei.toString()
          );
        })
      : null;

    const status = matching ? matching.online : null;
    if (status === "online" || status === "ack") onlineCount++;
    else offlineCount++;
  });

  const vehiclesPie = [
    { name: "Online", value: onlineCount, color: "#1ED760" },
    { name: "Suspended", value: suspendedCount, color: "#FF4D4F" },
    { name: "Offline", value: offlineCount, color: "#B0BEC5" },
  ];

  const totalVehicles = Array.isArray(data) ? data.length : 0;
  if (isLoading) return <LottieLoading />;

  const CustomTooltip = ({ active, payload }) => (
    <AnimatePresence>
      {active && payload && payload.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 16 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="rounded shadow-xl px-4 py-2 bg-white flex items-center gap-2 border"
          style={{
            borderColor: payload[0].payload.color,
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: payload[0].payload.color }}
          />
          <span className="font-semibold text-gray-700">
            {payload[0].payload.name}
          </span>
          <span className="ml-2 text-gray-500 font-medium">
            {payload[0].payload.value}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative min-h-65 flex flex-col items-center justify-between p-4 bg-white rounded-xl shadow">
      <div className="w-full flex items-start justify-between mb-2">
        <h2 className="text-base font-semibold text-gray-700">
          Total Number of Vehicles
        </h2>
        <div className="bg-orange-50 text-xs px-2 py-1 rounded-lg flex flex-col justify-center items-center">
          <span className="text-2xl text-orange-500 font-bold">
            {totalVehicles}
          </span>
          <span className="text-[11px] text-gray-600 font-semibold">
            Vehicle{totalVehicles !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
      <div className="w-full flex justify-center items-center my-2">
        <ResponsiveContainer width={"100%"} height={180}>
          <PieChart>
            <Pie
              data={vehiclesPie}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={87}
              startAngle={15}
              endAngle={405}
              stroke="none"
            >
              {vehiclesPie.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 text-sm font-medium text-gray-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-[#FF4D4F]" /> Suspended
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-[#1ED760]" /> Online
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-[#B0BEC5]" /> Offline
        </div>
      </div>
    </div>
  );
};

export default CounterVehicles;
