import React from "react";

const FindHelp = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-700">Find Help</h1>
        <div className="flex flex-wrap items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-linear-to-r from-green-400 to-green-600 text-white font-bold flex gap-2 items-center">
            Emergency
          </button>
          <button className="px-4 py-2 rounded-lg bg-linear-to-r from-blue-400 to-blue-600 text-white font-bold flex gap-2 items-center">
            Roadside
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
        <div className="xl:col-span-5">
          <div className="bg-gray-100 rounded-lg p-6 h-64 flex items-center justify-center text-gray-500">
            {/* Demo placeholder for help map or contacts */}
            Help map/contacts will appear here.
          </div>
        </div>
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow p-4 h-64 flex flex-col justify-center items-center">
            <span className="font-semibold text-gray-700 mb-2">
              Help Details
            </span>
            <span className="text-gray-500">
              Demo help details and emergency info.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindHelp;
