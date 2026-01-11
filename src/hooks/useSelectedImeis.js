import { useSelector } from "react-redux";

export default function useSelectedImeis() {
  return useSelector((state) => state.vehicles.selectedImeis);
}
