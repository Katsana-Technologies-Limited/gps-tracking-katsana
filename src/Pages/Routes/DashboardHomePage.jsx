import React from "react";

const cardClass =
  "bg-white rounded-2xl shadow-md p-4 flex flex-col justify-between min-h-[120px]";
const titleClass = "font-bold text-lg text-gray-700 mb-1";
const smallText = "text-sm text-gray-500";

const DashboardHomePage = () => {
  return (
    <div className="px-2 py-2 md:px-6 md:py-4 bg-[#f5f6fa] min-h-screen rounded-xl">
      <div className="mb-2 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <h1 className="text-xl font-bold text-gray-700 tracking-tight">
          Analytics And Summary
        </h1>
        <div className="flex gap-2">
          <select className="bg-white border rounded-xl px-3 py-1 text-sm text-gray-700 shadow">
            <option>Assign analysis</option>
          </select>
          <input
            className="bg-white border rounded-xl px-3 py-1 text-sm text-gray-700 shadow outline-none"
            placeholder="Search"
          />
          <button className="h-9 w-9 flex items-center justify-center rounded-full bg-white shadow hover:shadow-lg transition">
            <img
              src="/avatar.png"
              className="h-6 w-6 rounded-full"
              alt="profile"
            />
          </button>
        </div>
      </div>

      {/* Cards grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
        <div className={cardClass}>
          <div className={titleClass}>Last 7 Days Traveled Distance</div>
          <table className="text-sm w-full">
            <thead>
              <tr className="text-gray-500">
                <th>Date</th>
                <th>Distance (KM)</th>
                <th>Vehicles</th>
              </tr>
            </thead>
            <tbody>
              {/* Example rows */}
              <tr>
                <td>Sat, 25 Dec</td>
                <td>170</td>
                <td>4</td>
              </tr>
              <tr>
                <td>Sun, 26 Dec</td>
                <td>151</td>
                <td>4</td>
              </tr>
              {/* ... */}
            </tbody>
          </table>
        </div>

        {/* Pie Chart Placeholder */}
        <div className={cardClass + " items-center"}>
          <div className={titleClass}>Total Number of Vehicles</div>
          <div className="my-3">
            {/* Replace with pie chart */}
            <svg width={100} height={100}>
              <circle cx={50} cy={50} r={40} fill="#f4f6fb" />
              <path d="M50,50 L50,10 A40,40 0 1,1 10,50 Z" fill="#27c473" />
              <path d="M50,50 L10,50 A40,40 0 1,1 50,10 Z" fill="#fe3b56" />
            </svg>
          </div>
          <div className="flex gap-3 justify-center text-xs">
            <span className="flex items-center gap-1">
              <span className="block w-2 h-2 rounded-full bg-[#27c473]" />
              Operational
            </span>
            <span className="flex items-center gap-1">
              <span className="block w-2 h-2 rounded-full bg-[#fe3b56]" />
              Suspended
            </span>
          </div>
        </div>

        {/* Status card */}
        <div className={cardClass + " col-span-1"}>
          <div className={titleClass}>Offine / Online / Suspended</div>
          <div className="flex gap-3 pt-4 pb-2 justify-around">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-[#27c473]">12</span>
              <span className={smallText}>Online</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-orange-400">3</span>
              <span className={smallText}>Offline</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-[#fe3b56]">1</span>
              <span className={smallText}>Suspended</span>
            </div>
          </div>
        </div>
      </div>

      {/* Large map and lower grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map card */}
        <div className="col-span-2 bg-white rounded-2xl shadow-md p-3 min-h-[320px] flex flex-col">
          <div className={titleClass}>Location Map</div>
          {/* Replace with actual map */}
          <div className="bg-[#e6f0f8] rounded-xl h-[230px] w-full flex items-center justify-center mt-3 text-gray-400">
            MAP
          </div>
        </div>
        {/* Table + Graph */}
        <div className="flex flex-col gap-4">
          {/* Alerts Table */}
          <div className="bg-white rounded-2xl shadow-md p-3">
            <div className={titleClass + " mb-2"}>
              Last 7 Days Alerts, Summary
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500">
                  <th>Date</th>
                  <th>Trips</th>
                  <th>Over Speed</th>
                  <th>Fatigue</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sat, 21 Dec</td>
                  <td>10</td>
                  <td>2</td>
                  <td>0</td>
                </tr>
                {/* ... */}
              </tbody>
            </table>
          </div>
          {/* Alerts Chart */}
          <div className="bg-white rounded-2xl shadow-md p-3 flex flex-col items-center">
            <div className={titleClass + " mb-2 text-center"}>
              Last 7 Days Alerts, Summary
            </div>
            <svg width={120} height={60}>
              {/* Mocked simple graph */}
              <polyline
                fill="#fde8d6"
                stroke="#fd9642"
                strokeWidth="2"
                points="0,50 20,30 40,25 60,15 80,10 120,45"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;
