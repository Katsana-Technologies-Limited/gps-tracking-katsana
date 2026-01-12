import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BARIKOI_KEY = import.meta.env.VITE_BARIKOI_API_KEY;

export default function useBarikoiReverse(lat, lng, enabled = true) {
  const query = useQuery({
    queryKey: ["barikoi-nearby", lat, lng],
    queryFn: async () => {
      const res = await axios.get(
        "https://barikoi.xyz/v2/api/search/nearby/0.5/1",
        {
          params: {
            api_key: BARIKOI_KEY,
            longitude: "91.8245",
            latitude: "22.3565",
          },
          // params: {
          //   api_key: BARIKOI_KEY,
          //   longitude: lng,
          //   latitude: lat,
          // },
        }
      );
      // check and try working or not
      // api_key: BARIKOI_KEY,
      // longitude: "91.8245",
      // latitude: "22.3565",
      return res.data?.places?.[0] || null;
    },
    enabled: !!lat && !!lng && lat !== "-" && lng !== "-" && enabled,
    staleTime: 5 * 60 * 1000,
  });

  return {
    place: query.data,
    loading: query.isLoading,
    error: query.error,
  };
}
