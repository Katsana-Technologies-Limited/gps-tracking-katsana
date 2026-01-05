import React, { useEffect, useMemo, useState } from "react";
import VehiclesStatusOption from "../AnalyticsSummaryPage/VehiclesStatusOption";
import { getSpeedMeta, mockReverseGeocode } from "../../utilits/vehicleHelpers";
import { RotateCw } from "lucide-react";
import VehicleStatusDrawer from "./VehicleStatusDrawer";

const PAGE_SIZE = 5;

const MOCK_DATA = [
  {
    id: 1,
    customer: "Sajjat Hossen",
    vehicle: "TMV 42555",
    reg: "DM GA 45-8256",
    lat: 23.7508,
    lng: 90.389,
    speed: 16,
    deviceStatus: "Online",
    time: "2025-12-24 03:41:06",
  },
  {
    id: 2,
    customer: "Sajjat Hossen",
    vehicle: "YMA 3546",
    reg: "DM GA 45-8256",
    lat: 23.7108,
    lng: 90.899,
    speed: 96,
    deviceStatus: "Online",
    time: "2025-12-19 10:41:06",
  },
  {
    id: 3,
    customer: "Sajjat Hossen",
    vehicle: "MT-15",
    reg: "DM GA 45-8256",
    lat: 23.8908,
    lng: 90.559,
    speed: 66,
    deviceStatus: "Offline",
    time: "2025-12-10 04:41:06",
  },
  {
    id: 3,
    customer: "Sajjat Hossen",
    vehicle: "MT-15",
    reg: "DM GA 45-8256",
    lat: 23.8908,
    lng: 90.559,
    speed: 66,
    deviceStatus: "Offline",
    time: "2025-12-10 04:41:06",
  },
  {
    id: 3,
    customer: "Sajjat Hossen",
    vehicle: "MT-15",
    reg: "DM GA 45-8256",
    lat: 23.8908,
    lng: 90.559,
    speed: 66,
    deviceStatus: "Offline",
    time: "2025-12-10 04:41:06",
  },
  {
    id: 3,
    customer: "Sajjat Hossen",
    vehicle: "MT-15",
    reg: "DM GA 45-8256",
    lat: 23.8908,
    lng: 90.559,
    speed: 66,
    deviceStatus: "Offline",
    time: "2025-12-10 04:41:06",
  },
  {
    id: 3,
    customer: "Sajjat Hossen",
    vehicle: "MT-15",
    reg: "DM GA 45-8256",
    lat: 23.8908,
    lng: 90.559,
    speed: 66,
    deviceStatus: "Offline",
    time: "2025-12-10 04:41:06",
  },
  {
    id: 3,
    customer: "Sajjat Hossen",
    vehicle: "MT-15",
    reg: "DM GA 45-8256",
    lat: 23.8908,
    lng: 90.559,
    speed: 66,
    deviceStatus: "Offline",
    time: "2025-12-10 04:41:06",
  },
  {
    id: 3,
    customer: "Sajjat Hossen",
    vehicle: "MT-15",
    reg: "DM GA 45-8256",
    lat: 23.8908,
    lng: 90.559,
    speed: 66,
    deviceStatus: "Offline",
    time: "2025-12-10 04:41:06",
  },
  {
    id: 3,
    customer: "Sajjat Hossen",
    vehicle: "MT-15",
    reg: "DM GA 45-8256",
    lat: 23.8908,
    lng: 90.559,
    speed: 66,
    deviceStatus: "Offline",
    time: "2025-12-10 04:41:06",
  },
];

