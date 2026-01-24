/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedImeis,
  setSelectedLastImei,
} from "../../slices/vehiclesSlice";
import { Check, Search } from "lucide-react";
import LottieLoading from "../utils/LottieLoading";
import useCustomerVehicle from "../../hooks/useCustomerVehicle";
import useVtsAllDevices from "../../hooks/useVtsAllDevices";

const TABS = ["All", "Offline", "Online", "Suspended"];

const statusStyle = {
  Online: { border: "border-green-400", bg: "bg-white" },
  Offline: { border: "border-gray-200", bg: "bg-white" },
  Suspended: { border: "border-red-400", bg: "bg-white" },
};

const VehiclesStatusOption = ({ onStatsChange }) => {
  const dispatch = useDispatch();
  const selectedLastImei = useSelector(
    (state) => state.vehicles.selectedLastImei,
  );
  const [activeTab, setActiveTab] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  const { data: customerVehicles = [], isLoading } = useCustomerVehicle();
  const { allDevices } = useVtsAllDevices();

  const VEHICLES = useMemo(() => {
    return customerVehicles.map((v, index) => {
      const live = Array.isArray(allDevices)
        ? allDevices.find((d) => (d.device_data?.imei || d.imei) === v.imei)
        : null;

      let status = "Unknown";
      if (v.suspended) status = "Suspended";
      else if (live)
        status =
          live.online === "online" || live.online === "ack"
            ? "Online"
            : "Offline";

      return {
        id: v.id ?? live?.id ?? index + 1,
        number: v.vehicle_name || v.subscription_number || v.imei || "-",
        reg: v.subscription_number || "-",
        status,
        imei: v.imei,
        vehicle_type_image: v.vehicle_type_image || null,
      };
    });
  }, [customerVehicles, allDevices]);

  const filteredVehicles = useMemo(() => {
    let list = VEHICLES;

    if (activeTab !== "All") {
      list = list.filter((v) => v.status === activeTab);
    }

    if (query) {
      list = list.filter(
        (v) =>
          v.number.toLowerCase().includes(query.toLowerCase()) ||
          v.reg.toLowerCase().includes(query.toLowerCase()),
      );
    }

    return list;
  }, [VEHICLES, activeTab, query]);

  useEffect(() => {
    if (!hasInitialized && filteredVehicles.length > 0) {
      setSelected([filteredVehicles[0].id]);
      dispatch(setSelectedLastImei(filteredVehicles[0].imei));
      setHasInitialized(true);
    }
  }, [filteredVehicles, hasInitialized, dispatch]);

  useEffect(() => {
    const imeis = filteredVehicles
      .filter((v) => selected.includes(v.id))
      .map((v) => v.imei)
      .filter(Boolean);

    dispatch(setSelectedImeis(imeis));
  }, [filteredVehicles, selected, dispatch]);

  useEffect(() => {
    const selectedImeis = filteredVehicles
      .filter((v) => selected.includes(v.id))
      .map((v) => v.imei)
      .filter(Boolean);

    if (selectedLastImei && !selectedImeis.includes(selectedLastImei)) {
      const lastSelected =
        selectedImeis.length > 0
          ? selectedImeis[selectedImeis.length - 1]
          : null;
      dispatch(setSelectedLastImei(lastSelected));
    }
  }, [selected, filteredVehicles, selectedLastImei, dispatch]);

  useEffect(() => {
    if (typeof onStatsChange === "function") {
      onStatsChange({
        selectedCount: selected.length,
        totalCount: filteredVehicles.length,
      });
    }
  }, [selected.length, filteredVehicles.length]);

  const toggleVehicle = (id, imei) => {
    setSelected((prev) => {
      const next = prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id];

      const nextImeis = next
        .map((selId) => filteredVehicles.find((v) => v.id === selId))
        .filter(Boolean)
        .map((v) => v.imei)
        .filter(Boolean);

      if (next.includes(id)) {
        if (imei) dispatch(setSelectedLastImei(imei));
      } else {
        if (nextImeis.length > 0) {
          dispatch(setSelectedLastImei(nextImeis[nextImeis.length - 1]));
        } else {
          dispatch(setSelectedLastImei(null));
        }
      }

      return next;
    });
  };

  const toggleAll = () => {
    if (selected.length === filteredVehicles.length) {
      setSelected([]);
      dispatch(setSelectedLastImei(null));
    } else {
      const allIds = filteredVehicles.map((v) => v.id);
      setSelected(allIds);
      const lastImei = filteredVehicles.length
        ? filteredVehicles[filteredVehicles.length - 1].imei
        : null;
      dispatch(setSelectedLastImei(lastImei));
    }
  };

  if (isLoading) return <LottieLoading />;

  return (
    <div className="h-full flex flex-col gap-3 p-3">
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
              onClick={() => toggleVehicle(v.id, v.imei)}
              className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition ${
                style.bg
              } ${isSelected ? style.border : "border-gray-200"}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${
                      v?.vehicle_type_image
                    }`}
                    alt="vehicle"
                    className="max-w-full max-h-full object-contain"
                  />
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
