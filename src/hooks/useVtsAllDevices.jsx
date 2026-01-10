import { useMemo } from "react";
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

  const allDevices = useMemo(() => {
    if (!allDevicesData) return [];
    return allDevicesData?.flatMap((group) => group.items || []);
  }, [allDevicesData]);

  const customerImeis = useMemo(() => {
    if (!customerVehicles) return [];
    return customerVehicles.map((v) => v.imei);
  }, [customerVehicles]);

  const filteredDevices = useMemo(() => {
    if (!allDevices.length || !customerImeis.length) return [];
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
