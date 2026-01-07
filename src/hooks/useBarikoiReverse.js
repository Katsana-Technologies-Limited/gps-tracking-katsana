import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BARIKOI_KEY = import.meta.env.VITE_BARIKOI_API_KEY;

function useBarikoiReverse(lat, lng, enabled = true) {
  const query = useQuery({
    queryKey: ["barikoi-reverse", lat, lng],
    queryFn: async () => {
      const res = await axios.get(
        `https://barikoi.xyz/v1/api/search/reverse/geocode/${BARIKOI_KEY}/place`,
        { params: { longitude: lng, latitude: lat } }
      );
      return res.data.place || res.data;
    },
    enabled: !!lat && !!lng && !!BARIKOI_KEY && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  return { address: query.data, loading: query.isLoading, error: query.error };
}

export default useBarikoiReverse;
