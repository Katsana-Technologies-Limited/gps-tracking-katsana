import { useMemo, useEffect } from "react";
import useDataQuery from "./useDataQuery";
import useCustomerVehicle from "./useCustomerVehicle";

const useVtsAllDevices = () => {
  const {
    data: allDevicesData,
    isLoading: isLoadingDevices,
    error: errorDevices,
    refetch: refetchDevices,
  } = useDataQuery(["vts-all-devices"], "/api/vts/devices-proxy");

  const {
    data: customerVehicles,
    isLoading: isLoadingVehicles,
    error: errorVehicles,
    refetch: refetchVehicles,
  } = useCustomerVehicle();

  const customerVehiclesSafe = useMemo(() => {
    return Array.isArray(customerVehicles) ? customerVehicles : [];
  }, [customerVehicles]);

  const allDevices = useMemo(() => {
    if (!Array.isArray(allDevicesData)) return [];
    return allDevicesData.reduce((acc, group) => {
      if (Array.isArray(group.items)) {
        acc.push(...group.items);
      }
      return acc;
    }, []);
  }, [allDevicesData]);

  const customerImeis = useMemo(() => {
    return customerVehiclesSafe
      .filter((v) => v?.suspended === false)
      .map((v) => v?.imei)
      .filter(Boolean);
  }, [customerVehiclesSafe]);

  const filteredDevices = useMemo(() => {
    if (!allDevices.length || !customerImeis.length) return [];
    const imeiSet = new Set(customerImeis);
    return allDevices.filter((device) => {
      const imei = device?.device_data?.imei ?? device?.imei ?? null;
      return imei && imeiSet.has(imei);
    });
  }, [allDevices, customerImeis]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetchDevices();
    }, 10000);
    return () => clearInterval(interval);
  }, [refetchDevices]);

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
