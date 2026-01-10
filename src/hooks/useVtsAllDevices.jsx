import { useMemo } from "react";
import useDataQuery from "./useDataQuery";
import useCustomerVehicle from "./useCustomerVehicle";

const useVtsAllDevices = () => {
  // Fetch all VTS devices
  const {
    data: allDevicesData,
    isLoading: isLoadingDevices,
    error: errorDevices,
    refetch: refetchDevices,
  } = useDataQuery(["vts-all-devices"], "/api/vts/devices-proxy");

  // Fetch customer vehicles (with IMEIs)
  const {
    data: customerVehicles,
    isLoading: isLoadingVehicles,
    error: errorVehicles,
    refetch: refetchVehicles,
  } = useCustomerVehicle();

  // Flatten all devices from groups
  const allDevices = useMemo(() => {
    if (!allDevicesData) return [];
    return allDevicesData.flatMap((group) => group.items || []);
  }, [allDevicesData]);

  // Get all IMEIs from customer vehicles
  const customerImeis = useMemo(() => {
    if (!customerVehicles) return [];
    return customerVehicles.map((v) => v.imei);
  }, [customerVehicles]);

  // Filter devices by customer IMEIs (imei-wise)
  const filteredDevices = useMemo(() => {
    if (!allDevices.length || !customerImeis.length) return [];
    // Create a map for fast lookup
    const imeiSet = new Set(customerImeis);
    return allDevices.filter((device) => {
      const imei = device.device_data?.imei || device.imei;
      return imeiSet.has(imei);
    });
  }, [allDevices, customerImeis]);

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
