import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BARIKOI_KEY = import.meta.env.VITE_BARIKOI_API_KEY;

export function formatBarikoiPlace(place) {
  // Try to build a name: [POI, area/city, (distance or lat/lng)]
  if (!place) return "";
  let main = place.address || place.name || "";
  if (!main && place.poi) main = place.poi;
  if (!main && place.road) main = place.road;
  // Add area/city if available and not duplicate
  let area = place.area && !main.includes(place.area) ? place.area : "";
  let city = place.city && !main.includes(place.city) ? place.city : "";

  // Compose distance if available
  let km = "";
  if (place.distance_in_km) {
    km = `(${parseFloat(place.distance_in_km).toFixed(3)}km)`;
  }
  if (!main && area) main = area;
  if (!main && city) main = city;
  if (!main) main = ""; // fallback to empty

  // Full format: Place, City (km) OR just fallback to lat/lng elsewhere
  let str = main;
  if (area && main) str += ", " + area;
  if (city && (main || area)) str += ", " + city;
  if (km && main) str += ` ${km}`;
  return str.trim();
}

export default function useBarikoiReverse(lat, lng, enabled = true) {
  const query = useQuery({
    queryKey: ["barikoi-reverse", lat, lng],
    queryFn: async () => {
      const res = await axios.get(
        `https://barikoi.xyz/v1/api/search/reverse/geocode/${BARIKOI_KEY}/place`,
        { params: { longitude: lng, latitude: lat } }
      );
      // Always prefer "place" if present
      return res.data.place || res.data;
    },
    enabled: !!lat && !!lng && !!BARIKOI_KEY && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  return { place: query.data, loading: query.isLoading, error: query.error };
}
