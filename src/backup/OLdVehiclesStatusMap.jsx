// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useRef, useState, useMemo, useEffect } from "react";
// import { Map, Marker } from "react-bkoi-gl";
// import maplibregl from "maplibre-gl";
// // import bkoigl from "bkoi-gl";
// import "bkoi-gl/dist/style/bkoi-gl.css";
// import "react-bkoi-gl/styles";
// import {
//   Share2,
//   Printer,
//   Scan,
//   ChevronLeft,
//   ChevronRight,
//   ChevronUp,
//   ChevronDown,
//   Plus,
//   Minus,
// } from "lucide-react";
// import jsPDF from "jspdf";
// import useCustomerVehicle from "../../hooks/useCustomerVehicle";
// import { VehicleMarker } from "../Vehicles/VehicleMarker";
// import useVtsAllDevices from "../../hooks/useVtsAllDevices";
// import VehicleInfoCard from "../Vehicles/VehicleInfoCard";
// import { getVehicleWaveColor } from "../Vehicles/statusConfig";
// import VehicleStatusLegend from "../Vehicles/VehicleStatusLegend";

// const BARIKOI_KEY = import.meta.env.VITE_BARIKOI_API_KEY;

// /* ✅ USE STABLE STYLE ONLY */
// const MAP_STYLE = `https://map.barikoi.com/styles/osm-liberty/style.json?key=${BARIKOI_KEY}`;
// const SATELLITE_STYLE = `https://map.barikoi.com/styles/barikoi_satellite/style.json?key=${BARIKOI_KEY}`;

// const MemoMap = React.memo(Map);

// const VehiclesCurrentLocationMap = () => {
//   const mapRef = useRef(null);
//   const wrapperRef = useRef(null);

//   // 🔥 Smooth animation refs
//   const lastPos = useRef([0, 0]);
//   const nextPos = useRef([0, 0]);
//   const startTime = useRef(null);
//   const routeCoords = useRef([]);
//   const animationFrameId = useRef(null);

//   // constant varaible
//   const initialViewState = {
//     longitude: 90.3563,
//     latitude: 23.685,
//     zoom: 6,
//     bearing: 0,
//     pitch: 0,
//   };
//   //   state
//   const [satellite, setSatellite] = useState(false);
//   const [controlsOpen, setControlsOpen] = useState(false);
//   const [coords, setCoords] = useState("Initializing…");

//   const { data: vehiclesData } = useCustomerVehicle();

//   const [mode, setMode] = useState("INIT");

//   // INIT | CLUSTER | SINGLE | VEHICLE
//   const [selectedVehicleId, setSelectedVehicleId] = useState(null);
//   const { filteredDevices } = useVtsAllDevices();
//   console.log(filteredDevices);

//   // online device check
//   const onlineDevices = useMemo(() => {
//     if (!filteredDevices?.length) return [];

//     return filteredDevices.filter(
//       (d) =>
//         d.online === "online" &&
//         d.lat &&
//         d.lng &&
//         Number(d.lat) !== 0 &&
//         Number(d.lng) !== 0
//     );
//   }, [filteredDevices]);

//   //   online device length
//   const onlineCount = onlineDevices.length;

//   //   fly to vehicle
//   const flyToVehicle = (v) => {
//     mapRef.current?.flyTo({
//       center: [v.lng, v.lat],
//       zoom: 15,
//       speed: 1.2,
//       curve: 1.4,
//     });
//   };
//   // fit to all vehicles check
//   const fitToAllVehicles = (devices) => {
//     if (!devices.length || !mapRef.current) return;

//     const map = mapRef.current.getMap();
//     const bounds = devices.reduce(
//       (b, d) => b.extend([d.lng, d.lat]),
//       new maplibregl.LngLatBounds(
//         [devices[0].lng, devices[0].lat],
//         [devices[0].lng, devices[0].lat]
//       )
//     );

//     map.fitBounds(bounds, {
//       padding: 80,
//       duration: 600,
//     });
//   };

//   //   check the online vehicel mode
//   useEffect(() => {
//     if (onlineCount > 1 && mode !== "CLUSTER") setMode("CLUSTER");
//   }, [onlineCount]);

//   //   user selected vehicleInfo and deviceInfo
//   const selectedVehicleFUll = useMemo(() => {
//     if (!selectedVehicleId) return null;
//     const vehicleInfo = vehiclesData?.find((v) => v.imei === selectedVehicleId);
//     const deviceInfo = filteredDevices?.find(
//       (d) => (d.device_data?.imei ?? d.imei) === selectedVehicleId
//     );
//     if (!vehicleInfo && !deviceInfo) return null;
//     return {
//       ...vehicleInfo,
//       ...deviceInfo,
//     };
//   }, [vehiclesData, filteredDevices, selectedVehicleId]);

