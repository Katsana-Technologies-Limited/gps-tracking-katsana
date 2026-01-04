import React from "react";
import { Car } from "lucide-react";
import VehiclesDashboard from "../../components/VehiclesComp/VehiclesDashboard";

export default function Vehicles() {
  return (
    <>
      {/* <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Car size={48} className="text-[#fe8e1c] mb-4" />
      <h1 className="text-2xl font-bold mb-2">Vehicles</h1>
      <p className="text-gray-600">
        Vehicle management and tracking coming soon.     
      </p>
    </div> */}
      <VehiclesDashboard />
    </>
  );
}
