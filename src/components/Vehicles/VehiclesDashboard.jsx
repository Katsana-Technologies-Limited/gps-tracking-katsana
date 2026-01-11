/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import VehiclesStatusOption from "../AnalyticsSummary/VehiclesStatusOption";
import { getSpeedMeta, mockReverseGeocode } from "../../utilits/vehicleHelpers";
import { RotateCw } from "lucide-react";
import VehicleStatusDrawer from "./VehicleStatusDrawer";

const PAGE_SIZE = 5;
export default function VehiclesDashboard() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const [reloadTimer, setReloadTimer] = useState(60);
  const [isReloading, setIsReloading] = useState(false);

  const filteredDevices = useMemo(
    () => [
      {
        id: 1,
        imei: "123456789012345",
        device_data: {
          id: 1,
          imei: "123456789012345",
          name: "Toyota Camry",
          subscription_number: "REG1234",
        },
        online: "online",
        lat: 3.139,
        lng: 101.6869,
        speed: 60,
        time: "2026-01-11 10:00:00",
        company: "Katsana",
      },
      {
        id: 2,
        imei: "987654321098765",
        device_data: {
          id: 2,
          imei: "987654321098765",
          name: "Honda City",
          subscription_number: "REG5678",
        },
        online: "offline",
        lat: 3.15,
        lng: 101.7,
        speed: 0,
        time: "2026-01-11 09:45:00",
        company: "Katsana",
      },
    ],
    []
  );
  const customerVehicles = useMemo(
    () => [
      {
        id: 1,
        imei: "123456789012345",
        company: "Katsana",
        vehicle_name: "Toyota Camry",
        subscription_number: "REG1234",
        lat: 3.139,
        lng: 101.6869,
      },
      {
        id: 2,
        imei: "987654321098765",
        company: "Katsana",
        vehicle_name: "Honda City",
        subscription_number: "REG5678",
        lat: 3.15,
        lng: 101.7,
      },
    ],
    []
  );

  const [enrichedDevices, setEnrichedDevices] = useState([]);
  useEffect(() => {
    const enrich = async () => {
      let enriched = [];
      if (activeTab === "All") {
        // Show all vehicles from DB, merge live VTS data if available
        enriched = await Promise.all(
          customerVehicles.map(async (v, index) => {
            const live = filteredDevices?.find(
              (d) => (d.device_data?.imei || d.imei) === v.imei
            );
            return {
              ...v,
              customer: v.company || v.imei || "",
              vehicle: v.vehicle_name || v.imei || "",
              reg: v.subscription_number || "",
              landmark:
                live?.lat && live?.lng
                  ? await mockReverseGeocode(live.lat, live.lng)
                  : "",
              deviceStatus: live
                ? live.online === "online"
                  ? "Online"
                  : "Offline"
                : "Unknown",
              speed: live?.speed ?? "-",
              time: live?.time ?? "-",
              lat: live?.lat ?? v.lat,
              lng: live?.lng ?? v.lng,
            };
          })
        );
      } else {
        // Show only filteredDevices (with live status)
        if (!filteredDevices) return;
        enriched = await Promise.all(
          filteredDevices.map(async (v) => {
            const match = customerVehicles.find(
              (cv) => String(cv.imei) === String(v.imei)
            );
            return {
              ...v,
              customer: match?.company || v.imei || "",
              vehicle: match?.vehicle_name || v.imei || "",
              reg: match?.reg_no || "",
              landmark:
                v.lat && v.lng ? await mockReverseGeocode(v.lat, v.lng) : "",
            };
          })
        );
      }
      setEnrichedDevices(enriched);
    };
    enrich();
  }, [filteredDevices, customerVehicles, activeTab]);

  useEffect(() => {
    if (!isReloading) return;
    if (reloadTimer === 0) {
      if (filteredDevices) {
        const enrich = async () => {
          const enriched = await Promise.all(
            filteredDevices.map(async (v) => ({
              ...v,
              landmark:
                v.lat && v.lng ? await mockReverseGeocode(v.lat, v.lng) : "",
            }))
          );
          setEnrichedDevices(enriched);
        };
        enrich();
      }
      return;
    }
    const t = setTimeout(() => setReloadTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [isReloading, reloadTimer, filteredDevices]);

  useEffect(() => {
    if (isReloading && reloadTimer === 0) {
      setTimeout(() => {
        setReloadTimer(60);
        setIsReloading(false);
      }, 0);
    }
  }, [isReloading, reloadTimer]);

  const handleReload = () => {
    if (isReloading) return;
    setIsReloading(true);
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
            <table className="min-w-225 w-full text-sm">
              <thead className="bg-orange-50 text-gray-600">
                <tr className="border-b border-gray-200">
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Vehicle</th>
                  <th className="p-4 text-left">Nearby Landmark</th>
                  <th className="p-4 text-left">Speed</th>
                  <th className="p-4 text-left">Date | Time</th>
                  <th className="p-4 text-left">Device</th>
                  <th
                    className={`
                      p-4 border-l border-gray-200
                      lg:sticky lg:right-0 lg:bg-orange-50 lg:z-20
                    `}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((v) => {
                  const speedMeta = getSpeedMeta(v.speed);
                  return (
                    <tr
                      key={v.id}
                      className="border-b border-gray-200 last:border-0"
                    >
                      <td className="p-4 text-nowrap">{v.customer}</td>
                      <td className="p-4">
                        <div className="font-medium">{v.vehicle}</div>
                        <div className="text-xs text-gray-400">{v.reg}</div>
                      </td>
                      <td className="p-4">
                        <p>{v.landmark}</p>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-500 hover:text-orange-500"
                        >
                          {v.lat}, {v.lng}
                        </a>
                      </td>
                      {/* SPEED */}
                      <td className="p-4 text-nowrap">
                        <div className="flex flex-col items-center gap-1">
                          <img
                            src={speedMeta.icon}
                            className="w-8 h-8"
                            alt="speed"
                          />
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${speedMeta.bg} ${speedMeta.text}`}
                          >
                            {v.speed} km/h
                          </span>
                        </div>
                      </td>
                      <td className="p-4">{v.time}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs w-fit
                            ${
                              v.deviceStatus === "Online"
                                ? "bg-green-100 text-green-700"
                                : v.deviceStatus === "Offline"
                                ? "bg-gray-200 text-gray-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {v.deviceStatus}
                          </span>
                          <span className="text-xs text-gray-400">
                            Expire: {v.time}
                          </span>
                        </div>
                      </td>
                      <td
                        className="
                          p-4 border-l border-gray-200
                          lg:sticky lg:right-0 lg:bg-white lg:z-10
                        "
                      >
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
