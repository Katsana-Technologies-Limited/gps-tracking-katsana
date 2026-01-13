/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from "react";
// Meter SVG component with dynamic gradient
function MeterIcon({ color = "green" }) {
  // Gradients for green, blue, gray
  const gradients = {
    green: (
      <>
        <linearGradient id="meterGreen0" x1="38.5" y1="1.79612" x2="-7.10064" y2="21.2426" gradientUnits="userSpaceOnUse">
          <stop stopColor="#26886E" />
          <stop offset="1" stopColor="#44E3A1" />
        </linearGradient>
        <linearGradient id="meterGreen1" x1="32.7981" y1="5.43934" x2="-1.80199" y2="19.4172" gradientUnits="userSpaceOnUse">
          <stop stopColor="#26886E" />
          <stop offset="1" stopColor="#44E3A1" />
        </linearGradient>
        <linearGradient id="meterGreen2" x1="12.4303" y1="8.53666" x2="18.1259" y2="20.952" gradientUnits="userSpaceOnUse">
          <stop stopColor="#26886E" />
          <stop offset="1" stopColor="#44E3A1" />
        </linearGradient>
      </>
    ),
    blue: (
      <>
        <linearGradient id="meterBlue0" x1="38.5" y1="1.79612" x2="-7.10064" y2="21.2426" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563eb" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="meterBlue1" x1="32.7981" y1="5.43934" x2="-1.80199" y2="19.4172" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563eb" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="meterBlue2" x1="12.4303" y1="8.53666" x2="18.1259" y2="20.952" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563eb" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
      </>
    ),
    gray: (
      <>
        <linearGradient id="meterGray0" x1="38.5" y1="1.79612" x2="-7.10064" y2="21.2426" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9ca3af" />
          <stop offset="1" stopColor="#d1d5db" />
        </linearGradient>
        <linearGradient id="meterGray1" x1="32.7981" y1="5.43934" x2="-1.80199" y2="19.4172" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9ca3af" />
          <stop offset="1" stopColor="#d1d5db" />
        </linearGradient>
        <linearGradient id="meterGray2" x1="12.4303" y1="8.53666" x2="18.1259" y2="20.952" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9ca3af" />
          <stop offset="1" stopColor="#d1d5db" />
        </linearGradient>
      </>
    ),
  };
  let grad = gradients.green;
  let fill0 = "url(#meterGreen0)", fill1 = "url(#meterGreen1)", fill2 = "url(#meterGreen2)";
  if (color === "blue") {
    grad = gradients.blue;
    fill0 = "url(#meterBlue0)";
    fill1 = "url(#meterBlue1)";
    fill2 = "url(#meterBlue2)";
  } else if (color === "gray") {
    grad = gradients.gray;
    fill0 = "url(#meterGray0)";
    fill1 = "url(#meterGray1)";
    fill2 = "url(#meterGray2)";
  }
  return (
    <svg width="32" height="19" viewBox="0 0 32 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>{grad}</defs>
      <path d="M15.9969 0C7.16277 0 0 7.11464 0 15.8887C0 16.8049 0.0784221 17.7038 0.228365 18.5783C0.2704 18.8225 0.484335 19 0.734031 19H2.64879C2.97251 19 3.21343 18.706 3.15069 18.3908C2.99071 17.5811 2.90727 16.7445 2.90727 15.8887C2.90727 8.72045 8.77889 2.88709 15.9962 2.88647C23.0781 2.88585 28.9139 8.53359 29.089 15.5629C29.1128 16.5315 29.0294 17.4777 28.8499 18.3896C28.7878 18.7054 29.0281 19 29.3525 19H31.2672C31.5163 19 31.7309 18.8225 31.7729 18.5783C31.9228 17.7044 32.0013 16.8049 32.0013 15.8887C32 7.11464 24.8341 0 15.9969 0Z" fill={fill0} />
      <path d="M27.9449 15.887C27.9449 15.887 27.9449 15.8876 27.9443 15.8876V15.8901C27.9443 16.8107 27.8358 17.7245 27.625 18.6121C27.5704 18.8407 27.3633 19.0014 27.1262 19.0014C26.7937 19.0014 26.5521 18.6925 26.6287 18.3711C26.7818 17.7245 26.8759 17.0618 26.9066 16.394H25.7999C25.5063 16.394 25.2704 16.1474 25.2905 15.8521C25.3087 15.583 25.5458 15.38 25.8175 15.38H26.9104C26.8351 13.7748 26.4053 12.2612 25.7002 10.9113L24.7378 11.4626C24.4944 11.6021 24.1819 11.5205 24.0401 11.2764C23.899 11.0341 23.983 10.7239 24.2271 10.5843L25.1876 10.0337C24.3375 8.72252 23.212 7.60443 21.8907 6.76041L21.3368 7.71406C21.195 7.95823 20.8819 8.03921 20.6391 7.9003C20.3951 7.76015 20.311 7.44995 20.4522 7.20765L21.0074 6.25214C19.6472 5.55201 18.1227 5.12533 16.5066 5.05058V6.1531C16.5066 6.44461 16.2581 6.67882 15.9608 6.65888C15.6897 6.64082 15.4852 6.40537 15.4852 6.13566V5.05058C13.8672 5.12408 12.3414 5.55076 10.9806 6.25214L11.5359 7.20765C11.677 7.44995 11.5936 7.76015 11.3489 7.9003C11.1061 8.03921 10.7931 7.95823 10.6513 7.71406L10.0973 6.76041C8.77793 7.60443 7.65241 8.72252 6.80294 10.0337L7.76408 10.5843C8.00876 10.7239 8.0922 11.0341 7.95167 11.2764C7.80926 11.5205 7.49682 11.6015 7.25403 11.4626L6.291 10.9107C5.58583 12.2612 5.15671 13.7748 5.08142 15.38H6.17494C6.44722 15.38 6.68437 15.5843 6.70194 15.854C6.72076 16.1492 6.48549 16.394 6.1925 16.394H5.08518C5.11655 17.0624 5.21003 17.7245 5.36311 18.3711C5.43903 18.6925 5.19811 19.0014 4.8656 19.0014H4.86497C4.62845 19.0014 4.42079 18.8407 4.36621 18.6121C4.15478 17.7245 4.04688 16.8107 4.04688 15.8901V15.887C4.04688 15.8864 4.04688 15.8864 4.04688 15.8857C4.04938 9.31177 9.44985 4.02344 15.9928 4.02344H15.9959C15.9965 4.02344 15.9965 4.02344 15.9972 4.02344C22.5225 4.02593 27.9424 9.29931 27.9443 15.8857C27.9443 15.8864 27.9449 15.8864 27.9449 15.887Z" fill={fill1} />
      <path d="M12.1045 11.0797L15.0566 15.9235C14.769 16.2534 14.6046 16.6923 14.6324 17.1646C14.6884 18.1165 15.5032 18.8453 16.4484 18.7897C17.3935 18.734 18.1165 17.9147 18.0604 16.9627C18.0044 16.0107 17.1902 15.2813 16.2451 15.3369C16.1331 15.3435 16.0257 15.3624 15.9206 15.3893L12.9685 10.5455C12.8221 10.3053 12.51 10.23 12.271 10.3773C12.0326 10.5246 11.9575 10.8388 12.1045 11.0797Z" fill={fill2} />
    </svg>
  );
}
import VehiclesStatusOption from "../AnalyticsSummary/VehiclesStatusOption";
import { getSpeedMeta } from "../../utilits/vehicleHelpers";
import { RotateCw } from "lucide-react";
import VehicleStatusDrawer from "./VehicleStatusDrawer";
import useCustomerVehicle from "../../hooks/useCustomerVehicle";
import useVtsAllDevices from "../../hooks/useVtsAllDevices";
import NearbyLandmarkCell from "./NearbyLandmarkCell";
import useSelectedImeis from "../../hooks/useSelectedImeis";
import LottieLoading from "../utils/LottieLoading";

