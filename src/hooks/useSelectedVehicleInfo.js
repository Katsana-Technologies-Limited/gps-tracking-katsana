import { useSelector } from "react-redux";

export default function useSelectedVehicleInfo() {
  return useSelector((state) => state.vehicles.selectedVehicleInfo);
}
