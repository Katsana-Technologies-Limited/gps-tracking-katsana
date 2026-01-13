export function getSpeedStatusInfo(vehicle) {
  const isOffline = vehicle.deviceStatus === "Offline";
  if (vehicle.liveDevice?.online === "ack") {
    return {
      bgColorClass: "bg-orange-100",
      textColorClass: "text-orange-600",
      displayText: "Engine Idle",
      isOffline,
      isEngineOff: false,
    };
  }
  const isEngineOff =
    vehicle.speed === "Engine Off" || vehicle.speedValue === 0;
  const speedVal = vehicle.speedValue;

  let bgColorClass = "";
  let textColorClass = "";
  let displayText = isEngineOff ? "Engine Off" : vehicle.speed;

  if (isOffline) {
    bgColorClass = "bg-gray-100";
    textColorClass = "text-gray-600";
  } else if (isEngineOff) {
    bgColorClass = "bg-red-100";
    textColorClass = "text-red-600";
  } else if (speedVal > 0 && speedVal < 5) {
    bgColorClass = "bg-blue-100";
    textColorClass = "text-blue-600";
  } else if (speedVal >= 5) {
    bgColorClass = "bg-green-100";
    textColorClass = "text-green-600";
  } else {
    bgColorClass = "bg-gray-100";
    textColorClass = "text-gray-600";
  }

  return {
    bgColorClass,
    textColorClass,
    displayText,
    isOffline,
    isEngineOff,
  };
}