const PAGE_SIZE = 5;

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
}

function getRenewalInfo(expiryDate) {
  if (!expiryDate) return "";
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return `Renewal in ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  } else if (diffDays === 0) {
    return "Expires today";
  } else {
    return `Expired ${Math.abs(diffDays)} day${
      Math.abs(diffDays) !== 1 ? "s" : ""
    } ago`;
  }
}

export default function VehiclesDashboard() {
  const { data: customerVehicles = [], isLoading } = useCustomerVehicle();
  // console.log("customerVehicles", customerVehicles);
  const { filteredDevices = [] } = useVtsAllDevices();
  console.log("filteredDevices", filteredDevices);
  const selectedImeis = useSelectedImeis();
  const [activeTab] = useState("All");
  const [page, setPage] = useState(1);
  const [reloadTimer, setReloadTimer] = useState(60);
  const [isReloading, setIsReloading] = useState(false);

  // Enrich vehicles
  const enrichedDevices = useMemo(() => {
    if (!Array.isArray(customerVehicles)) return [];

    return customerVehicles.map((vehicle) => {
      // Find matching device by imei from filteredDevices (only selected IMEIs)
      const liveDevice = Array.isArray(filteredDevices)
        ? filteredDevices.find((d) => {
            const deviceImei =
              d.device_data?.imei ||
              d.imei ||
              d.imei_number ||
              d.device_data?.imei_number;
            return (
              deviceImei && deviceImei.toString() === vehicle.imei.toString()
            );
          })
        : null;

      // Device Status logic: Online (green), Idle (yellow/ack), Offline (red), Suspended (red)
      let deviceStatus = "Unknown";
      if (vehicle.suspended) {
        deviceStatus = "Suspended";
      } else if (liveDevice) {
        if (liveDevice.online === "online") {
          deviceStatus = "Online"; // Green
        } else if (liveDevice.online === "ack") {
          deviceStatus = "Idle"; // Yellow
        } else {
          deviceStatus = "Offline"; // Red
        }
      } else {
        deviceStatus = "Offline"; // Red
      }

      let speedStatus = "Engine Off";
      let speedValue = 0;

      if (liveDevice?.online === "ack") {
        speedStatus = "Engine Idle";
        speedValue = 0;
      } else if (
        liveDevice?.speed !== undefined &&
        liveDevice?.speed !== null
      ) {
        const speedNum = parseFloat(liveDevice.speed);
        if (!isNaN(speedNum) && speedNum > 0) {
          speedStatus = `${speedNum} km/h`;
          speedValue = speedNum;
        }
      }

      const lat = liveDevice?.lat ?? vehicle.lat ?? "-";
      const lng = liveDevice?.lng ?? vehicle.lng ?? "-";

      let date = "-";
      let time = "-";
      if (liveDevice?.time) {
        const timestamp = new Date(liveDevice.time);
        date = timestamp.toLocaleDateString("en-GB");
        time = timestamp.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      }

      const expiryDate = vehicle.expire_date
        ? formatDate(vehicle.expire_date)
        : "-";

      return {
        ...vehicle,
        id: vehicle.id,
        customer: vehicle.company || "N/A",
        vehicle: vehicle.vehicle_name || "N/A",
        reg: vehicle.subscription_number || "N/A",
        lat,
        lng,
        speed: speedStatus,
        speedValue: speedValue,
        date,
        time,
        deviceStatus,
        liveDevice,
        expiry: expiryDate,
        renewal:
          !vehicle.suspended &&
          vehicle.expire_date &&
          getRenewalInfo(vehicle.expire_date),
        isExpired: vehicle.expire_date
          ? new Date(vehicle.expire_date) < new Date()
          : false,
      };
    });
  }, [customerVehicles, filteredDevices]);

  const handleReload = () => {
    if (isReloading) return;
    setIsReloading(true);
    // trigger refetch if needed
  };

  // Only show selected vehicles (by IMEI). If none selected, show none.
  const filtered = useMemo(() => {
    const imeis = selectedImeis || [];
    let list =
      activeTab === "All"
        ? enrichedDevices
        : enrichedDevices.filter((v) => v.deviceStatus === activeTab);
    if (imeis.length > 0) {
      list = list.filter((v) => imeis.includes(v.imei));
    } else {
      list = [];
    }
    return list;
  }, [enrichedDevices, activeTab, selectedImeis]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Function to determine speed status colors
  function getSpeedStatusInfo(vehicle) {
    const isOffline = vehicle.deviceStatus === "Offline";
    // If online is ack, always show Engine Idle
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

  if (isLoading) return <LottieLoading />;

  return (
    <div className="space-y-4 scrollbar-thin">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-700">Vehicles List</h1>
        <div className="flex gap-2">
          <button
            onClick={handleReload}
            disabled={isReloading}
            className={`px-4 py-2 cursor-pointer rounded-lg text-md font-medium flex items-center gap-2 border border-gray-300
              ${
                isReloading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[#c1d1de] hover:bg-[#b0c6d6] text-gray-700"
              }`}
          >
            <RotateCw
              className={`w-4 h-4 ml-auto ${isReloading ? "animate-spin" : ""}`}
            />
            Reload {isReloading && `(${reloadTimer}s)`}
          </button>
          <button className="px-4 py-2 cursor-pointer rounded-lg bg-linear-to-r from-orange-400 to-orange-500 text-white font-medium flex gap-2 border border-gray-300 hover:from-orange-500 hover:to-orange-600">
            <img src="/icons/vehicel/export.svg" alt="export" />
            Export
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="xl:col-span-3">
          {/* 📋 TABLE */}
          <div className="bg-white border border-gray-300 rounded-xl shadow-sm relative overflow-x-auto scrollbar-thin">
            <table className="min-w-full w-full text-sm">
              <thead className="bg-orange-50 text-gray-600">
                <tr className="border-b border-gray-200">
                  <th className="p-4 text-left">Customer Name</th>
                  <th className="p-4 text-left">Vehicle</th>
                  <th className="p-4 text-left">Nearby Landmark</th>
                  <th className="p-4 text-left">Speed Status</th>
                  <th className="p-4 text-left">Date | Time</th>
                  <th className="p-4 text-left">Device Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((vehicle) => {
                  const speedMeta = getSpeedMeta(vehicle.speed);
                  const speedStatusInfo = getSpeedStatusInfo(vehicle);
                  // Color logic for Device Status
                  let statusClass = "bg-gray-100 text-gray-600";
                  if (vehicle.deviceStatus === "Online") {
                    statusClass = "bg-green-100 text-green-700";
                  } else if (vehicle.deviceStatus === "Idle") {
                    statusClass = "bg-yellow-100 text-yellow-700";
                  } else if (vehicle.deviceStatus === "Offline" || vehicle.deviceStatus === "Suspended") {
                    statusClass = "bg-red-100 text-red-600";
                  }

                  return (
                    <tr
                      key={vehicle.id}
                      className="border-b border-gray-200 last:border-0 hover:bg-gray-50"
                    >
                      <td className="p-4 font-medium">{vehicle.customer}</td>
                      <td className="p-4">
                        <div className="font-medium text-gray-800">
                          {vehicle.vehicle}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {vehicle.reg}
                        </div>
                      </td>
                      <td className="p-4 max-w-xs">
                        <NearbyLandmarkCell
                          lat={vehicle.lat}
                          lng={vehicle.lng}
                          suspended={vehicle.deviceStatus === "Suspended"}
                        />
                      </td>
                      <td className="p-4 text-nowrap">
                        <div className="flex flex-col items-center gap-1">
                          {/* Meter icon: SVG with dynamic gradient color */}
                          <span className="w-8 h-8 flex items-center justify-center">
                            {(() => {
                              // Color logic: green (>=5), blue (0<speed<5), gray (else)
                              let meterColor = "gray";
                              if (vehicle.deviceStatus === "Offline" || vehicle.deviceStatus === "Suspended") {
                                meterColor = "gray";
                              } else if (vehicle.liveDevice?.online === "ack") {
                                meterColor = "gray";
                              } else if (vehicle.speedValue >= 5) {
                                meterColor = "green";
                              } else if (vehicle.speedValue > 0 && vehicle.speedValue < 5) {
                                meterColor = "blue";
                              }
                              return <MeterIcon color={meterColor} />;
                            })()}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${speedStatusInfo.bgColorClass} ${speedStatusInfo.textColorClass}`}
                          >
                            {speedStatusInfo.displayText}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-gray-700">{vehicle.date}</span>
                          <span className="text-xs text-gray-500">
                            {vehicle.time}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-2 justify-center items-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs w-fit font-medium ${statusClass}`}
                          >
                            {vehicle.deviceStatus}
                          </span>
                          {vehicle.expiry !== "-" &&
                            (vehicle.deviceStatus === "Suspended" ? (
                              <span className="text-xs font-medium text-red-500">
                                Expired on: {vehicle.expiry}
                              </span>
                            ) : (
                              <>
                                <span className="text-xs font-medium text-gray-600">
                                  Expiry: {vehicle.expiry}
                                </span>
                                {vehicle.renewal_in !== undefined &&
                                  vehicle.renewal_in !== null &&
                                  vehicle.renewal_in <= 5 && (
                                    <span className="text-xs font-medium text-orange-500 block">
                                      Renewal in {vehicle.renewal_in} day
                                      {vehicle.renewal_in !== 1 ? "s" : ""}
                                    </span>
                                  )}
                              </>
                            ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-3">
                          <img
                            src="/icons/vehicel/location-pin.svg"
                            className="w-5 h-5"
                            alt=""
                          />
                          <img
                            src="/icons/vehicel/time-duration.svg"
                            className="w-5 h-5"
                            alt=""
                          />
                          <img
                            src="/icons/vehicel/calendar-minimalistic.svg"
                            className="w-5 h-5"
                            alt=""
                          />
                          <img
                            src="/icons/vehicel/stop-timer.svg"
                            className="w-5 h-5"
                            alt=""
                          />
                          <img
                            src="/icons/vehicel/locations-route.svg"
                            className="w-5 h-5"
                            alt=""
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* PAGINATION */}
          <div className="flex justify-end gap-2 p-4">
            {Array.from({ length: Math.ceil(filtered.length / PAGE_SIZE) }).map(
              (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 cursor-pointer rounded border border-gray-300
                    ${
                      page === i + 1
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        </div>
        <div className="xl:col-span-1">
          <div className="hidden xl:block bg-white border border-gray-300 rounded-xl shadow-sm h-[calc(100vh-140px)] scrollbar-thin">
            <VehiclesStatusOption />
          </div>
          <div className="xl:hidden">
            <VehicleStatusDrawer />
          </div>
        </div>
      </div>
    </div>
  );
}
