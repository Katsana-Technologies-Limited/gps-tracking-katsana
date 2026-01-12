import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setSelectedImeis } from "../../slices/vehiclesSlice";
import { Check, Search } from "lucide-react";
import useCustomerVehicle from "../../hooks/useCustomerVehicle";
import useVtsAllDevices from "../../hooks/useVtsAllDevices";
import LottieLoading from "../utils/LottieLoading";

const TABS = ["All", "Offline", "Online", "Suspended"];

const statusStyle = {
  Online: { border: "border-green-400", bg: "bg-green-50" },
  Offline: { border: "border-gray-200", bg: "bg-white" },
  Suspended: { border: "border-red-400", bg: "bg-red-50" },
};

const VehiclesStatusOption = ({ divhight = 80 }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("All");
  const [query, setQuery] = useState("");
  const { allDevices } = useVtsAllDevices();

  // const { data: customerVehicles = [], isLoading: isLoadingVehicles } =
  //   useCustomerVehicle();
  // const { allDevices } = useVtsAllDevices();

  // // Merge DB vehicles and VTS devices for status
  // const VEHICLES = useMemo(() => {
  //   return customerVehicles.map((v, index) => {
  //     const live = Array.isArray(allDevices)
  //       ? allDevices.find((d) => (d.device_data?.imei || d.imei) === v.imei)
  //       : null;
  //     let status = "Unknown";
  //     if (v.suspended) status = "Suspended";
  //     else if (live) status = live.online === "online" ? "Online" : "Offline";
  //     return {
  //       id: v.id ?? live?.device_data?.id ?? live?.id ?? index + 1,
  //       number:
  //         v.vehicle_name ||
  //         v.subscription_number ||
  //         v.imei ||
  //         live?.device_data?.name ||
  //         live?.name ||
  //         "-",
  //       reg:
  //         v.subscription_number ||
  //         live?.device_data?.subscription_number ||
  //         "-",
  //       status,
  //       imei: v.imei,
  //       company: v.company,
  //       vts: live || null,
  //     };
  //   });
  // }, [customerVehicles, allDevices]);

  const { data: customerVehicles, isLoading: isLoadingVehicles } =
    useCustomerVehicle();

  const customerVehiclesSafe = useMemo(() => {
    return Array.isArray(customerVehicles) ? customerVehicles : [];
  }, [customerVehicles]);

  const VEHICLES = useMemo(() => {
    return customerVehiclesSafe.map((v, index) => {
      const live = Array.isArray(allDevices)
        ? allDevices.find((d) => (d.device_data?.imei || d.imei) === v.imei)
        : null;

      let status = "Unknown";
      if (v.suspended) status = "Suspended";
      else if (live) status = live.online === "online" ? "Online" : "Offline";

      return {
        id: v.id ?? live?.device_data?.id ?? live?.id ?? index + 1,
        number:
          v.vehicle_name ||
          v.subscription_number ||
          v.imei ||
          live?.device_data?.name ||
          live?.name ||
          "-",
        reg:
          v.subscription_number ||
          live?.device_data?.subscription_number ||
          "-",
        status,
        imei: v.imei,
        company: v.company,
        vts: live || null,
      };
    });
  }, [customerVehiclesSafe, allDevices]);

  // Tab and query filtering
  const filteredVehicles = useMemo(() => {
    let list = VEHICLES;
    if (activeTab === "Online")
      list = list.filter((v) => v.status === "Online");
    else if (activeTab === "Offline")
      list = list.filter((v) => v.status === "Offline");
    else if (activeTab === "Suspended")
      list = list.filter((v) => v.status === "Suspended");
    if (query) {
      list = list.filter(
        (v) =>
          (v.number || "").toLowerCase().includes(query.toLowerCase()) ||
          (v.reg || "").toLowerCase().includes(query.toLowerCase())
      );
    }
    return list;
  }, [VEHICLES, activeTab, query]);

  // Only select all on first render, never in effect
  const [selected, setSelected] = useState(() => {
    const ids = filteredVehicles.map((v) => v.id);
    // Dispatch initial selection to Redux
    if (ids.length > 0) {
      const selectedImeis = VEHICLES.filter((v) => ids.includes(v.id)).map(
        (v) => v.imei
      );
      dispatch(setSelectedImeis(selectedImeis));
    }
    return ids;
  });

  const toggleVehicle = (id) => {
    setSelected((prev) => {
      const newSelected = prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id];
      // After updating selection, dispatch selected IMEIs
      const selectedImeis = VEHICLES.filter((v) =>
        newSelected.includes(v.id)
      ).map((v) => v.imei);
      dispatch(setSelectedImeis(selectedImeis));
      return newSelected;
    });
  };

  const toggleAll = () => {
    let newSelected;
    if (selected.length === filteredVehicles.length) {
      newSelected = [];
    } else {
      newSelected = filteredVehicles.map((v) => v.id);
    }
    setSelected(newSelected);
    // After updating selection, dispatch selected IMEIs
    const selectedImeis = VEHICLES.filter((v) =>
      newSelected.includes(v.id)
    ).map((v) => v.imei);
    dispatch(setSelectedImeis(selectedImeis));
  };

  if (isLoadingVehicles) return <LottieLoading />;

  return (
    <div className={`h-full max-h-[${divhight}px] flex flex-col gap-3 p-3`}>
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 cursor-pointer text-xs rounded-lg font-medium transition ${
              activeTab === tab
                ? "bg-linear-to-r from-orange-400 to-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">
          <img src="/icons/vehicle-car-svgrepo-com.png" alt="vehicle-car" />
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Vehicle"
          className="w-full pl-9 pr-9 py-2 text-sm rounded-xl border border-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-orange-400"
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
          const style = statusStyle[v.status] || {
            border: "border-gray-200",
            bg: "bg-white",
          };

          return (
            <div
              key={v.id}
              onClick={() => toggleVehicle(v.id)}
              className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition ${
                style.bg
              } ${isSelected ? style.border : "border-gray-200"}`}
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