export default function VehiclesDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);

  const [reloadTimer, setReloadTimer] = useState(60);
  const [isReloading, setIsReloading] = useState(false);

  // 🔄 Initial Load
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const enriched = await Promise.all(
      MOCK_DATA.map(async (v) => ({
        ...v,
        landmark: await mockReverseGeocode(v.lat, v.lng),
      }))
    );
    setVehicles(enriched);
  };

  // 🔁 Reload countdown (LOCKED)
  useEffect(() => {
    if (!isReloading) return;

    if (reloadTimer === 0) {
      setReloadTimer(60);
      setIsReloading(false);
      loadData();
      return;
    }

    const t = setTimeout(() => setReloadTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [isReloading, reloadTimer]);

  const handleReload = () => {
    if (isReloading) return;
    setIsReloading(true);
  };

  // 🔍 Filter logic
  const filtered = useMemo(() => {
    let list =
      activeTab === "All"
        ? vehicles
        : vehicles.filter((v) => v.deviceStatus === activeTab);

    if (selectedIds.length > 0) {
      list = list.filter((v) => selectedIds.includes(v.id));
    }
    return list;
  }, [vehicles, activeTab, selectedIds]);

  // 📄 Pagination
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-4 space-y-4">
      {/* 🔝 TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-700">Vehicles List</h1>

        <div className="flex gap-2">
          <button
            onClick={handleReload}
            disabled={isReloading}
            className={`px-4 py-2 rounded-lg text-md font-bold flex items-center gap-2
              ${
                isReloading ? "bg-gray-300 cursor-not-allowed" : "bg-[#B0C1CF]"
              }`}
          >
            {/* <img
              src="/icons/vehicel/reload.svg"
              className={`w-5 h-5 ml-auto ${isReloading ? "animate-spin" : ""}`}
              alt="reload"
            /> */}
            <RotateCw
              className={`w-5 h-5 ml-auto ${isReloading ? "animate-spin" : ""}`}
            />
            Reload {isReloading && `(${reloadTimer}s)`}
          </button>

          <button className="px-4 py-2 rounded-lg bg-linear-to-r from-orange-400 to-orange-500 text-white font-bold flex gap-2">
            <img src="/icons/vehicel/export.svg" alt="export" />
            Export
          </button>
        </div>
      </div>

      {/* 🔲 MAIN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
        <div className="xl:col-span-5">
          {/* 📋 TABLE */}
          <div className=" bg-white rounded-xl shadow-sm relative overflow-x-auto">
            <table className="min-w-225 w-full text-sm">
              <thead className="bg-orange-50 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Customer</th>
                  <th>Vehicle</th>
                  <th>Nearby Landmark</th>
                  <th>Speed</th>
                  <th>Date | Time</th>
                  <th>Device</th>
                  <th className="sticky right-0 bg-orange-50 z-20 px-3">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginated.map((v) => {
                  const speedMeta = getSpeedMeta(v.speed);

                  return (
                    <tr key={v.id} className="border-b">
                      <td className="p-3 text-nowrap">{v.customer}</td>

                      <td>
                        <div className="font-medium">{v.vehicle}</div>
                        <div className="text-xs text-gray-400">{v.reg}</div>
                      </td>

                      <td>
                        <p>{v.landmark}</p>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lng}`}
                          target="_blank"
                          className="text-xs text-gray-500 hover:text-orange-500"
                        >
                          {v.lat}, {v.lng}
                        </a>
                      </td>

                      {/* SPEED */}
                      <td className="text-nowrap flex flex-col items-center gap-1 pr-1">
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
                      </td>

                      <td>{v.time}</td>

                      <td className="flex flex-col gap-2">
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
                      </td>

                      {/* ACTIONS (STICKY) */}
                      <td className="sticky right-0 bg-white z-10">
                        <div className="flex gap-3 px-3">
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
          <div className="flex justify-end gap-2 p-3">
            {Array.from({
              length: Math.ceil(filtered.length / PAGE_SIZE),
            }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1 ? "bg-orange-500 text-white" : "bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* 👉 RIGHT SIDE */}
        {/* <div className="xl:col-span-2 bg-white rounded-xl shadow-sm max-h-screen">
          <VehiclesStatusOption
            onTabChange={setActiveTab}
            onSelectChange={setSelectedIds}
          />
        </div> */}

        {/* 👉 RIGHT SIDE */}
        <div className="xl:col-span-2">
          {/* Desktop */}
          <div className="hidden xl:block bg-white rounded-xl shadow-sm h-[calc(100vh-140px)]">
            <VehiclesStatusOption />
          </div>

          {/* Mobile / Tablet */}
          <div className="xl:hidden">
            <VehicleStatusDrawer />
          </div>
        </div>
      </div>
    </div>
  );
}
