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
const Card = ({ children }) => (
  <div className="bg-white rounded-2xl shadow-sm p-4 h-full min-h-32.5 flex flex-col">
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

// ---- Main Page ----
const DashboardHomePage = () => {
  const [alertsOnly, setAlertsOnly] = useState(true);
  const [status, setStatus] = useState("All");

  return (
    <div className="rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Card 1: Last 7 Days Distance Table */}
        <Card>
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

        {/* Card 2: Vehicles Pie */}
        <Card>
          <div className="font-semibold text-gray-600 text-base mb-2">
            Total Number of Vehicles
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={vehiclesPie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={50}
                startAngle={90}
                endAngle={-270}
                label={false}
              >
                {vehiclesPie.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-between pt-2 gap-1">
            {vehiclesPie.map((entry) => (
              <span
                key={entry.name}
                className="flex items-center text-xs md:text-sm font-medium gap-1"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: entry.color }}
                />
                {entry.name}
              </span>
            ))}
          </div>
        </Card>

        {/* Card 3: Stats/Status */}
        <Card>
          <div className="flex justify-between items-center mb-1">
            <div className="font-semibold text-base text-gray-600">Status</div>
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
          <div className="mb-2 text-gray-500 text-xs flex gap-2">
            <span className="flex gap-1 items-center">
              <span className="w-2 h-2 bg-[#2ecc71] rounded-full" /> Online
            </span>
            <span className="flex gap-1 items-center">
              <span className="w-2 h-2 bg-[#fbbc04] rounded-full" /> Offline
            </span>
            <span className="flex gap-1 items-center">
              <span className="w-2 h-2 bg-[#fe3b56] rounded-full" /> Suspended
            </span>
          </div>
          <div className="flex gap-2 pt-2 justify-between">
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-[#2ecc71]">96</span>
              <span className="text-xs text-gray-400">Online</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-[#fbbc04]">3</span>
              <span className="text-xs text-gray-400">Offline</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-[#fe3b56]">1</span>
              <span className="text-xs text-gray-400">Suspended</span>
            </div>
          </div>
        </Card>

        {/* Card 4: Dropdown UI */}
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-base text-gray-600">
              Options
            </span>
            <button className="px-2 py-1 bg-[#fd9642] text-xs rounded text-white font-semibold shadow">
              Save
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <div>
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
            <div>
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
          </div>
        </Card>
      </div>

      {/* MAP Section */}
      <div className="mb-4">
        <Card>
          <div className="w-full h-67.5 rounded-lg overflow-hidden">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Alerts Table */}
        <Card>
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
        <Card>
          <div className="font-semibold text-base text-gray-600 mb-1">
            Last 7 Days Alerts, Summary
          </div>
          <ResponsiveContainer width="100%" height={120}>
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

export default DashboardHomePage;
