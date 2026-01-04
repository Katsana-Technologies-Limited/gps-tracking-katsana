import React, { useEffect, useMemo, useState } from "react";
import { MapPin, Route, Clock, BarChart3, Power } from "lucide-react";
import VehiclesStatusOption from "../AnalyticsSummaryPage/VehiclesStatusOption";
import { speedColor, mockReverseGeocode } from "../../utilits/vehicleHelpers";

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
];

export default function VehiclesDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);

  const [reloadTimer, setReloadTimer] = useState(60);
  const [isReloading, setIsReloading] = useState(false);

  // 🔄 Initial load
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

  // 🔁 Reload countdown
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

  // 🔍 Filter
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
      {/* 🔝 Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-700">Vehicles List</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setIsReloading(true)}
            className="px-4 py-2 rounded-lg bg-gray-200 text-sm"
          >
            Reload {isReloading && `(${reloadTimer})`}
          </button>
          <button className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm">
            Export
          </button>
        </div>
      </div>

      {/* 🔲 Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* 📋 TABLE */}
        <div className="xl:col-span-3 bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-orange-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Customer</th>
                <th>Vehicle</th>
                <th>Nearby Landmark</th>
                <th>Speed</th>
                <th>Date | Time</th>
                <th>Device</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((v) => (
                <tr key={v.id} className="border-b">
                  <td className="p-3">{v.customer}</td>
                  <td>
                    <div className="font-medium">{v.vehicle}</div>
                    <div className="text-xs text-gray-400">{v.reg}</div>
                  </td>
                  <td>{v.landmark}</td>
                  <td className={speedColor(v.speed)}>{v.speed} km/h</td>
                  <td>{v.time}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        v.deviceStatus === "Online"
                          ? "bg-green-100 text-green-700"
                          : v.deviceStatus === "Offline"
                          ? "bg-gray-200 text-gray-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {v.deviceStatus}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2 text-gray-500">
                      <MapPin size={16} />
                      <Clock size={16} />
                      <BarChart3 size={16} />
                      <Power size={16} />
                      <Route size={16} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
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

        {/* 👉 RIGHT SIDE (Reusable) */}
        <div className="bg-white rounded-xl shadow-sm">
          <VehiclesStatusOption
            onTabChange={setActiveTab}
            onSelectChange={setSelectedIds}
          />
        </div>
      </div>
    </div>
  );
}
