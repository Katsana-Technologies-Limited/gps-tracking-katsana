import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Switch } from "@headlessui/react";
import "leaflet/dist/leaflet.css";

// ---- Example Data ----
const travelledData = [
  { date: "Sun, 26 Dec", distance: 199, vehicles: 1 },
  { date: "Mon, 27 Dec", distance: 150, vehicles: 1 },
  { date: "Tue, 28 Dec", distance: 179, vehicles: 1 },
  { date: "Wed, 29 Dec", distance: 178, vehicles: 1 },
  { date: "Thu, 30 Dec", distance: 199, vehicles: 1 },
  { date: "Fri, 31 Dec", distance: 205, vehicles: 1 },
  { date: "Sat, 1 Jan", distance: 175, vehicles: 1 },
];

const vehiclesPie = [
  { name: "Online", value: 96, color: "#2ecc71" },
  { name: "Suspended", value: 1, color: "#fe3b56" },
  { name: "Offline", value: 3, color: "#fbbc04" },
];

const areaData = [
  { name: "Sat, 25 Dec", value: 2 },
  { name: "Sun, 26 Dec", value: 2 },
  { name: "Mon, 27 Dec", value: 4 },
  { name: "Tue, 28 Dec", value: 6 },
  { name: "Wed, 29 Dec", value: 9 },
  { name: "Thu, 30 Dec", value: 7 },
  { name: "Fri, 31 Dec", value: 5 },
];

const alertsTable = [
  { date: "Sat, 25 Dec", trips: 12, over: 0, out: 0 },
  { date: "Sun, 26 Dec", trips: 9, over: 0, out: 0 },
  { date: "Mon, 27 Dec", trips: 10, over: 0, out: 0 },
  { date: "Tue, 28 Dec", trips: 8, over: 0, out: 0 },
  { date: "Wed, 29 Dec", trips: 6, over: 0, out: 0 },
  { date: "Thu, 30 Dec", trips: 10, over: 0, out: 0 },
  { date: "Fri, 31 Dec", trips: 11, over: 0, out: 0 },
];

// ---- Card Wrapper ----
const Card = ({ children, className = "" }) => (
  <div
    className={
      "bg-white rounded-2xl shadow p-4 flex flex-col h-full " + className
    }
  >
    {children}
  </div>
);