//   /* =====================================================
//      MAP LOAD → ADD VEHICLE + ROUTE
//      ===================================================== */
//   useEffect(() => {
//     if (!mapRef.current) return;
//     const map = mapRef.current.getMap();

//     map.on("load", async () => {
//       const img = await map.loadImage(
//         "https://cdn-icons-png.flaticon.com/512/7893/7893979.png"
//       );
//       map.addImage("vehicle-icon", img.data, { pixelRatio: 2 });
//       map.addSource("vehicle", {
//         type: "geojson",
//         data: {
//           type: "Feature",
//           geometry: { type: "Point", coordinates: [0, 0] },
//         },
//       });
//       map.addLayer({
//         id: "vehicle-layer",
//         type: "symbol",
//         source: "vehicle",
//         layout: {
//           "icon-image": "vehicle-icon",
//           "icon-size": 0.4,
//           "icon-allow-overlap": true,
//         },
//       });
//       map.addSource("route", {
//         type: "geojson",
//         data: {
//           type: "Feature",
//           geometry: { type: "LineString", coordinates: [] },
//         },
//       });
//       map.addLayer({
//         id: "route-layer",
//         type: "line",
//         source: "route",
//         paint: {
//           "line-color": "#ef4444",
//           "line-width": 4,
//         },
//       });
//     });
//   }, []);

//   const onMapLoad = (e) => {
//     const map = e.target; // map instance

//     // রুট সোর্স
//     if (!map.getSource("route")) {
//       map.addSource("route", {
//         type: "geojson",
//         data: {
//           type: "Feature",
//           geometry: { type: "LineString", coordinates: [] },
//         },
//       });
//       map.addLayer({
//         id: "route-layer",
//         type: "line",
//         source: "route",
//         paint: { "line-color": "#ef4444", "line-width": 4 },
//       });
//     }

//     // এনিমেশন শুরু
//     startAnimationLoop();
//   };

//   /* =====================================================
//      GPS UPDATE (API DATA → NEXT POSITION)
//      ===================================================== */

//   useEffect(() => {
//     if (!selectedVehicleFUll?.lat || !selectedVehicleFUll?.lng) return;

//     const lng = Number(selectedVehicleFUll.lng);
//     const lat = Number(selectedVehicleFUll.lat);

//     // প্রথমবার ডাটা সেট করা
//     if (lastPos.current[0] === 0) {
//       lastPos.current = [lng, lat];
//       nextPos.current = [lng, lat];
//       routeCoords.current = [[lng, lat]];
//       return;
//     }

//     // পজিশন পরিবর্তন হলে এনিমেশন স্টার্ট করা
//     if (nextPos.current[0] !== lng || nextPos.current[1] !== lat) {
//       lastPos.current = [...nextPos.current];
//       nextPos.current = [lng, lat];
//       startTime.current = Date.now();

//       // রুট ট্রেইল আপডেট (নতুন স্টপ যোগ করা)
//       routeCoords.current.push([lng, lat]);
//       const map = mapRef.current?.getMap();
//       if (map && map.getSource("route")) {
//         map.getSource("route").setData({
//           type: "Feature",
//           geometry: { type: "LineString", coordinates: routeCoords.current },
//         });
//       }
//     }
//   }, [selectedVehicleFUll?.lat, selectedVehicleFUll?.lng]);

//   /* =====================================================
//      SMOOTH ANIMATION LOOP 
//      ===================================================== */
//   const startAnimationLoop = () => {
//     const DURATION = 5000; // আপনার API ডাটা আসার ইন্টারভল

//     const animate = () => {
//       if (startTime.current && mapRef.current) {
//         const now = Date.now();
//         const progress = Math.min((now - startTime.current) / DURATION, 1);

//         const lng =
//           lastPos.current[0] +
//           (nextPos.current[0] - lastPos.current[0]) * progress;
//         const lat =
//           lastPos.current[1] +
//           (nextPos.current[1] - lastPos.current[1]) * progress;

