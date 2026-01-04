// utils/vehicleHelpers.js
export const speedColor = (speed) => {
  if (speed <= 20) return "text-green-600";
  if (speed <= 60) return "text-yellow-500";
  return "text-red-500";
};

export const mockReverseGeocode = async (lat, lng) => {
  return "Bashundhara City Shopping Complex (0.17km)";
};
