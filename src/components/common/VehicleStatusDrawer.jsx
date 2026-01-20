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
      <button
        onClick={() => setOpen((p) => !p)}
        className="fixed top-18 right-4 z-70 lg:hidden flex items-center gap-2 px-3 py-1 rounded-lg bg-linear-to-r from-orange-400 to-orange-500 text-white text-sm font-medium shadow-lg"
        aria-label={open ? "Close vehicle drawer" : "Open vehicle drawer"}
        type="button"
      >
        {open ? <X size={18} /> : <Search size={18} />}
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px]">Selected</span>
          <span className="text-sm font-semibold">
            {stats.selectedCount}
            {stats.totalCount ? ` / ${stats.totalCount}` : ""}
          </span>
        </div>
      </button>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 lg:hidden bg-black/20 backdrop-blur-sm"
        />
      )}
      <div
        className={`fixed top-12 right-0 bottom-12 z-60 lg:hidden w-[92vw] max-w-sm transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-3 h-full overflow-y-auto">
          <VehiclesStatusOption onStatsChange={setStats} />
        </div>
      </div>
    </div>
  );
}
