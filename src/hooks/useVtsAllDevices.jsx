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

  // ---------------- Normalize Devices ----------------
  const safeAllDevicesData = useMemo(() => {
    if (!Array.isArray(allDevicesData)) return [];
    // Only keep groups that have an 'items' array
    return allDevicesData.filter((group) => Array.isArray(group.items));
  }, [allDevicesData]);

  // ---------------- Flatten Devices ----------------
  const allDevices = useMemo(() => {
    const result = [];
    for (const group of safeAllDevicesData) {
      if (Array.isArray(group.items)) {
        result.push(...group.items);
      }
    }
    console.log("DEBUG allDevices:", result);
    return result;
  }, [safeAllDevicesData]);

  // ---------------- Customer IMEIs ----------------
  const customerImeis = useMemo(() => {
    if (!Array.isArray(customerVehicles)) return [];
    const imeis = customerVehicles.map((v) => v?.imei).filter(Boolean);
    console.log("DEBUG customerImeis:", imeis);
    return imeis;
  }, [customerVehicles]);

  // ---------------- Filter by IMEI ----------------
  const filteredDevices = useMemo(() => {
    if (!allDevices.length || !customerImeis.length) return [];
    const imeiSet = new Set(customerImeis);
    const filtered = allDevices.filter((device) => {
      const imei = device?.device_data?.imei ?? device?.imei ?? null;
      return imei && imeiSet.has(imei);
    });
    console.log("DEBUG filteredDevices:", filtered);
    return filtered;
  }, [allDevices, customerImeis]);

  // ---------------- Return ----------------
  return {
    isLoading: isLoadingDevices || isLoadingVehicles,
    error: errorDevices || errorVehicles,
    allDevices,
    customerVehicles,
    filteredDevices,
    refetch: () => {
      refetchDevices();
      refetchVehicles();
    },
  };
};

export default useVtsAllDevices;
