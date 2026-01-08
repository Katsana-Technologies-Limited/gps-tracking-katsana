import { useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import VehiclesStatusOption from "../AnalyticsSummaryPage/VehiclesStatusOption";

export default function VehicleStatusDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-34 right-4 z-40 bg-orange-500 text-white p-3.5 rounded-full shadow-lg xl:hidden"
      >
        <SlidersHorizontal size={20} />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl h-[80vh] p-3 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-semibold text-gray-700">Vehicle Filters</h3>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <VehiclesStatusOption />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
