import React from "react";
import Vehiclespeed from "./Vehiclespeed";

const VehicleInfoCard = ({ vehicle }) => {
  console.log(vehicle);
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-md rounded-2xl shadow-2xl px-2.5 pt-4.5 pb-1.5 bg-white overflow-hidden z-30 pointer-events-auto cursor-pointer">
      {/* 🟡 Header */}
      <div className="bg-[#fe8d1ce1] text-white px-4 py-2 flex items-center justify-evenly rounded-sm">
        <div>
          <p className="text-sm font-semibold">{vehicle.name ?? "TMV 44837"}</p>
          <p className="text-xs">{vehicle.vehicle_name ?? "DM NA 13-0756"}</p>
        </div>
        <img
          src={
            vehicle?.vehicle_type_image
              ? `${import.meta.VITE_API_URL}/uploads/vehicle_types/${
                  vehicle?.vehicle_type_image
                }`
              : "/car-icon.svg"
          }
          className="w-7 h-7"
          alt={vehicle?.vehicle_type_name || "vehicle icon"}
        />
        <div>
          <p className="text-xs">{vehicle.company ?? "Katsana"}</p>
        </div>
      </div>

      {/* 📊 Body */}
      <div className=" grid grid-cols-2 gap-3">
        <div className="col-span-1">
          <Vehiclespeed speed={Math.round(vehicle.speed ?? 0)} />
        </div>

        <div className=" col-span-1 text-xs text-gray-600">
          <p className="font-medium text-black mb-1">
            {vehicle.address ?? "Unknown location"}
          </p>
          <p>
            {vehicle.lat?.toFixed(5)}, {vehicle.lng?.toFixed(5)}
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            {vehicle.time ?? "Just now"}
          </p>
        </div>

        <div
          className={`col-span-2 rounded-xl px-3 py-2 text-sm font-medium ${
            vehicle.engine_status
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          Engine Status: {vehicle.engine_status ? "On" : "Off"}
        </div>
      </div>

      {/* 🔘 Actions */}
      <div className="border-t px-4 py-3 grid grid-cols-5 gap-3 text-gray-500">
        <button className="flex flex-col items-center text-xs">
          📍<span>Map</span>
        </button>
        <button className="flex flex-col items-center text-xs">
          🕒<span>History</span>
        </button>
        <button className="flex flex-col items-center text-xs">
          ⏱<span>Idle</span>
        </button>
        <button className="flex flex-col items-center text-xs">
          📈<span>Speed</span>
        </button>
        <button className="flex flex-col items-center text-xs">
          📌<span>Locate</span>
        </button>
      </div>
    </div>
  );
};
export default VehicleInfoCard;
