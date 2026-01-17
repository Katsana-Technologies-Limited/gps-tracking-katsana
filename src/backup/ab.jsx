// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useRef, useState, useMemo, useEffect } from "react";
// import { Map, Marker } from "react-bkoi-gl";
// import maplibregl from "maplibre-gl";
// import "react-bkoi-gl/styles";
// import {
//   Scan,
//   Plus,
//   Minus,
//   ChevronLeft,
//   ChevronRight,
//   ChevronUp,
//   ChevronDown,
// } from "lucide-react";

// import useCustomerVehicle from "../../hooks/useCustomerVehicle";
// import useVtsAllDevices from "../../hooks/useVtsAllDevices";
// import { VehicleMarker } from "../Vehicles/VehicleMarker";
// import VehicleInfoCard from "../Vehicles/VehicleInfoCard";
// import { getVehicleWaveColor } from "../Vehicles/statusConfig";
// import VehicleStatusLegend from "../Vehicles/VehicleStatusLegend";

// const BARIKOI_KEY = import.meta.env.VITE_BARIKOI_API_KEY;
// const MAP_STYLE = `https://map.barikoi.com/styles/osm-liberty/style.json?key=${BARIKOI_KEY}`;
// const SATELLITE_STYLE = `https://map.barikoi.com/styles/barikoi_satellite/style.json?key=${BARIKOI_KEY}`;

// const MemoMap = React.memo(Map);

// const VehiclesCurrentLocationMap = () => {
//   const mapRef = useRef(null);
//   const wrapperRef = useRef(null);

//   // 🔥 animation refs (NO STATE)
//   const lastPos = useRef(null);
//   const nextPos = useRef(null);
//   const startTime = useRef(null);
//   const routeCoords = useRef([]);
//   const rafId = useRef(null);

//   const [satellite, setSatellite] = useState(false);
//   const [controlsOpen, setControlsOpen] = useState(false);
//   const [mode, setMode] = useState("CLUSTER"); // CLUSTER | SINGLE
//   const [selectedVehicleId, setSelectedVehicleId] = useState(null);

//   const { data: vehiclesData } = useCustomerVehicle();
//   const { filteredDevices } = useVtsAllDevices();

//   /* ---------------- ONLINE VEHICLES ---------------- */
//   const onlineVehicles = useMemo(() => {
//     if (!filteredDevices?.length) return [];
//     return filteredDevices.filter(
//       (d) => d.online === "online" && Number(d.lat) && Number(d.lng)
//     );
//   }, [filteredDevices]);

//   /* ---------------- SELECTED VEHICLE ---------------- */
//   const selectedVehicle = useMemo(() => {
//     if (!selectedVehicleId) return null;
//     const v = vehiclesData?.find((v) => v.imei === selectedVehicleId);
//     const d = filteredDevices?.find(
//       (d) => (d.device_data?.imei ?? d.imei) === selectedVehicleId
//     );
//     return v || d ? { ...v, ...d } : null;
//   }, [selectedVehicleId, vehiclesData, filteredDevices]);

//   /* ---------------- MAP LOAD ---------------- */
//   const onMapLoad = async (e) => {
//     const map = e.target;

//     // icon
//     const img = await map.loadImage(
//       "https://cdn-icons-png.flaticon.com/512/7893/7893979.png"
//     );
//     map.addImage("vehicle-icon", img.data, { pixelRatio: 2 });

//     // selected vehicle
//     map.addSource("vehicle", {
//       type: "geojson",
//       data: {
//         type: "Feature",
//         geometry: { type: "Point", coordinates: [0, 0] },
//       },
//     });
//     map.addLayer({
//       id: "vehicle-layer",
//       type: "symbol",
//       source: "vehicle",
//       layout: {
//         "icon-image": "vehicle-icon",
//         "icon-size": 0.45,
//         "icon-allow-overlap": true,
//       },
//     });

//     // route
//     map.addSource("route", {
//       type: "geojson",
//       data: {
//         type: "Feature",
//         geometry: { type: "LineString", coordinates: [] },
//       },
//     });
//     map.addLayer({
//       id: "route-layer",
//       type: "line",
//       source: "route",
//       paint: { "line-color": "#ef4444", "line-width": 4 },
//     });

//     // zoom logic
//     map.on("zoomend", () => {
//       setMode(map.getZoom() < 10 ? "CLUSTER" : "SINGLE");
//     });

//     startAnimation(map);
//   };

//   /* ---------------- INIT SELECTED VEHICLE ---------------- */
//   useEffect(() => {
//     if (!selectedVehicle || !mapRef.current) return;
//     const map = mapRef.current.getMap();

//     const lng = Number(selectedVehicle.lng);
//     const lat = Number(selectedVehicle.lat);

//     lastPos.current = [lng, lat];
//     nextPos.current = [lng, lat];
//     startTime.current = null;