// ---- Toggles ----
function Toggle({ enabled, setEnabled, label }) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${
          enabled ? "bg-[#fd9642]" : "bg-gray-200"
        } relative inline-flex h-6 w-11 items-center rounded-full transition`}
      >
        <span
          className={`${
            enabled ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform bg-white rounded-full transition`}
        />
      </Switch>
      <span className="text-gray-500 text-sm">{label}</span>
    </div>
  );
}

const AnalyticsSummary = () => {
  const [alertsOnly, setAlertsOnly] = useState(true);
  const [status, setStatus] = useState("All");

  return (
    <div className="rounded-xl">
      {/* 4-tile top grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
        {/* 1: Last 7 Days Distance Table */}
        <Card className="min-h-[240px]">
          <div className="flex items-center justify-between pb-2">
            <div className="font-semibold text-gray-600 text-base">
              Last 7 Days Traveled Distance
            </div>
            <Toggle enabled={alertsOnly} setEnabled={setAlertsOnly} label="" />
          </div>
          <table className="text-xs w-full">
            <thead>
              <tr className="text-gray-400">
                <th>Date</th>
                <th>Distance (KM)</th>
                <th>Vehicles</th>
              </tr>
            </thead>
            <tbody>
              {travelledData.map((row, i) => (
                <tr key={row.date} className={i % 2 ? "bg-gray-50/0" : ""}>
                  <td>{row.date}</td>
                  <td className="text-center">{row.distance}</td>
                  <td className="text-center">{row.vehicles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* 2: Vehicles Pie */}
        <Card className="items-center justify-center min-h-[240px]">
          <div className="font-semibold text-gray-600 text-base mb-2 text-center">
            Total Number of Vehicles
          </div>
          <div className="font-extrabold text-2xl text-center mb-1">1</div>
          <ResponsiveContainer width="100%" height={100}>
            <PieChart>
              <Pie
                data={vehiclesPie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={40}
                startAngle={90}
                endAngle={-270}
                label={false}
                stroke="none"
              >
                {vehiclesPie.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center pt-2 gap-3">
            {vehiclesPie.map((entry) => (
              <span
                key={entry.name}
                className="flex items-center text-xs font-medium gap-1"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: entry.color }}
                />
                {entry.name}
              </span>
            ))}
          </div>
        </Card>

        {/* 3: Vehicle Status Counts */}
        <Card className="min-h-[240px] justify-between">
          <div className="font-semibold text-base text-gray-600 mb-1">
            Status
          </div>
          {/* Status numbers header */}
          <div className="flex flex-wrap gap-2 pb-4">
            <span className="inline-block bg-[#f5f6fa] rounded-full px-3 py-1 text-xs mr-1 font-semibold text-gray-700">
              <span
                role="img"
                aria-label="online"
                className="mr-1 inline-block align-middle w-2 h-2 rounded-full bg-[#2ecc71]"
              />{" "}
              Online
            </span>
            <span className="inline-block bg-[#f5f6fa] rounded-full px-3 py-1 text-xs mr-1 font-semibold text-gray-700">
              <span
                role="img"
                aria-label="offline"
                className="mr-1 inline-block align-middle w-2 h-2 rounded-full bg-[#fbbc04]"
              />{" "}
              Offline
            </span>
            <span className="inline-block bg-[#f5f6fa] rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
              <span
                role="img"
                aria-label="suspended"
                className="mr-1 inline-block align-middle w-2 h-2 rounded-full bg-[#fe3b56]"
              />{" "}
              Suspended
            </span>
          </div>
          {/* Status select */}
          <div className="flex justify-between items-center gap-2 mb-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border bg-gray-50 text-xs rounded-md px-2 py-1"
            >
              <option>All</option>
              <option>Suspended</option>
              <option>Offline</option>
              <option>Online</option>
            </select>
          </div>
          {/* Status numbers */}
          <div className="flex gap-4 justify-around mt-4">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-[#2ecc71]">96</span>
              <span className="text-xs text-gray-400">Online</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-[#fbbc04]">3</span>
              <span className="text-xs text-gray-400">Offline</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-[#fe3b56]">1</span>
              <span className="text-xs text-gray-400">Suspended</span>
            </div>
          </div>
        </Card>

        {/* 4: Options card */}
        <Card className="min-h-[240px] justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-base text-gray-600">
              Options
            </span>
            <button className="px-2 py-1 bg-[#fd9642] text-xs rounded text-white font-semibold shadow">
              Save
            </button>
          </div>
          <div>
            <div className="pb-2">
              <label
                htmlFor="type"
                className="block text-xs mb-1 text-gray-500"
              >
                Type:
              </label>
              <select
                id="type"
                className="border bg-gray-50 w-full text-xs rounded-md px-2 py-1"
              >
                <option>Office</option>
                <option>Vehicle</option>
              </select>
            </div>
            <div className="pb-2">
              <label
                htmlFor="details"
                className="block text-xs mb-1 text-gray-500"
              >
                Details:
              </label>
              <input
                id="details"
                className="border bg-gray-50 w-full text-xs rounded-md px-2 py-1"
                placeholder="Search..."
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button className="flex-1 px-2 py-1 rounded-md border bg-white text-xs text-gray-700 shadow hover:bg-[#fd9642] hover:text-white transition">
                Office
              </button>
              <button className="flex-1 px-2 py-1 rounded-md border bg-white text-xs text-gray-700 shadow hover:bg-[#fd9642] hover:text-white transition">
                Online
              </button>
              <button className="flex-1 px-2 py-1 rounded-md border bg-white text-xs text-gray-700 shadow hover:bg-[#fd9642] hover:text-white transition">
                Suspended
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* MAP Section */}
      <div className="mb-5">
        <Card
          className="p-0 md:p-0"
          style={{ overflow: "hidden", height: 340 }}
        >
          <div className="w-full h-[340px] rounded-2xl overflow-hidden">
            <MapContainer
              center={[23.8103, 90.4125]}
              zoom={8}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
              dragging={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={[23.8103, 90.4125]} />
            </MapContainer>
          </div>
        </Card>
      </div>

      {/* 2-tile bottom grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Alerts Table */}
        <Card className="min-h-[230px]">
          <div className="font-semibold text-base text-gray-600 mb-1">
            Last 7 Days Alerts, Summary
          </div>
          <table className="text-xs w-full">
            <thead>
              <tr className="text-gray-400">
                <th>Date</th>
                <th>Trips</th>
                <th>Over Speed</th>
                <th>Forced Out</th>
              </tr>
            </thead>
            <tbody>
              {alertsTable.map((row) => (
                <tr key={row.date}>
                  <td>{row.date}</td>
                  <td className="text-center">{row.trips}</td>
                  <td className="text-center">{row.over}</td>
                  <td className="text-center">{row.out}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Chart for Alerts */}
        <Card className="min-h-[230px]">
          <div className="font-semibold text-base text-gray-600 mb-1">
            Last 7 Days Alerts, Summary
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorAlert" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fd9642" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#fd9642" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#fd9642"
                fill="url(#colorAlert)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsSummary;
