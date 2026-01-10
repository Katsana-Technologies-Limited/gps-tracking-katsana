import { useMemo } from "react";
import useDataQuery from "./useDataQuery";
import useCustomerVehicle from "./useCustomerVehicle";

const useVtsAllDevices = () => {
  /* ---------------- Devices from VTS ---------------- */

  const {
    data: allDevicesData,
    isLoading: isLoadingDevices,
    error: errorDevices,
    refetch: refetchDevices,
  } = useDataQuery(["vts-all-devices"], "/api/vts/devices-proxy");

  /* ---------------- Customer Vehicles ---------------- */

  const {
    data: customerVehicles,
    isLoading: isLoadingVehicles,
    error: errorVehicles,
    refetch: refetchVehicles,
  } = useCustomerVehicle();

  /* ---------------- Safe customer vehicles ---------------- */

  const safeCustomerVehicles = useMemo(() => {
    // Add comprehensive type checking
    if (!customerVehicles) return [];
    if (Array.isArray(customerVehicles)) return customerVehicles;

    // If it's an object with a data property
    if (customerVehicles && typeof customerVehicles === "object") {
      if (Array.isArray(customerVehicles.data)) return customerVehicles.data;
      if (Array.isArray(customerVehicles.items)) return customerVehicles.items;
      if (Array.isArray(customerVehicles.vehicles))
        return customerVehicles.vehicles;
    }

    console.warn("customerVehicles is not an array:", customerVehicles);
    return [];
  }, [customerVehicles]);

  /* ---------------- Normalize Devices Data ---------------- */

  const safeAllDevicesData = useMemo(() => {
    return Array.isArray(allDevicesData) ? allDevicesData : [];
  }, [allDevicesData]);

  /* ---------------- Flatten All Devices ---------------- */

  const allDevices = useMemo(() => {
    const result = [];

    for (const group of safeAllDevicesData) {
      if (Array.isArray(group?.items)) {
        for (const item of group.items) {
          result.push(item);
        }
      }
    }

    return result;
  }, [safeAllDevicesData]);

  /* ---------------- Customer IMEI List ---------------- */

  const customerImeis = useMemo(() => {
    // Use the safe version
    return safeCustomerVehicles.map((v) => v?.imei).filter(Boolean);
  }, [safeCustomerVehicles]);

  /* ---------------- Filter Devices by Customer IMEI ---------------- */

  const filteredDevices = useMemo(() => {
    if (!allDevices.length || !customerImeis.length) return [];

    const imeiSet = new Set(customerImeis);

    return allDevices.filter((device) => {
      const imei = device?.device_data?.imei ?? device?.imei ?? null;

      return imei && imeiSet.has(imei);
    });
  }, [allDevices, customerImeis]);

  /* ---------------- Final Return ---------------- */

  return {
    isLoading: isLoadingDevices || isLoadingVehicles,
    error: errorDevices || errorVehicles,

    allDevices,
    customerVehicles: safeCustomerVehicles, // Use the safe version
    filteredDevices,

    refetch: () => {
      refetchDevices();
      refetchVehicles();
    },
  };
};

export default useVtsAllDevices;
