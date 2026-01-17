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
  const speed = Number(vehicle?.speed ?? vehicle?.device_data?.speed ?? 0);
  const online = vehicle?.online ?? vehicle?.device_data?.online ?? "offline";

  // Determine engine state: prefer explicit fields, otherwise infer from speed
  let engineState = null;
  if (
    vehicle &&
    vehicle.engine_status !== undefined &&
    vehicle.engine_status !== null
  ) {
    engineState = String(vehicle.engine_status);
  } else if (
    vehicle &&
    vehicle.engine !== undefined &&
    vehicle.engine !== null
  ) {
    engineState = String(vehicle.engine);
  } else {
    const minMoving = Number(vehicle?.device_data?.min_moving_speed ?? 5);
    engineState = speed >= minMoving ? "on" : "off";
  }

  const normalized = {
    ...vehicle,
    speed,
    online,
    engine: engineState,
    engine_status: engineState,
  };

  const status = STATUS_CONFIG.find((s) => s.condition(normalized));
  return status?.color ?? "#787878";
};
