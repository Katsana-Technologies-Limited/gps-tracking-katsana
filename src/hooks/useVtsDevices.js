import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const VTS_URL = import.meta.env.VITE_VTS_TRACKIGN_URL || "";
const VTS_API_KEY = import.meta.env.VITE_VTS_TRACKIGN_API_KEY || "";

function useVtsDevices(imeis = []) {
  const enabled = imeis.length > 0 && !!VTS_URL && !!VTS_API_KEY;
  const query = useQuery({
    queryKey: ["vts-devices", ...imeis],
    queryFn: async () => {
      const results = await Promise.all(
        imeis.map(async (imei) => {
          const url = `${VTS_URL}/get_devices?lang=en&user_api_hash=${VTS_API_KEY}&imei=${imei}`;
          const res = await axios.get(url);
          return { imei, data: res.data };
        })
      );
      const mapped = {};
      results.forEach(({ imei, data }) => {
        mapped[imei] = data;
      });
      return mapped;
    },
    enabled,
    refetchInterval: 10000,
    staleTime: 5000,
  });
  return { data: query.data, loading: query.isLoading, error: query.error };
}

export default useVtsDevices;
