import { useEffect, useRef, useState } from "react";

const barikoiAPiKey = import.meta.env.VITE_BARIKOI_API_KEY;
const VEHICLE_ICON_URL =
  "https://cdn-icons-png.flaticon.com/512/7893/7893979.png";

/**
 * LiveVehicleMarkers
 * Props:
 *   - map: Barikoi map instance (window.bkoigl.Map)
 */
const LiveVehicleMarkers = ({ map }) => {
  const [vehicleLocations, setVehicleLocations] = useState([]); // [{imei, lat, lng, ...}]
  const markersRef = useRef([]);

  // Fetch vehicle locations from backend every 10s
  useEffect(() => {
    let interval;
    const fetchLocations = async () => {
      try {
        const res = await fetch("/api/vts/locations");
        const data = await res.json();
        setVehicleLocations(
          Object.entries(data).map(([imei, v]) => ({ imei, ...v }))
        );
      } catch (e) {}
    };
    fetchLocations();
    interval = setInterval(fetchLocations, 10000);
    return () => clearInterval(interval);
  }, []);

  // Add/update vehicle markers
  useEffect(() => {
    if (!map || !map.isStyleLoaded?.()) return;
    // Remove old markers
    markersRef.current.forEach((m) => m.remove && m.remove());
    const newMarkers = [];
    vehicleLocations.forEach((v) => {
      if (v.lat && v.lng) {
        const el = document.createElement("div");
        el.style.width = "32px";
        el.style.height = "32px";
        el.style.background = `url(${VEHICLE_ICON_URL}) no-repeat center/contain`;
        el.title = v.imei;
        // Optional: fetch address from Bari Koi
        fetch(
          `https://barikoi.xyz/v2/api/search/reverse/geocode/${barikoiAPiKey}/place?latitude=${v.lat}&longitude=${v.lng}`
        )
          .then((res) => res.json())
          .then((addr) => {
            el.title = `${v.imei} - ${addr?.place?.address || "Unknown"}`;
          });
        const marker = new window.bkoigl.Marker(el)
          .setLngLat([parseFloat(v.lng), parseFloat(v.lat)])
          .addTo(map);
        newMarkers.push(marker);
      }
    });
    markersRef.current = newMarkers;
    // Optionally, fit map to bounds
    if (vehicleLocations.length > 0) {
      const bounds = new window.bkoigl.LngLatBounds();
      vehicleLocations.forEach((v) => {
        if (v.lat && v.lng)
          bounds.extend([parseFloat(v.lng), parseFloat(v.lat)]);
      });
      if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 80 });
    }
    // eslint-disable-next-line
  }, [vehicleLocations, map]);

  return null; // This component only manages markers
};

export default LiveVehicleMarkers;
