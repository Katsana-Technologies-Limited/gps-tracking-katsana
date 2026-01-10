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
    if (!Array.isArray(customerVehicles)) return [];

    return customerVehicles.map((v) => v?.imei).filter(Boolean);
  }, [customerVehicles]);

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
    customerVehicles,
    filteredDevices,

    refetch: () => {
      refetchDevices();
      refetchVehicles();
    },
  };
};

export default useVtsAllDevices;
