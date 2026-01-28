import { useMemo, useEffect } from "react";
import useDataQuery from "./useDataQuery";
import useSelectedImeis from "./useSelectedImeis";

const useVtsAllDevices = () => {
  const {
    data: allSubsData,
    isLoading: isLoadingDevices,
    error: errorDevices,
    refetch: refetchDevices,
  } = useDataQuery(
    ["vts-all-devices"],
    "/api/vts/customer/subscriptions",
    true,
    {
      refetchInterval: 10000,
      refetchIntervalInBackground: true,
      staleTime: 0,
    },
  );

  const allDevices = useMemo(() => {
    if (!Array.isArray(allSubsData)) return [];
    return allSubsData
      .map((sub) => sub.vts_device)
      .filter((d) => d && typeof d === "object");
  }, [allSubsData]);

  const selectedImeisRaw = useSelectedImeis();
  const selectedImeis = useMemo(
    () => selectedImeisRaw || [],
    [selectedImeisRaw],
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
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refetchDevices]);

  return {
    isLoading: isLoadingDevices,
    error: errorDevices,
    allDevices,
    filteredDevices,
    refetch: refetchDevices,
  };
};

export default useVtsAllDevices;