//     routeCoords.current = selectedVehicle.tail?.length
//       ? selectedVehicle.tail.map((t) => [Number(t.lng), Number(t.lat)])
//       : [[lng, lat]];

//     map.getSource("vehicle")?.setData({
//       type: "Feature",
//       geometry: { type: "Point", coordinates: [lng, lat] },
//     });

//     map.getSource("route")?.setData({
//       type: "Feature",
//       geometry: { type: "LineString", coordinates: routeCoords.current },
//     });

//     map.flyTo({ center: [lng, lat], zoom: 15 });
//   }, [selectedVehicleId]);

//   /* ---------------- GPS UPDATE ---------------- */
//   useEffect(() => {
//     if (!selectedVehicle) return;

//     const lng = Number(selectedVehicle.lng);
//     const lat = Number(selectedVehicle.lat);

//     if (
//       nextPos.current &&
//       nextPos.current[0] === lng &&
//       nextPos.current[1] === lat
//     )
//       return;

//     lastPos.current = nextPos.current;
//     nextPos.current = [lng, lat];
//     startTime.current = Date.now();
//   }, [selectedVehicle?.lat, selectedVehicle?.lng]);

//   /* ---------------- ANIMATION LOOP ---------------- */
//   const startAnimation = (map) => {
//     const DURATION = 5000;

//     const animate = () => {
//       if (!startTime.current) {
//         rafId.current = requestAnimationFrame(animate);
//         return;
//       }

//       const t = Math.min((Date.now() - startTime.current) / DURATION, 1);

//       const lng =
//         lastPos.current[0] + (nextPos.current[0] - lastPos.current[0]) * t;
//       const lat =
//         lastPos.current[1] + (nextPos.current[1] - lastPos.current[1]) * t;

//       const pos = [lng, lat];

//       map.getSource("vehicle")?.setData({
//         type: "Feature",
//         geometry: { type: "Point", coordinates: pos },
//       });

//       routeCoords.current.push(pos);
//       map.getSource("route")?.setData({
//         type: "Feature",
//         geometry: { type: "LineString", coordinates: routeCoords.current },
//       });

//       map.easeTo({ center: pos, duration: 0 });

//       if (t === 1) startTime.current = null;

//       rafId.current = requestAnimationFrame(animate);
//     };

//     animate();
//   };

//   useEffect(() => () => cancelAnimationFrame(rafId.current), []);

//   /* ---------------- RENDER ---------------- */
//   return (
//     <div
//       ref={wrapperRef}
//       className="relative w-full h-160 rounded-2xl overflow-hidden bg-white"
//     >
//       <MemoMap
//         ref={mapRef}
//         onLoad={onMapLoad}
//         mapStyle={satellite ? SATELLITE_STYLE : MAP_STYLE}
//         initialViewState={{ longitude: 90.3563, latitude: 23.685, zoom: 6 }}
//         attributionControl={false}
//       >
//         {/* CLUSTER */}
//         {mode === "CLUSTER" && onlineVehicles[0] && (
//           <Marker
//             longitude={onlineVehicles[0].lng}
//             latitude={onlineVehicles[0].lat}
//           >
//             <VehicleMarker count={onlineVehicles.length} />
//           </Marker>
//         )}

//         {/* STATIC VEHICLES */}
//         {mode === "SINGLE" &&
//           onlineVehicles.map((v) => {
//             const id = v.device_data?.imei ?? v.id;
//             if (id === selectedVehicleId) return null;

//             const waveColor = getVehicleWaveColor(v);
//             const img = vehiclesData?.find((x) => x.imei === id);

//             return (
//               <Marker
//                 key={id}
//                 longitude={v.lng}
//                 latitude={v.lat}
//                 anchor="bottom"
//               >
//                 <div
//                   onClick={() => setSelectedVehicleId(id)}
//                   className="cursor-pointer relative"
//                 >
//                   <div
//                     className="car-status-circle"
//                     style={{ backgroundColor: waveColor }}
//                   />
//                   <img
//                     src={
//                       img?.vehicle_type_image
//                         ? `${import.meta.env.VITE_API_URL}${
//                             img.vehicle_type_image
//                           }`
//                         : "/car-icon.svg"
//                     }
//                     className="w-10 h-10 z-10"
//                   />
//                 </div>
//               </Marker>
//             );
//           })}
//       </MemoMap>

//       <VehicleStatusLegend />

//       {/* Fullscreen */}
//       <button
//         onClick={() => {
//           const el = wrapperRef.current;
//           !document.fullscreenElement
//             ? el.requestFullscreen()
//             : document.exitFullscreen();
//         }}
//         className="absolute top-3 right-3 z-20 bg-white p-2 rounded-full shadow"
//       >
//         <Scan />
//       </button>
//     </div>
//   );
// };

// export default VehiclesCurrentLocationMap;
