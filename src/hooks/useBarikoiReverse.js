// Fetch nearby landmarks from Barikoi v2 API
export function useBarikoiNearby(
  lat,
  lng,
  enabled = true,
  radius = 0.5,
  limit = 10
) {
  const apiKey = BARIKOI_KEY;
  const query = useQuery({
    queryKey: ["barikoi-nearby", lat, lng, radius, limit],
    queryFn: async () => {
      const url = `https://barikoi.xyz/v2/api/search/nearby/${radius}/${limit}`;
      const res = await axios.get(url, {
        params: {
          api_key: apiKey,
          longitude: lng,
          latitude: lat,
        },
      });
      return res.data.places || [];
    },
    enabled: !!lat && !!lng && !!apiKey && enabled,
    staleTime: 5 * 60 * 1000,
  });
  return { places: query.data, loading: query.isLoading, error: query.error };
}
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BARIKOI_KEY = import.meta.env.VITE_BARIKOI_API_KEY;

export default function useBarikoiReverse(lat, lng, enabled = true) {
  const query = useQuery({
    queryKey: ["barikoi-nearby-v2", lat, lng],
    queryFn: async () => {
      const res = await axios.get(
        `https://barikoi.xyz/v2/api/search/nearby/0.5/1`,
        {
          params: {
            api_key: BARIKOI_KEY,
            longitude: lng,
            latitude: lat,
          },
        }
      );
      return Array.isArray(res.data.places) && res.data.places.length > 0
        ? res.data.places[0]
        : null;
    },
    enabled: !!lat && !!lng && !!BARIKOI_KEY && enabled,
    staleTime: 5 * 60 * 1000,
  });
  return { place: query.data, loading: query.isLoading, error: query.error };
}
