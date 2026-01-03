import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const CounterVehicles = () => {
  const vehiclesPie = [
    { name: "Online", value: 90, color: "#1ED760" }, // green
    { name: "Suspended", value: 11, color: "#FF4D4F" }, // red
    { name: "Offline", value: 30, color: "#B0BEC5" }, // gray
  ];

  return (
    <div className="relative min-h-[260px] flex flex-col items-center justify-between">
      {/* Header */}
      <div className="w-full flex items-start justify-between">
        <h2 className="text-sm font-semibold text-gray-700">
          Total Number of Vehicles
        </h2>

        {/* Badge */}
        <div className="bg-orange-50 text-xs px-2 py-1 rounded-lg flex flex-col justify-center items-center">
          <span className="text-2xl text-orange-500   font-bold">1</span>
          <span className="text-[11px] text-gray-600  font-semibold">
            Vehicle
          </span>
        </div>
      </div>

      {/* Donut */}
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
              paddingAngle={0}
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

      {/* Legend */}
      <div className="flex justify-center gap-6 text-xs font-medium text-gray-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-[#FF4D4F]" />
          Suspended
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-[#1ED760]" />
          Online
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-[#B0BEC5]" />
          Offline
        </div>
      </div>
    </div>
  );
};

export default CounterVehicles;
