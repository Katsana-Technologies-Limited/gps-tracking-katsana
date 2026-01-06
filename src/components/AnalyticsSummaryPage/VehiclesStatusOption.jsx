import React, { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import GlobalLoading from "../utils/GlobalLoading";
import useCustomerVehicle from "../../hooks/useCustomerVehicle";

const TABS = ["All", "Offline", "Online", "Suspended"];

const statusStyle = {
  Online: {
    border: "border-green-400",
    bg: "bg-green-50",
  },
  Offline: {
    border: "border-gray-200",
    bg: "bg-white",
  },
  Suspended: {
    border: "border-red-400",
    bg: "bg-red-50",
  },
};

const VehiclesStatusOption = ({ divhight = 80 }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const { data: vehiclesData, isLoading } = useCustomerVehicle();

  console.log(vehiclesData);
  // const VEHICLES = (vehiclesData || []).map((v) => ({
  //   id: v.id || 1,
  //   number: v.vehicle_name || "-",
  //   reg: v.subscription_number || "-",
  //   status: "Online",
  //   imei: v.imei,
  // }));

  const rawVehicles = Array.isArray(vehiclesData)
    ? vehiclesData
    : vehiclesData?.data || vehiclesData?.vehicles || [];

  const VEHICLES = rawVehicles.map((v, index) => ({
    id: v.id ?? index + 1,
    number: v.vehicle_name || "-",
    reg: v.subscription_number || "-",
    status: v.status || "Online",
    imei: v.imei,
  }));

  const filteredVehicles = useMemo(() => {
    let list =
      activeTab === "All"
        ? VEHICLES
        : VEHICLES.filter((v) => v.status === activeTab);

    if (query) {
      list = list.filter(
        (v) =>
          v.number.toLowerCase().includes(query.toLowerCase()) ||
          v.reg.toLowerCase().includes(query.toLowerCase())
      );
    }
    return list;
  }, [activeTab, query, VEHICLES]);

  const toggleVehicle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selected.length === filteredVehicles.length) {
      setSelected([]);
    } else {
      setSelected(filteredVehicles.map((v) => v.id));
    }
  };

  if (isLoading) {
    return <GlobalLoading message="Loading vehicles..." />;
  }

  return (
    <div className={`h-full max-h-[${divhight}px] flex flex-col gap-3 p-2`}>
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 cursor-pointer text-xs rounded-lg font-medium transition
              ${
                activeTab === tab
                  ? "bg-linear-to-r from-orange-400 to-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">
          <img
            src="/icons/vehicle-car-svgrepo-com.png"
            alt="vehicle-car-svgrepo-com"
          />
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Vehicle"
          className="w-full pl-9 pr-9 py-2 text-sm rounded-xl border border-gray-400 focus:border-none bg-white focus:outline-none focus:ring-1 focus:ring-orange-400"
        />
        <Search
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={
              selected.length === filteredVehicles.length &&
              filteredVehicles.length > 0
            }
            onChange={toggleAll}
            className="cursor-pointer"
          />
          Select All
        </label>
        <span>Total Vehicles: {selected.length}</span>
      </div>
      <div className="text-xs text-gray-500">Group</div>
      <div className="flex flex-col gap-2 max-h-125 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {filteredVehicles.map((v) => {
          const isSelected = selected.includes(v.id);
          const style = statusStyle[v.status];

          return (
            <div
              key={v.id}
              onClick={() => toggleVehicle(v.id)}
              className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition ${
                style.bg
              } ${isSelected ? style.border : "border-gray-200"}
        `}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                  <img src="/icons/vehicle.svg" alt="vehicle" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    {v.number}
                  </div>
                  <div className="text-xs text-gray-500">{v.reg}</div>
                </div>
              </div>
              {isSelected && <Check className="text-green-500" size={18} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VehiclesStatusOption;
