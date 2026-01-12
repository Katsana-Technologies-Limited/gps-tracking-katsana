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

export function formatBarikoiPlace(place) {
  // Defensive: try a variety of fields
  if (!place) return "";

  // Pick the best available top label
  let main =
    place.address ||
    place.poi ||
    place.name ||
    place.road ||
    place.area ||
    place.sub_area ||
    "";

  // Compose area/city as suffix if distinct
  let area = place.area && main && !main.includes(place.area) ? place.area : "";
  let city = place.city && main && !main.includes(place.city) ? place.city : "";

  // Compose distance if available and numeric
  let km = "";
  let rawDistance =
    place.distance_in_km ||
    place.distance ||
    (typeof place.dist === "number" ? String(place.dist) : "");
  if (rawDistance && !isNaN(rawDistance)) {
    const parsed = parseFloat(rawDistance);
    if (!isNaN(parsed)) km = `(${parsed.toFixed(3)}km)`;
  }

  // Fallback: if nothing meaningful, try area only or city only
  if (!main && area) main = area;
  if (!main && city) main = city;

  // If _still_ nothing, return empty for fallback outside
  if (!main) return "";

  // Compose full string
  let out = main;
  if (area && area !== main) out += ", " + area;
  if (city && city !== main && city !== area) out += ", " + city;
  if (km) out += ` ${km}`;
  return out.trim();
}

export default function useBarikoiReverse(lat, lng, enabled = true) {
  const query = useQuery({
    queryKey: ["barikoi-reverse", lat, lng],
    queryFn: async () => {
      const res = await axios.get(
        `https://barikoi.xyz/v1/api/search/reverse/geocode/${BARIKOI_KEY}/place`,
        { params: { longitude: lng, latitude: lat } }
      );
      // prefer `place`, but sometimes returns array or different shape
      return Array.isArray(res.data.place)
        ? res.data.place[0]
        : res.data.place || res.data;
    },
    enabled: !!lat && !!lng && !!BARIKOI_KEY && enabled,
    staleTime: 5 * 60 * 1000,
  });
  return { place: query.data, loading: query.isLoading, error: query.error };
}
