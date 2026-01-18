import { STATUS_CONFIG } from "./statusConfig";

const VehicleStatusLegend = () => {
  return (
    <div
      className="
        absolute bottom-15 md:bottom-18 left-3 z-50
        flex flex-col gap-1.5
        bg-white/90 backdrop-blur
        px-1.5 py-2
        rounded-xl shadow-lg
      "
    >
      {STATUS_CONFIG.map((status) => (
        <div key={status.key} className="relative group flex items-center">
          {/* Color Box */}
          <div
            className="
              w-6 h-6 md:w-8 md:h-8
              rounded-lg md:rounded-xl
              shadow-sm
              border border-white/60
              cursor-help
            "
            style={{ backgroundColor: status.color }}
          />

          {/* Tooltip (Desktop only) */}
          <div
            className="
              absolute left-9
              hidden md:group-hover:flex
              items-center z-50
            "
          >
            <div className="bg-white text-black text-[11px] font-semibold px-3 py-2 rounded-lg shadow-xl whitespace-nowrap border border-gray-100">
              <span className="block text-gray-800">{status.label}</span>
              <span className="block text-[9px] font-normal text-gray-500">
                {status.title}
              </span>
            </div>

            {/* Tooltip Arrow */}
            <div className="w-2 h-2 bg-white border-l border-t border-gray-100 -rotate-45 -ml-1" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleStatusLegend;
