/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useMemo, useEffect } from "react";
import { Map, Marker } from "react-bkoi-gl";
import maplibregl from "maplibre-gl";
import "react-bkoi-gl/styles";
import {
  Share2,
  Printer,
  Scan,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
} from "lucide-react";
import jsPDF from "jspdf";
import useCustomerVehicle from "../../hooks/useCustomerVehicle";
import { VehicleMarker } from "../Vehicles/VehicleMarker";
<<<<<<< HEAD
import useSelectedImeis from "../../hooks/useSelectedImeis";
=======
import useVtsAllDevices from "../../hooks/useVtsAllDevices";
>>>>>>> sw

const BARIKOI_KEY = import.meta.env.VITE_BARIKOI_API_KEY;

/* ✅ USE STABLE STYLE ONLY */
const MAP_STYLE = `https://map.barikoi.com/styles/osm-liberty/style.json?key=${BARIKOI_KEY}`;
const SATELLITE_STYLE = `https://map.barikoi.com/styles/barikoi_satellite/style.json?key=${BARIKOI_KEY}`;

const MemoMap = React.memo(Map);

const VehiclesStatusMap = () => {
  const mapRef = useRef(null);
  const wrapperRef = useRef(null);
  const [satellite, setSatellite] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
<<<<<<< HEAD
  const selectedImeis = useSelectedImeis();
  console.log(selectedImeis);

  const { data: vehiclesData } = useCustomerVehicle();
  // console.log("vehiclesData", vehiclesData);

  // const imeis = useMemo(() => {
  //   if (!vehiclesData || !Array.isArray(vehiclesData)) return [];
  //   return vehiclesData.map((v) => v.imei).filter(Boolean);
  // }, [vehiclesData]);
=======
  const [mode, setMode] = useState("INIT");
  const [cardVehicle, setCardVehicle] = useState(null);
  const [cardPos, setCardPos] = useState(null);

  // INIT | CLUSTER | SINGLE | VEHICLE
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const { data: vehiclesData } = useCustomerVehicle();
  console.log("vehiclesData", vehiclesData);
  const { allDevices, filteredDevices } = useVtsAllDevices();
>>>>>>> sw

  // const imeis = useMemo(() => {
  //   return vehiclesData.map((v) => v.imei).filter(Boolean);
  // }, [vehiclesData]);

  // console.log("imesis update", imeis);

  const onlineDevices = useMemo(() => {
    if (!filteredDevices?.length) return [];

    return filteredDevices.filter(
      (d) =>
        d.online === "online" &&
        d.lat &&
        d.lng &&
        Number(d.lat) !== 0 &&
        Number(d.lng) !== 0
    );
  }, [filteredDevices]);

  const onlineCount = onlineDevices.length;

  console.log("DEBUG onlineCount:", onlineCount);

  console.log("DEBUG allDevices from DB:", allDevices);
  console.log("DEBUG filteredDevices:", filteredDevices);

  const flyToVehicle = (v) => {
    mapRef.current?.flyTo({
      center: [v.lng, v.lat],
      zoom: 15,
      speed: 1.2,
      curve: 1.4,
    });
  };

  const fitToAllVehicles = (devices) => {
    if (!devices.length || !mapRef.current) return;

    const map = mapRef.current.getMap();
    const bounds = devices.reduce(
      (b, d) => b.extend([d.lng, d.lat]),
      new maplibregl.LngLatBounds(
        [devices[0].lng, devices[0].lat],
        [devices[0].lng, devices[0].lat]
      )
    );

    // map.fitBounds(bounds, {
    //   padding: 120,
    //   duration: 1200,
    // });

    map.fitBounds(bounds, {
      padding: 80,
      duration: 600,
    });
  };

  useEffect(() => {
    if (onlineCount > 1 && mode !== "CLUSTER") setMode("CLUSTER");
    // else if (onlineCount === 1 && mode !== "VEHICLE") {
    //   setSelectedVehicle(onlineDevices[0]);
    //   setMode("VEHICLE");
    //   flyToVehicle(onlineDevices[0]);
    // }
  }, [onlineCount]);

  const updateCardPosition = (v) => {
    const map = mapRef.current.getMap();
    const p = map.project([v.lng, v.lat]);
    setCardPos({ x: p.x, y: p.y });
  };

  const initialViewState = {
    longitude: 90.3563,
    latitude: 23.685,
    zoom: 6,
    bearing: 0,
    pitch: 0,
  };

  /* ---------------- Actions ---------------- */
  const zoomIn = () => mapRef.current?.zoomIn();
  const zoomOut = () => mapRef.current?.zoomOut();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Map link copied");
  };

  const handlePrint = async () => {
    const map = mapRef.current;
    if (!map) return;

    await new Promise((r) => setTimeout(r, 200));
    const canvas = map.getCanvas();
    const image = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(image, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("vehicle-map.pdf");
  };

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-140 rounded-2xl overflow-hidden bg-white"
    >
      <MemoMap
        ref={mapRef}
        mapStyle={satellite ? SATELLITE_STYLE : MAP_STYLE}
        style={{ width: "100%", height: "100%" }}
        initialViewState={initialViewState}
        doubleClickZoom={false}
        dragRotate={false}
        attributionControl={false}
      >
        {/* 🚗 VEHICLE MARKERS */}
        {mode === "CLUSTER" && (
          <Marker
            longitude={onlineDevices[0].lng}
            latitude={onlineDevices[0].lat}
            anchor="center"
            onClick={() => {
              setSelectedVehicleId(null);
              setMode("SINGLE");
              fitToAllVehicles(onlineDevices);
            }}
          >
            <VehicleMarker count={onlineCount} />
          </Marker>
        )}

        {mode !== "CLUSTER" &&
          onlineDevices.map((v) => {
            const id = v.device_data?.imei ?? v.id;
            return (
              <Marker
                key={id}
                longitude={v.lng}
                latitude={v.lat}
                anchor="bottom"
                // onClick={() => {
                //   setSelectedVehicleId((prev) => {
                //     if (prev === id) {
                //       return null; // hide → no fly
                //     } else {
                //       flyToVehicle(v); // show → fly
                //       return id;
                //     }
                //   });
                // }}

                onClick={() => {
                  setSelectedVehicleId((prev) => {
                    if (prev === id) {
                      setCardVehicle(null);
                      return null;
                    } else {
                      flyToVehicle(v);
                      updateCardPosition(v);
                      setCardVehicle(v);
                      return id;
                    }
                  });
                }}
              >
                <img src="/car-icon.svg" className="w-8 h-8 cursor-pointer" />

                {/* 🔥 CARD POPUP (RELATIVE TO THIS CAR) */}
                {selectedVehicleId === (v.device_data?.imei ?? v.id) && (
                  <VehicleInfoCard vehicle={v} />
                )}
              </Marker>
            );
          })}
      </MemoMap>

      {/* {cardVehicle && cardPos && (
        <div
          style={{
            position: "absolute",
            left: cardPos.x,
            top: cardPos.y - 160,
            transform: "translateX(-50%)",
          }}
        >
          <VehicleInfoCard vehicle={cardVehicle} />
        </div>
      )} */}

      {/* 🗺️ Map / Satellite Toggle */}
      <div className="absolute top-3 left-3 z-20 bg-white rounded-lg shadow  flex">
        <button
          onClick={() => setSatellite(false)}
          className={`px-4 py-1 cursor-pointer ${
            !satellite && "bg-gray-100 font-medium"
          }`}
        >
          Map
        </button>
        <button
          onClick={() => setSatellite(true)}
          className={`px-4 py-1 cursor-pointer ${
            satellite && "bg-gray-100 font-medium"
          }`}
        >
          Satellite
        </button>
      </div>

      {/* 🖥 Fullscreen */}
      <button
        onClick={() => {
          const el = wrapperRef.current;
          !document.fullscreenElement
            ? el.requestFullscreen()
            : document.exitFullscreen();
        }}
        className="absolute top-3 right-4 z-20 w-11 h-11 cursor-pointer bg-white rounded-full shadow flex items-center justify-center"
      >
        <Scan />
      </button>
      <div className="absolute bottom-8 right-4 z-20">
        <button
          onClick={() => setControlsOpen((p) => !p)}
          className="w-12 h-12 rounded-full cursor-pointer bg-white shadow flex items-center justify-center"
        >
          <Scan />
        </button>
        {controlsOpen && (
          <>
            <button
              onClick={zoomIn}
              className="absolute -top-20 right-12.5 cursor-pointer bg-white p-2 rounded-full shadow"
            >
              <Plus />
            </button>
            <button
              onClick={zoomOut}
              className="absolute -bottom-5 right-12.5 cursor-pointer bg-white p-2 rounded-full shadow"
            >
              <Minus />
            </button>
            <button
              onClick={() => mapRef.current?.panBy([-120, 0])}
              className="absolute -left-35 -top-1.75 -translate-y-1/2 cursor-pointer bg-white p-2 rounded-full shadow"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => mapRef.current?.panBy([120, 0])}
              className="absolute right-12.5 -top-1.75 -translate-y-1/2 cursor-pointer bg-white p-2 rounded-full shadow"
            >
              <ChevronRight />
            </button>
            <button
              onClick={() => mapRef.current?.panBy([0, -120])}
              className="absolute -top-20 -left-19.5 -translate-x-1/2 cursor-pointer bg-white p-2 rounded-full shadow"
            >
              <ChevronUp />
            </button>
            <button
              onClick={() => mapRef.current?.panBy([0, 120])}
              className="absolute -bottom-5 -left-19.5 -translate-x-1/2 cursor-pointer bg-white p-2 rounded-full shadow"
            >
              <ChevronDown />
            </button>
          </>
        )}
      </div>

      {/* 📤 Share / Print */}
      <div>
        <div className="absolute bottom-6 left-3 z-10  flex flex-col gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-[#95F0B3]" />
          <div className="w-8 h-8 rounded-xl bg-[#95D8F0]" />
          <div className="w-8 h-8 rounded-xl bg-[#F0C695]" />
          <div className="w-8 h-8 rounded-xl bg-[#F09D95]" />
          <div className="w-8 h-8 rounded-xl bg-[#787878]" />
        </div>
        <div className="absolute bottom-6 left-15 z-10 flex gap-2 h-9 ">
          <button
            onClick={handleShare}
            className="flex gap-2 justify-center items-center bg-amber-50 rounded-2xl px-3 cursor-pointer"
          >
            <Share2 size={21} /> <span>Share</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex gap-2 justify-center items-center bg-amber-50 rounded-2xl px-3 cursor-pointer"
          >
            <Printer size={21} /> <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const VehicleInfoCard = ({ vehicle }) => {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[360px] rounded-2xl shadow-2xl bg-white overflow-hidden z-30 pointer-events-auto">
      {/* 🟡 Header */}
      <div className="bg-yellow-400 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{vehicle.name ?? "TMV 44837"}</p>
          <p className="text-xs">
            {vehicle.device_data?.plate_number ?? "DM NA 13-0756"}
          </p>
        </div>
        <img src="/car-icon.svg" className="w-7 h-7" />
      </div>

      {/* 📊 Body */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-amber-50 rounded-xl p-3 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold">{Math.round(vehicle.speed ?? 0)}</p>
          <p className="text-xs text-gray-500">km/h</p>
        </div>

        <div className="text-xs text-gray-600">
          <p className="font-medium text-black mb-1">
            {vehicle.address ?? "Unknown location"}
          </p>
          <p>
            {vehicle.lat?.toFixed(5)}, {vehicle.lng?.toFixed(5)}
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            {vehicle.time ?? "Just now"}
          </p>
        </div>

        <div
          className={`col-span-2 rounded-xl px-3 py-2 text-sm font-medium ${
            vehicle.engine_status
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          Engine Status: {vehicle.engine_status ? "On" : "Off"}
        </div>
      </div>

      {/* 🔘 Actions */}
      <div className="border-t px-4 py-3 grid grid-cols-5 gap-3 text-gray-500">
        <button className="flex flex-col items-center text-xs">
          📍<span>Map</span>
        </button>
        <button className="flex flex-col items-center text-xs">
          🕒<span>History</span>
        </button>
        <button className="flex flex-col items-center text-xs">
          ⏱<span>Idle</span>
        </button>
        <button className="flex flex-col items-center text-xs">
          📈<span>Speed</span>
        </button>
        <button className="flex flex-col items-center text-xs">
          📌<span>Locate</span>
        </button>
      </div>
    </div>
  );
};

export default VehiclesStatusMap;
