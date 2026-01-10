import { useEffect } from "react";
import { useAxios } from "./useAxios";
import { useQuery } from "@tanstack/react-query";

function useVtsDevices(imeis = []) {
  const axiosUrl = useAxios();
  const joinedImeis = Array.isArray(imeis) ? imeis.join(",") : "";

  useEffect(() => {
    if (!imeis.length) return;
    axiosUrl
      .post("/api/vts/set-imeis", { imeis }, { withCredentials: true })
      .catch(() => {});
  }, [axiosUrl, joinedImeis, imeis]);

  const query = useQuery({
    queryKey: ["vts-devices"],
    queryFn: async () => {
      const res = await axiosUrl.get("/api/vts/locations", {
        withCredentials: true,
      });
      return res.data;
    },
    refetchInterval: 10000,
    staleTime: 5000,
    enabled: !!imeis.length,
  });
  // Transform mapped data to return items array for each IMEI
  let itemsByImei = {};
  if (query.data?.mapped) {
    Object.entries(query.data.mapped).forEach(([imei, groups]) => {
      if (Array.isArray(groups)) {
        itemsByImei[imei] = groups.reduce((acc, group) => {
          if (Array.isArray(group.items)) {
            return acc.concat(group.items);
          }
          return acc;
        }, []);
      } else {
        itemsByImei[imei] = [];
      }
    });
  }
  return {
    data: itemsByImei,
    normalized: query.data?.normalized || [],
    loading: query.isLoading,
    error: query.error,
  };
}

export default useVtsDevices;