//         // বর্তমান এনিমেটেড পজিশনটি ম্যাপে রিফ্লেক্ট করানো
//         // নোট: আপনি যদি Marker ব্যবহার করেন, তবে একটি State আপডেট করতে হবে।
//         // আর যদি Source ব্যবহার করেন তবে সরাসরি setData করবেন।
//         setAnimatedCoords([lng, lat]);
//       }
//       animationFrameId.current = requestAnimationFrame(animate);
//     };
//     animate();
//   };

//   // এনিমেশনের জন্য আলাদা স্টেট (যাতে আইকন নড়ে)
//   const [animatedCoords, setAnimatedCoords] = useState([0, 0]);

//   useEffect(() => {
//     return () => cancelAnimationFrame(animationFrameId.current);
//   }, []);

//   /* ---------------- Actions ---------------- */
//   const zoomIn = () => mapRef.current?.zoomIn();
//   const zoomOut = () => mapRef.current?.zoomOut();

//   //   hadle share
//   const handleShare = () => {
//     navigator.clipboard.writeText(window.location.href);
//     alert("Map link copied");
//   };

//   //  handel print
//   const handlePrint = async () => {
//     const map = mapRef.current;
//     if (!map) return;

//     await new Promise((r) => setTimeout(r, 200));
//     const canvas = map.getCanvas();
//     const image = canvas.toDataURL("image/png");

//     const pdf = new jsPDF({
//       orientation: "landscape",
//       unit: "px",
//       format: [canvas.width, canvas.height],
//     });

//     pdf.addImage(image, "PNG", 0, 0, canvas.width, canvas.height);
//     pdf.save("vehicle-map.pdf");
//   };

//   return (
//     <>
//       {/* main map container */}
//       <div
//         ref={wrapperRef}
//         className="relative w-full h-160 rounded-2xl overflow-hidden bg-white"
//       >
//         <MemoMap
//           ref={mapRef}
//           onLoad={onMapLoad}
//           mapStyle={satellite ? SATELLITE_STYLE : MAP_STYLE}
//           style={{ width: "100%", height: "100%" }}
//           initialViewState={initialViewState}
//           doubleClickZoom={false}
//           dragRotate={false}
//           attributionControl={false}
//         >
//           {/* 🚗 VEHICLE MARKERS */}
//           {mode === "CLUSTER" && (
//             <Marker
//               longitude={onlineDevices[0]?.lng}
//               latitude={onlineDevices[0]?.lat}
//               //   longitude={animatedCoords[0] || Number(selectedVehicleFUll?.lng)}
//               //   latitude={animatedCoords[1] || Number(selectedVehicleFUll?.lat)}
//               anchor="center"
//               onClick={() => {
//                 setSelectedVehicleId(null);
//                 setMode("SINGLE");
//                 fitToAllVehicles(onlineDevices);
//               }}
//             >
//               <VehicleMarker count={onlineCount} />
//             </Marker>
//           )}

//           {mode !== "CLUSTER" &&
//             onlineDevices.map((v) => {
//               const id = v.device_data?.imei ?? v.id;
//               const waveColor = getVehicleWaveColor(v);
//               const filterImages = vehiclesData.find((vId) => vId?.imei === id);
//               return (
//                 <Marker
//                   key={id}
//                   longitude={v.lng}
//                   latitude={v.lat}
//                   anchor="bottom"
//                 >
//                   <div
//                     className="relative flex items-center justify-center cursor-pointer"
//                     onClick={() => {
//                       setSelectedVehicleId((prev) => {
//                         if (prev === id) return null;
//                         flyToVehicle(v);
//                         return id;
//                       });
//                     }}
//                   >
//                     {/* 🌊 Dynamic Wave Animation Rings */}
//                     <div
//                       className="car-status-circle"
//                       style={{ backgroundColor: waveColor }}
//                     ></div>

//                     <div className="car-wave-container">
//                       <div
//                         className="car-wave-ring"
//                         style={{ backgroundColor: waveColor }}
//                       ></div>
//                       <div
//                         className="car-wave-ring wave-2"
//                         style={{ backgroundColor: waveColor }}
//                       ></div>
//                       <div
//                         className="car-wave-ring wave-3"
//                         style={{ backgroundColor: waveColor }}
//                       ></div>
//                     </div>

//                     {/* 🚗 Vehicle Icon (No vibration, just static or simple hover scale) */}
//                     <img
//                       // src="/car-icon.svg"
//                       src={
//                         filterImages?.vehicle_type_image
//                           ? `${import.meta.env.VITE_API_URL}${
//                               filterImages?.vehicle_type_image
//                             }`
//                           : "/car-icon.svg"
//                       }
//                       className="w-10 h-10 z-10 hover:scale-110 transition-transform duration-300"
//                       alt="car"
//                     />

