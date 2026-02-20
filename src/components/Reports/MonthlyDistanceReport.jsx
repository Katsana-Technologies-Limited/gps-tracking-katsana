import React, { useMemo } from "react";
import VehiclesStatusOption from "../AnalyticsSummary/VehiclesStatusOption";

const generateFakeData = () => {
  return [
    {
      si: 1,
      bstId: "BST001",
      vrn: "VRN001",
      distances: Array(28)
        .fill(0)
        .map(() => `${Math.floor(Math.random() * 100)} km`),
    },
    {
      si: 2,
      bstId: "BST002",
      vrn: "VRN002",
      distances: Array(28)
        .fill(0)
        .map(() => `${Math.floor(Math.random() * 100)} km`),
    },
    {
      si: 3,
      bstId: "BST003",
      vrn: "VRN003",
      distances: Array(28)
        .fill(0)
        .map(() => `${Math.floor(Math.random() * 100)} km`),
    },
  ];
};

const MonthlyDistanceReport = () => {
  const fakeData = useMemo(() => generateFakeData(), []);

  const dates = Array.from({ length: 28 }, (_, i) => {
    const date = new Date(2026, 1, i + 1);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 p-4 h-full">
      {/* Left Side: Monthly Distance Report Table */}
      <div className="xl:col-span-3 bg-white border border-gray-300 rounded-xl shadow-sm relative overflow-x-auto scrollbar-thin h-full">
        <h2 className="text-lg font-bold p-4 bg-orange-50 text-gray-700 border-b border-gray-200">
          Monthly Distance Report
        </h2>
        <table className="min-w-max w-full text-sm whitespace-nowrap table-auto">
          <thead className="bg-orange-50 text-gray-600">
            <tr className="border-b border-gray-200">
              <th className="p-4 text-left">SI.</th>
              <th className="p-4 text-left">BSTID</th>
              <th className="p-4 text-left">VRN</th>
              {dates.map((date, index) => (
                <th key={index} className="p-4 text-center">
                  {date}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fakeData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-200">
                <td className="p-4 text-left">{row.si}</td>
                <td className="p-4 text-left">{row.bstId}</td>
                <td className="p-4 text-left">{row.vrn}</td>
                {row.distances.map((distance, colIndex) => (
                  <td key={colIndex} className="p-4 text-center">
                    {distance}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right Side: Vehicles Status Option */}
      <div className="xl:col-span-1 bg-white border border-gray-300 rounded-xl shadow-sm p-4 h-full flex flex-col">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Vehicle Status</h2>
        <div className="flex-1 overflow-y-auto">
          <VehiclesStatusOption />
        </div>
      </div>
    </div>
  );
};

export default MonthlyDistanceReport;
