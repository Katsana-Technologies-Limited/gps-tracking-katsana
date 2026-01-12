import React, { useEffect, useMemo, useState } from "react";
import VehiclesStatusOption from "../AnalyticsSummary/VehiclesStatusOption";
import { getSpeedMeta } from "../../utilits/vehicleHelpers";
import { RotateCw } from "lucide-react";
import VehicleStatusDrawer from "./VehicleStatusDrawer";
import useCustomerVehicle from "../../hooks/useCustomerVehicle";
import useVtsAllDevices from "../../hooks/useVtsAllDevices";
import GlobalLoading from "../utils/GlobalLoading";
import NearbyLandmarkCell from "./NearbyLandmarkCell";

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
  const { allDevices = [] } = useVtsAllDevices();
  console.log(allDevices);

  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const [reloadTimer, setReloadTimer] = useState(60);
  const [isReloading, setIsReloading] = useState(false);

  // Enrich vehicles
  const enrichedDevices = useMemo(() => {
    if (!Array.isArray(customerVehicles)) return [];
    return customerVehicles.map((vehicle) => {
      const liveDevice = Array.isArray(allDevices)
        ? allDevices.find((d) => {
            const deviceImei = d.device_data?.imei || d.imei || d.imei_number;
            return deviceImei === vehicle.imei;
          })
        : null;
      let deviceStatus = "Unknown";
      if (vehicle.suspended) {
        deviceStatus = "Suspended";
      } else if (liveDevice) {
        deviceStatus = liveDevice.online === "online" ? "Online" : "Offline";
      }
      let speedStatus = "Engine Off";
      if (liveDevice?.speed && parseFloat(liveDevice.speed) > 0) {
        speedStatus = `${liveDevice.speed} km/h`;
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
          second: "2-digit",
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
        date,
        time,
        deviceStatus,
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
  }, [customerVehicles, allDevices]);

  useEffect(() => {
    if (!isReloading) return;
    if (reloadTimer === 0) {
      setTimeout(() => {
        setReloadTimer(60);
        setIsReloading(false);
      }, 0);
      return;
    }
    const t = setTimeout(() => setReloadTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [isReloading, reloadTimer]);

  const handleReload = () => {
    if (isReloading) return;
    setIsReloading(true);
    // trigger refetch if needed
  };

  const filtered = useMemo(() => {
    let list =
      activeTab === "All"
        ? enrichedDevices
        : enrichedDevices.filter((v) => v.deviceStatus === activeTab);

    if (selectedIds.length > 0) {
      list = list.filter((v) => selectedIds.includes(v.id));
    }
    return list;
  }, [enrichedDevices, activeTab, selectedIds]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) return <GlobalLoading message="Loading vehicles..." />;

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
                  const isOnline = vehicle.deviceStatus === "Online";
                  const isSuspended = vehicle.deviceStatus === "Suspended";

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
                        {(() => {
                          // Find the live device for this vehicle
                          const liveDevice = Array.isArray(allDevices)
                            ? allDevices.find((d) => {
                                const deviceImei =
                                  d.device_data?.imei ||
                                  d.imei ||
                                  d.imei_number;
                                return deviceImei === vehicle.imei;
                              })
                            : null;
                          const lat =
                            !isSuspended && liveDevice?.lat
                              ? liveDevice.lat
                              : vehicle.lat;
                          const lng =
                            !isSuspended && liveDevice?.lng
                              ? liveDevice.lng
                              : vehicle.lng;
                          return (
                            <NearbyLandmarkCell
                              lat={lat}
                              lng={lng}
                              suspended={isSuspended}
                            />
                          );
                        })()}
                      </td>
                      <td className="p-4 text-nowrap">
                        <div className="flex flex-col items-center gap-1">
                          <img
                            src={speedMeta.icon}
                            className="w-8 h-8"
                            alt="speed"
                          />
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              vehicle.speed === "Engine Off"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {vehicle.speed === "Engine Off"
                              ? "Engine Off"
                              : `${vehicle.speed}`}
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
                            className={`px-2 py-1 rounded-full text-xs w-fit font-medium
                            ${
                              isOnline
                                ? "bg-green-100 text-green-700"
                                : isSuspended
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {vehicle.deviceStatus}
                          </span>
                          {!isSuspended && vehicle.renewal ? (
                            <span
                              className={`text-xs font-medium ${
                                vehicle.isExpired
                                  ? "text-red-500"
                                  : "text-orange-500"
                              }`}
                            >
                              {vehicle.renewal}
                            </span>
                          ) : (
                            vehicle.expiry !== "-" && (
                              <span className="text-xs text-red-500">
                                Expired On: {vehicle.expiry}
                              </span>
                            )
                          )}
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
