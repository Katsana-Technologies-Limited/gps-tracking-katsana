import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const AlertsSummaryBarChart = () => {
  const areaData = [
    { name: "25 Dec", value: 2 },
    { name: "26 Dec", value: 2 },
    { name: "27 Dec", value: 4 },
    { name: "28 Dec", value: 6 },
    { name: "29 Dec", value: 9 },
    { name: "30 Dec", value: 7 },
    { name: "31 Dec", value: 5 },
  ];

  return (
    <div className="min-h-57.5 p-2">
      <div className="font-semibold text-base text-gray-600 mb-2">
        Last 7 Days Alerts, Summary
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={areaData}>
          <defs>
            <linearGradient id="colorAlert" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fd9642" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#fd9642" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="#e5e7eb"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 11 }}
          />
          <YAxis
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            width={30}
          />
          <Tooltip
            cursor={{ stroke: "#fd9642", strokeWidth: 1 }}
            contentStyle={{
              borderRadius: 8,
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#fd9642"
            fill="url(#colorAlert)"
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 2, fill: "#fd9642" }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AlertsSummaryBarChart;
