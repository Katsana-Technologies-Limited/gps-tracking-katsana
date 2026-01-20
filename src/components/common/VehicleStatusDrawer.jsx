import { useState } from "react";
import { Search, X } from "lucide-react";
import VehiclesStatusOption from "../AnalyticsSummary/VehiclesStatusOption";

export default function VehicleStatusDrawer() {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState({
    selectedCount: 0,
    totalCount: 0,
  });

  return (
    <div>
      {/* 🔘 TOP-RIGHT CARD BUTTON */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="fixed top-22 right-0 z-60 lg:hidden flex items-center gap-1 px-2 py-0.5 rounded-lg bg-linear-to-r  from-orange-400 to-orange-500 text-white text-sm font-medium shadow-lg "
      >
        {open ? <X size={20} /> : <Search size={20} />}
        <p className="flex flex-col items-center ">
          <span className="text-xs">Selected</span>
          {stats.selectedCount}
          {stats.totalCount ? ` / ${stats.totalCount}` : ""}
        </p>
      </button>

      {/* 👉 RIGHT SIDE DRAWER */}
      <div
        className={`
          fixed top-32 right-0 z-60 lg:hidden
          w-[92vw] max-w-sm
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="bg-white rounded-l-2xl shadow-2xl p-3 max-h-[95vh] overflow-y-auto">
          <VehiclesStatusOption onStatsChange={setStats} />
        </div>
      </div>
    </div>
  );
}
