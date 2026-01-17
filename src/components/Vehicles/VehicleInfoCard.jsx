import Vehiclespeed from "./Vehiclespeed";
import NearByLocation from "./NearByLocation";
import { MdFlashOn } from "react-icons/md";
import { LuClock } from "react-icons/lu";
import { IoCloseCircle } from "react-icons/io5";
import VehicleActions from "./VehicleActions";

const VehicleInfoCard = ({ vehicle, onClose }) => {
  const formatTime = (timeString) => {
    if (!timeString) return { formatted: "-", ago: "-" };
    const date = new Date(timeString);

    const formatted = date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const ago = diffInSeconds < 0 ? 0 : diffInSeconds;

    return { formatted, ago };
  };

  const { formatted, ago } = formatTime(vehicle.time);
  return (
    <div className="absolute bottom-[0.5px] left-1/2 -translate-x-1/2 w-md rounded-2xl shadow-2xl px-2.5 pt-6 pb-1.5 bg-white overflow-hidden z-30 pointer-events-auto cursor-default">
      {/* ❌ Close Button (Red marked icon style) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-1.5 right-0.5 z-50 bg-white rounded-full text-gray-400 hover:text-red-500 shadow-lg cursor-pointer transition-colors"
      >
        <IoCloseCircle size={32} />
      </button>

      {/* 🟡 Header */}
      <div className="bg-[#fe8d1ce1] text-white px-4 py-2 flex items-center justify-evenly rounded-sm mb-1">
        <div>
          <p className="text-sm font-semibold">{vehicle.name ?? "TMV 44837"}</p>
          <p className="text-xs">{vehicle.vehicle_name ?? "DM NA 13-0756"}</p>
        </div>
        <img
          src={`${import.meta.env.VITE_API_URL}${vehicle?.vehicle_type_image}`}
          className="w-7 h-7"
          alt={vehicle?.vehicle_type_name || "vehicle icon"}
        />
        <div>
          <p className="text-xs">{vehicle.company ?? "Katsana"}</p>
        </div>
      </div>
      <div className="px-1 py-1">
        <div className=" grid grid-cols-2 gap-1 mb-2">
          <div className="col-span-1">
            <Vehiclespeed speed={Math.round(vehicle.speed ?? 0)} />
          </div>
          <div className=" col-span-1 flex flex-col items-start  bg-[#FFF9F4] rounded-sm w-full shadow-sm">
            {/* <p className="font-medium text-black mb-1">
            {vehicle.address ?? "Unknown location"}
          </p> */}
            <NearByLocation vehicleData={vehicle} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div
            className={`flex items-center gap-2 border ${
              vehicle.engine_status
                ? "bg-[#F0F9F6]  border-[#E0F2EB]"
                : "bg-[#f3e2defa] border-[#dfcfccfa]"
            }  rounded-lg px-3 py-2 `}
          >
            <div
              className={`${
                vehicle.engine_status ? "bg-[#10B981]" : "bg-[#b64f35fa]"
              } p-1 rounded-full text-white`}
            >
              <MdFlashOn size={16} />
            </div>
            <span className="text-sm font-semibold text-[#1F2937]">
              Engine Status: {vehicle.engine_status ? "On" : "Off"}
            </span>
          </div>
          <div className="flex items-start gap-2 bg-[#FFFCEB] border border-[#FDF2D0] rounded-lg px-3 py-2">
            <div className="text-[#F59E0B] mt-0.5">
              <LuClock size={18} fill="#F59E0B" className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#1F2937] leading-tight">
                {formatted}
              </span>
              <span className="text-[11px] text-[#4B5563]">
                ({ago} seconds ago)
              </span>
            </div>
          </div>
        </div>
      </div>
      <VehicleActions vehicle={vehicle} />
    </div>
  );
};
export default VehicleInfoCard;
