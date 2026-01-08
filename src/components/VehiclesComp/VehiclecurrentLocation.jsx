import React, { useState } from "react";
import VehiclesStatusOption from "../AnalyticsSummaryPage/VehiclesStatusOption";
import { Power, RotateCw } from "lucide-react";
import VehicleStatusDrawer from "./VehicleStatusDrawer";
import VehiclesStatusMap from "../AnalyticsSummaryPage/VehiclesStatusMap";
import { TrafficToggle } from "../utils/TrafficToggle";

export default function VehiclecurrentLocation() {
  const [trafficOn, setTrafficOn] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-700">
          Current Location
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-linear-to-r from-[#00c47f] to-[#016b46] text-white font-bold flex gap-2 items-center">
            <Power className="w-4 h-4" />
            Engine is Unlocked
          </button>
          <button className="px-4 py-2 rounded-lg bg-linear-to-r from-orange-400 to-orange-500 text-white font-bold flex gap-2 items-center">
            <img
              src="/icons/vehicel/VirtualWatchmansvg.svg"
              alt="Virtual Watchman image"
              className="w-4 h-4"
            />
            Virtual Watchman
          </button>
          <div className="flex items-center gap-3  ">
            <span className="text-sm font-semibold text-gray-600">Traffic</span>
            <TrafficToggle enabled={trafficOn} onToggle={setTrafficOn} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
        <div className="xl:col-span-5">
          <VehiclesStatusMap />
        </div>
        <div className="xl:col-span-2">
          <div className="hidden xl:block bg-white rounded-xl shadow-sm h-[calc(100vh-140px)]">
            <VehiclesStatusOption />
          </div>
          <div className="xl:hidden">
            <VehicleStatusDrawer />
          </div>
        </div>
      </div>
    </div>
  );
}
