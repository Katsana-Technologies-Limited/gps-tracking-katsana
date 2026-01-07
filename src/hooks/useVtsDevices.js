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
      const normalized = [];
      results.forEach(({ imei, data }) => {
        mapped[imei] = data;
        // Flatten and normalize for table
        if (Array.isArray(data)) {
          data.forEach((group) => {
            if (Array.isArray(group.items)) {
              group.items.forEach((item) => {
                normalized.push({
                  imei,
                  customer: item.device_data?.users?.[0]?.email || "",
                  vehicle: item.device_data?.name || item.name || "",
                  registration: item.device_data?.registration_number || "",
                  landmark: item.address || "",
                  lat: item.lat,
                  lng: item.lng,
                  speed: item.speed,
                  dateTime: item.time,
                  deviceStatus: item.online,
                  expire: item.device_data?.expiration_date || "",
                  icon: item.icon,
                  groupTitle: group.title,
                  // Add more fields as needed
                  raw: item,
                });
              });
            }
          });
        }
      });
      return { mapped, normalized };
    },
    enabled,
    refetchInterval: 10000,
    staleTime: 5000,
  });
  return {
    data: query.data?.mapped,
    normalized: query.data?.normalized || [],
    loading: query.isLoading,
    error: query.error,
  };
}

export default useVtsDevices;
