import React from "react";

const VehicleAlerts = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-700">Vehicle Alerts</h1>
        <div className="flex flex-wrap items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-linear-to-r from-red-400 to-red-600 text-white font-bold flex gap-2 items-center">
            Active Alerts
          </button>
          <button className="px-4 py-2 rounded-lg bg-linear-to-r from-yellow-400 to-yellow-600 text-white font-bold flex gap-2 items-center">
            History
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
        <div className="xl:col-span-5">
          <div className="bg-gray-100 rounded-lg p-6 h-64 flex items-center justify-center text-gray-500">
            Vehicle alert list will appear here.
          </div>
        </div>
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow p-4 h-64 flex flex-col justify-center items-center">
            <span className="font-semibold text-gray-700 mb-2">
              Alert Summary
            </span>
            <span className="text-gray-500">Demo alert summary and stats.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleAlerts;
