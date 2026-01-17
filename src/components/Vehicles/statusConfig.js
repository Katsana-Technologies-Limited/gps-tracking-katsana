export const STATUS_CONFIG = [
  {
    key: "moving",
    label: "Moving",
    // title: "Vehicle speed is ≥ 5 KM/H",
    title: "Vehicle speed is greater than or equal to 5KM/H",
    color: "#95F0B3", // Light Green
    condition: (v) => Number(v.speed) >= 5 && v.online === "online",
  },
  {
    key: "slow",
    label: "Slow",
    // title: "Vehicle speed is < 5 KM/H",
    title: "Vehicle speed is less than 5 KM/H",
    color: "#95D8F0", // Light Blue
    condition: (v) =>
      Number(v.speed) < 5 && Number(v.speed) > 0 && v.online === "online",
  },
  {
    key: "recent_off",
    label: "Recently Off",
    title: "Engine has been turned off recently",
    color: "#F0C695", // Orange/Tan
    condition: (v) => v.engine === "off" && v.online === "online", // আপনার API অনুযায়ী লজিক বদলাতে পারেন
  },
  {
    key: "off",
    label: "Off",
    title: "Engine is currently turned off",
    color: "#F09D95", // Pink/Red
    condition: (v) => v.engine === "off" && v.online === "online",
  },
  {
    key: "offline",
    label: "Offline",
    title: "Vehicle is Offline and Data received more than 24 hrs ago",
    color: "#787878", // Gray
    condition: (v) => v.online !== "online",
  },
];

export const getVehicleWaveColor = (vehicle) => {
  const status = STATUS_CONFIG.find((s) => s.condition(vehicle));
  return status?.color ?? "#787878";
};
