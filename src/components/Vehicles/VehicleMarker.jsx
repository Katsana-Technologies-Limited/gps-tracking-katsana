import { Car, Radar, Radio } from "lucide-react";

export const VehicleMarker = ({ count = 1 }) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* 🔵 Number Badge */}
      <div
        className="
        absolute 
        top-[-6px] right-[-6px]
        rounded-full 
        text-white 
        text-sm 
        font-bold 
        flex 
        items-center 
        justify-center 
        shadow-lg
        z-20
      "
        // style={{ top: "-6px", right: "-6px" }}
      >
        {count}
      </div>

      {/* 🚗 Vehicle Icon */}
      <div
        className="
        w-15 h-15
        rounded-full 
        shadow-xl 
        flex 
        items-center 
        justify-center
      "
      >
        <img src="/icons/rader.png" className="w-full h-full" />
      </div>

      {/* 🔄 Hazard / Radar Pulse */}
      <span
        className="
        absolute 
        w-14 h-14 
        rounded-full 
        bg-blue-400 
        opacity-30 
        animate-ping
      "
      />
    </div>
  );
};
