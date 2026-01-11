import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import GlobalLoading from "../utils/GlobalLoading";
import useCustomerVehicle from "../../hooks/useCustomerVehicle";

const CounterVehicles = () => {
  const { data, isLoading } = useCustomerVehicle();
  console.log(data);

  const vehiclesPie = [
    { name: "Online", value: 7, color: "#1ED760" },
    { name: "Suspended", value: 4, color: "#FF4D4F" },
    { name: "Offline", value: 3, color: "#B0BEC5" },
  ];

  if (isLoading) return <GlobalLoading message="Loading vehicles..." />;

  return (
    <div className="relative min-h-65 flex flex-col items-center justify-between p-2">
      <div className="w-full flex items-start justify-between">
        <h2 className="text-sm font-semibold text-gray-700">
          Total Number of Vehicles
        </h2>
        <div className="bg-orange-50 text-xs px-2 py-1 rounded-lg flex flex-col justify-center items-center">
          <span className="text-2xl text-orange-500 font-bold">
            {7 + 4 + 3}
          </span>
          <span className="text-[11px] text-gray-600 font-semibold">
            {/* Vehicle{7 + 4 + 3 !== 1 ? "s" : ""} */}
          </span>
        </div>
      </div>
      <div className="w-full flex justify-center items-center mt-2 mb-2">
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
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 text-xs font-medium text-gray-600">
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
