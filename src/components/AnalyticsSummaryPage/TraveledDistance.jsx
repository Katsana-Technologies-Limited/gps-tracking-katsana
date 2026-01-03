import React, { useState } from "react";
import { Switch } from "@headlessui/react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";

const TraveledDistance = () => {
  const [chartMode, setChartMode] = useState(false);

  const data = [
    { name: "Sun", value: 110 },
    { name: "Mon", value: 220 },
    { name: "Tue", value: 180 },
    { name: "Wed", value: 240 },
    { name: "Thu", value: 160 },
    { name: "Fri", value: 120 },
    { name: "Sat", value: 140 },
  ];

  return (
    <div className="min-h-65">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-gray-700">
          Last 7 Days Traveled Distance
        </h2>
        <Switch
          checked={chartMode}
          onChange={setChartMode}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition
            ${
              chartMode
                ? "bg-linear-to-r from-orange-400 to-orange-500"
                : "bg-gray-200"
            }
          `}
        >
          <span
            className={`inline-block cursor-pointer h-4 w-4 transform rounded-full bg-white transition
              ${chartMode ? "translate-x-6" : "translate-x-1"}
            `}
          />
        </Switch>
      </div>
      <div className="flex justify-center items-center">
        {!chartMode ? (
          <table className="w-full text-sm text-gray-600 mt-7">
            <thead>
              <tr className="text-gray-400">
                <th className="text-left">Date</th>
                <th className="text-center">Distance (KM)</th>
                <th className="text-center">Vehicles</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.name}>
                  <td className="p-1">{d.name}</td>
                  <td className="text-center p-1">{d.value}</td>
                  <td className="text-center p-1">1</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <defs>
                <linearGradient id="barOrange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff9f43" />
                  <stop offset="100%" stopColor="#fd9642" />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar
                dataKey="value"
                radius={[8, 8, 0, 0]}
                fill="url(#barOrange)"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TraveledDistance;
