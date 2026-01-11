/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useMemo } from "react";
import { Map, Marker } from "react-bkoi-gl";
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
import useSelectedImeis from "../../hooks/useSelectedImeis";

const BARIKOI_KEY = import.meta.env.VITE_BARIKOI_API_KEY;

/* ✅ USE STABLE STYLE ONLY */
const MAP_STYLE = `https://map.barikoi.com/styles/osm-liberty/style.json?key=${BARIKOI_KEY}`;
const SATELLITE_STYLE = `https://map.barikoi.com/styles/barikoi_satellite/style.json?key=${BARIKOI_KEY}`;

const VehiclesStatusMap = () => {
  const mapRef = useRef(null);
  const wrapperRef = useRef(null);
  const [satellite, setSatellite] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const selectedImeis = useSelectedImeis();
  console.log(selectedImeis);

  const { data: vehiclesData } = useCustomerVehicle();
  // console.log("vehiclesData", vehiclesData);

  // const imeis = useMemo(() => {
  //   if (!vehiclesData || !Array.isArray(vehiclesData)) return [];
  //   return vehiclesData.map((v) => v.imei).filter(Boolean);
  // }, [vehiclesData]);

  // const imeis = useMemo(() => {
  //   return vehiclesData.map((v) => v.imei).filter(Boolean);
  // }, [vehiclesData]);

  // console.log("imesis update", imeis);

  // FAKE VTS DATA FOR DEMO/TESTING
  const vtsData = {
    123456789012345: {
      lat: 23.823731,
      lng: 90.36402,
      count: 2,
    },
    987654321098765: {
      lat: 23.825,
      lng: 90.366,
      count: 1,
    },
  };

  const markers = useMemo(() => {
    if (!vehiclesData) return [];
    return vehiclesData
      .map((v) => {
        const d = vtsData[v.imei];
        if (!d) return null;
        return {
          imei: v.imei,
          ...d,
        };
      })
      .filter(Boolean);
  }, [vehiclesData]);

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
      <Map
        ref={mapRef}
        mapStyle={satellite ? SATELLITE_STYLE : MAP_STYLE}
        style={{ width: "100%", height: "100%" }}
        initialViewState={initialViewState}
        doubleClickZoom={false}
        dragRotate={false}
        attributionControl={false}
      >
        {/* 🚗 VEHICLE MARKERS */}
        {markers.map((m) => (
          <Marker
            key={m.imei}
            longitude={m.lng}
            latitude={m.lat}
            anchor="center"
          >
            <VehicleMarker count={m.count} />
          </Marker>
        ))}
      </Map>

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

export default VehiclesStatusMap;
