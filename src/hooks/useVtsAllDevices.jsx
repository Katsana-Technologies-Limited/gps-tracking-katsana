import { useMemo } from "react";
import useDataQuery from "./useDataQuery";
import useCustomerVehicle from "./useCustomerVehicle";

/**
 * Hook to fetch all VTS devices and filter by customer's vehicles
 * Fully defensive against API shape changes
 */
const useVtsAllDevices = () => {
  // ---------------- Devices from 3rd Party VTS API ----------------
  const {
    data: allDevicesData,
    isLoading: isLoadingDevices,
    error: errorDevices,
    refetch: refetchDevices,
  } = useDataQuery(["vts-all-devices"], "/api/vts/devices-proxy");

  // ---------------- Customer Vehicles ----------------
  const {
    data: customerVehicles,
    isLoading: isLoadingVehicles,
    error: errorVehicles,
    refetch: refetchVehicles,
  } = useCustomerVehicle();

  // ---------------- Safe Defaults ----------------
  const allDevicesDataSafe = Array.isArray(allDevicesData)
    ? allDevicesData
    : [];
  const customerVehiclesSafe = Array.isArray(customerVehicles)
    ? customerVehicles
    : [];

  // ---------------- Normalize Devices ----------------
  const safeAllDevicesData = useMemo(() => {
    return allDevicesDataSafe.filter((group) => Array.isArray(group.items));
  }, [allDevicesDataSafe]);

  // ---------------- Flatten Devices ----------------
  const allDevices = useMemo(() => {
    const result = [];
    for (const group of safeAllDevicesData) {
      if (Array.isArray(group.items)) result.push(...group.items);
    }
    console.log("DEBUG allDevices:", result);
    return result;
  }, [safeAllDevicesData]);

  // ---------------- Customer IMEIs ----------------
  const customerImeis = useMemo(() => {
    return customerVehiclesSafe.map((v) => v?.imei).filter(Boolean);
  }, [customerVehiclesSafe]);

  // ---------------- Filter by IMEI ----------------
  const filteredDevices = useMemo(() => {
    if (!allDevices.length || !customerImeis.length) return [];
    const imeiSet = new Set(customerImeis);
    return allDevices.filter((device) => {
      const imei = device?.device_data?.imei ?? device?.imei ?? null;
      return imei && imeiSet.has(imei);
    });
  }, [allDevices, customerImeis]);

  // ---------------- Return ----------------
  return {
    isLoading: isLoadingDevices || isLoadingVehicles,
    error: errorDevices || errorVehicles,
    allDevices,
    customerVehicles: customerVehiclesSafe,
    filteredDevices,
    refetch: () => {
      refetchDevices();
      refetchVehicles();
    },
  };
};

export default useVtsAllDevices;