//                     {/* 🔥 CARD POPUP WITH TOOLTIP POINTER */}
//                     {selectedVehicleId === id && (
//                       <div className="absolute bottom-[45px] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
//                         <div className="relative shadow-2xl">
//                           <VehicleInfoCard
//                             vehicle={selectedVehicleFUll}
//                             onClose={() => setSelectedVehicleId(null)}
//                           />
//                         </div>
//                         {/* Tooltip Triangle Pointer */}
//                         <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent  border-t-[15px] border-t-white  drop-shadow-lg"></div>
//                       </div>
//                     )}
//                   </div>
//                 </Marker>
//               );
//             })}
//         </MemoMap>

//         {/* 🗺️ Map / Satellite Toggle */}
//         <div className="absolute top-3 left-3 z-20 bg-white rounded-lg shadow  flex">
//           <button
//             onClick={() => setSatellite(false)}
//             className={`px-4 py-1 cursor-pointer ${
//               !satellite && "bg-gray-100 font-medium"
//             }`}
//           >
//             Map
//           </button>
//           <button
//             onClick={() => setSatellite(true)}
//             className={`px-4 py-1 cursor-pointer ${
//               satellite && "bg-gray-100 font-medium"
//             }`}
//           >
//             Satellite
//           </button>
//         </div>
//         {/* 🖥 Fullscreen */}
//         <button
//           onClick={() => {
//             const el = wrapperRef.current;
//             !document.fullscreenElement
//               ? el.requestFullscreen()
//               : document.exitFullscreen();
//           }}
//           className="absolute top-3 right-4 z-20 w-11 h-11 cursor-pointer bg-white rounded-full shadow flex items-center justify-center"
//         >
//           <Scan />
//         </button>
//         <div className="absolute bottom-8 right-4 z-20">
//           <button
//             onClick={() => setControlsOpen((p) => !p)}
//             className="w-12 h-12 rounded-full cursor-pointer bg-white shadow flex items-center justify-center"
//           >
//             <Scan />
//           </button>
//           {controlsOpen && (
//             <>
//               <button
//                 onClick={zoomIn}
//                 className="absolute -top-20 right-12.5 cursor-pointer bg-white p-2 rounded-full shadow"
//               >
//                 <Plus />
//               </button>
//               <button
//                 onClick={zoomOut}
//                 className="absolute -bottom-5 right-12.5 cursor-pointer bg-white p-2 rounded-full shadow"
//               >
//                 <Minus />
//               </button>
//               <button
//                 onClick={() => mapRef.current?.panBy([-120, 0])}
//                 className="absolute -left-35 -top-1.75 -translate-y-1/2 cursor-pointer bg-white p-2 rounded-full shadow"
//               >
//                 <ChevronLeft />
//               </button>
//               <button
//                 onClick={() => mapRef.current?.panBy([120, 0])}
//                 className="absolute right-12.5 -top-1.75 -translate-y-1/2 cursor-pointer bg-white p-2 rounded-full shadow"
//               >
//                 <ChevronRight />
//               </button>
//               <button
//                 onClick={() => mapRef.current?.panBy([0, -120])}
//                 className="absolute -top-20 -left-19.5 -translate-x-1/2 cursor-pointer bg-white p-2 rounded-full shadow"
//               >
//                 <ChevronUp />
//               </button>
//               <button
//                 onClick={() => mapRef.current?.panBy([0, 120])}
//                 className="absolute -bottom-5 -left-19.5 -translate-x-1/2 cursor-pointer bg-white p-2 rounded-full shadow"
//               >
//                 <ChevronDown />
//               </button>
//             </>
//           )}
//         </div>
//         {/* 📤 Share / Print  / status */}
//         <div>
//           {/* VehicleStatusLegend left side */}
//           <VehicleStatusLegend />

//           {/* 📤 Share / Print  */}
//           <div className="absolute bottom-6 left-15 z-10 flex gap-2 h-9 ">
//             <button
//               onClick={handleShare}
//               className="flex gap-2 justify-center items-center bg-amber-50 rounded-2xl px-3 cursor-pointer"
//             >
//               <Share2 size={21} /> <span>Share</span>
//             </button>
//             <button
//               onClick={handlePrint}
//               className="flex gap-2 justify-center items-center bg-amber-50 rounded-2xl px-3 cursor-pointer"
//             >
//               <Printer size={21} /> <span>Print</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default VehiclesCurrentLocationMap;
