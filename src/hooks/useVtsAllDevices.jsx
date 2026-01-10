import { useMemo } from "react";
import useDataQuery from "./useDataQuery";
import useCustomerVehicle from "./useCustomerVehicle";

const VTS_DEVICES_URL =
  "http://194.135.92.189/api/get_devices?lang=en&user_api_hash=$2y$10$5ULdfBXQeFG9eA7vjGxy5eoHPnU8T9cMe49goEXkkAmjLfXLj0l0m";

const useVtsAllDevices = () => {
  // Fetch all VTS devices
  const {
    data: allDevicesData,
    isLoading: isLoadingDevices,
    error: errorDevices,
    refetch: refetchDevices,
  } = useDataQuery(["vts-all-devices"], VTS_DEVICES_URL);

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

  // Filter devices by customer IMEIs
  const filteredDevices = useMemo(() => {
    if (!allDevices.length || !customerImeis.length) return [];
    return allDevices.filter((device) => {
      // device_data.imei or device.device_data?.imei
      const imei = device.device_data?.imei || device.imei;
      return customerImeis.includes(imei);
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
