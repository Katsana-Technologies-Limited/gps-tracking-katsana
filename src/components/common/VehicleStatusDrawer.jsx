import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import VehiclesStatusOption from "../AnalyticsSummary/VehiclesStatusOption";

export default function VehicleStatusDrawer() {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState({
    selectedCount: 0,
    totalCount: 0,
  });

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prev || "";
    }
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  return (
    <div>
      {/* fixed counter button when drawer is closed */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-18 right-0 z-70 lg:hidden flex items-center gap-2 px-3 py-1 rounded-lg bg-linear-to-r from-orange-400 to-orange-500 text-white text-sm font-medium shadow-lg"
          aria-label="Open vehicle drawer"
          type="button"
        >
          <Search size={18} />
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px]">Selected</span>
            <span className="text-sm font-semibold">
              {stats.selectedCount}
              {stats.totalCount ? ` / ${stats.totalCount}` : ""}
            </span>
          </div>
        </button>
      )}

      {/* backdrop overlay when open */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 lg:hidden bg-black/20 backdrop-blur-sm"
        />
      )}

      {/* drawer: slides from right; contains attached close button on its left edge */}
      <div
        className={`fixed top-14 right-0 bottom-10 z-60 lg:hidden transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative w-[86vw] max-w-sm h-full">
          {/* close button attached to drawer's left edge (moves with drawer) */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Close vehicle drawer"
            type="button"
            className="absolute z-70 lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-r from-orange-400 to-orange-500 text-white shadow-md -left-12 top-6"
          >
            <X size={18} />
          </button>

          <div
            className="bg-white rounded-2xl shadow-2xl p-3 h-full overflow-y-auto scrollbar-thin"
            onWheel={(e) => e.stopPropagation()}
          >
            <VehiclesStatusOption onStatsChange={setStats} />
          </div>
        </div>
      </div>
    </div>
  );
}
