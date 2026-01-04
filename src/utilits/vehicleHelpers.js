// utilits/vehicleHelpers.js

export const mockReverseGeocode = async (lat, lng) => {
  return "Bashundhara City Shopping Complex (0.17km)";
};

export const getSpeedMeta = (speed) => {
  if (speed <= 30) {
    return {
      label: "Normal",
      text: "text-green-600",
      bg: "bg-green-100",
      icon: "/icons/vehicel/speed-meter-green.svg",
    };
  }

  if (speed <= 70) {
    return {
      label: "Risk",
      text: "text-orange-500",
      bg: "bg-orange-100",
      icon: "/icons/vehicel/speed-meter-orange.svg",
    };
  }

  return {
    label: "Overspeed",
    text: "text-red-600",
    bg: "bg-red-100",
    icon: "/icons/vehicel/speed-meter-red.svg",
  };
};
