import { STATUS_CONFIG } from "./statusConfig";

const VehicleStatusLegend = () => {
  return (
    <div className="absolute bottom-6 left-3 z-100 flex flex-col gap-2 bg-gray-50 px-1.5 py-2 rounded-xl">
      {STATUS_CONFIG.map((status) => (
        <div key={status.key} className="relative group flex items-center">
          <div
            className="w-8 h-8 rounded-xl shadow-md cursor-help border border-white/50"
            style={{ backgroundColor: status.color }}
          />
          {/* Tooltip */}
          <div className="absolute left-10 hidden group-hover:flex items-center z-50">
            <div className="bg-white text-black text-[11px] font-bold px-3 py-2 rounded-lg shadow-xl whitespace-nowrap border border-gray-100">
              <span className="block text-gray-800">{status.label}</span>
              <span className="block text-[9px] font-normal text-gray-500">
                {status.title}
              </span>
            </div>
            {/* Arrow */}
            <div className="w-2 h-2 bg-white border-l border-t border-gray-100 -rotate-45 -ml-1" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleStatusLegend;
