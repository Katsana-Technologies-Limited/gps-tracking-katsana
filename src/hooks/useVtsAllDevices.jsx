import { useMemo, useEffect } from "react";
import useDataQuery from "./useDataQuery";
import useCustomerVehicle from "./useCustomerVehicle";
import useSelectedImeis from "./useSelectedImeis";

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

  // Get all devices
  const allDevices = useMemo(() => {
    if (!Array.isArray(allDevicesData)) return [];
    return allDevicesData.reduce((acc, group) => {
      if (Array.isArray(group.items)) {
        acc.push(...group.items);
      }
      return acc;
    }, []);
  }, [allDevicesData]);

  const selectedImeisRaw = useSelectedImeis();
  const selectedImeis = useMemo(
    () => selectedImeisRaw || [],
    [selectedImeisRaw]
  );

  const filteredDevices = useMemo(() => {
    if (!allDevices.length || !selectedImeis.length) return [];
    const imeiSet = new Set(selectedImeis);
    return allDevices.filter((device) => {
      const imei = device?.device_data?.imei ?? device?.imei ?? null;
      return imei && imeiSet.has(imei);
    });
  }, [allDevices, selectedImeis]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refetchDevices();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Refetch every 10 seconds
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        refetchDevices();
      }
    }, 10000); // 10 seconds

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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
    /**
     * Get a device by IMEI from filteredDevices
     * @param {string} imei
     * @returns {object|null}
     */
    getDeviceByImei: (imei) => {
      if (!imei) return null;
      return (
        filteredDevices.find((device) => {
          const deviceImei = device?.device_data?.imei ?? device?.imei ?? null;
          return deviceImei === imei;
        }) || null
      );
    },
  };
};

export default useVtsAllDevices;
