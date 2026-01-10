import { useMemo, useRef, useState } from "react";
import { Map, Source, Layer, Marker } from "react-bkoi-gl";
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
import useVtsDevices from "../../hooks/useVtsDevices";
import { VehicleMarker } from "../Vehicles/VehicleMarker";
import useVtsAllDevices from "../../hooks/useVtsAllDevices";

const BARIKOI_KEY = import.meta.env.VITE_BARIKOI_API_KEY;

// const MAP_STYLE = `https://map.barikoi.com/styles/barikoi-light/style.json?key=${BARIKOI_KEY}`;
const MAP_STYLE = `https://map.barikoi.com/styles/osm-liberty/style.json?key=${BARIKOI_KEY}`;
const SATELLITE_STYLE = `https://map.barikoi.com/styles/barikoi_satellite/style.json?key=${BARIKOI_KEY}`;

const vehicleLayer = {
  id: "vehicle-layer",
  type: "symbol",
  layout: {
    "icon-image": "car-15",
    "icon-size": 1.2,
    "icon-allow-overlap": true,
  },
};

const VehiclesStatusMap = () => {
  const mapRef = useRef(null);
  const wrapperRef = useRef(null);
  const { filteredDevices, isLoading } = useVtsAllDevices();

  // console.log(filteredDevices);

  const [satellite, setSatellite] = useState(false);
  const [moveHandel, setMoveHandel] = useState(false);

  const { data: vehiclesData } = useCustomerVehicle();

  const imeis = useMemo(() => {
    if (!vehiclesData) return [];
    return vehiclesData.map((v) => v.imei).filter(Boolean);
  }, [vehiclesData]);

  const { data: vtsData } = useVtsDevices(imeis);

  /** 🔥 Convert API data → GeoJSON */
  const vehiclesGeoJSON = useMemo(() => {
    if (!vtsData) {
      return { type: "FeatureCollection", features: [] };
    }

    const features = imeis
      .map((imei) => {
        const vts = vtsData[imei]?.[0];
        if (!vts?.lat || !vts?.lng) return null;

        return {
          type: "Feature",
          properties: {
            imei,
            name: vts.name || imei,
          },
          geometry: {
            type: "Point",
            coordinates: [vts.lng, vts.lat],
          },
        };
      })
      .filter(Boolean);

    return {
      type: "FeatureCollection",
      features,
    };
  }, [vtsData, imeis]);

  const initialViewState = {
    longitude: 90.3563,
    latitude: 23.685,
    minZoom: 4,
    maxZoom: 30,
    zoom: 5.8,
    bearing: 0,
    pitch: 0,
    antialias: true,
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
        {/* 🚗 Vehicles */}
        <Source id="vehicles" type="geojson" data={vehiclesGeoJSON}>
          <Layer {...vehicleLayer} />
        </Source>
        <Marker longitude={90.36402} latitude={23.823731} anchor="bottom">
          <VehicleMarker count={2} />
        </Marker>
      </Map>

      {/* Map / Satellite Toggle */}
      <div className="absolute top-3 left-3 z-10 bg-white rounded-lg shadow flex">
        <button
          onClick={() => setSatellite(false)}
          className={`px-4 py-1 ${!satellite && "bg-gray-100 font-medium"}`}
        >
          Map
        </button>
        <button
          onClick={() => setSatellite(true)}
          className={`px-4 py-1 ${satellite && "bg-gray-100 font-medium"}`}
        >
          Satellite
        </button>
      </div>

      {/* Fullscreen */}
      <button
        onClick={() => {
          const el = wrapperRef.current;
          !document.fullscreenElement
            ? el.requestFullscreen()
            : document.exitFullscreen();
        }}
        className="absolute top-3 right-5 z-20 w-11 h-11 bg-white rounded-full p-2 shadow-md hover:scale-105 transition flex justify-center items-center cursor-pointer"
      >
        <Scan />
      </button>

      {/* Radial Controls */}
      <div className="absolute bottom-9 right-4 z-20">
        <button
          onClick={() => setMoveHandel((p) => !p)}
          className={`
            relative z-30 cursor-pointer
            w-12 h-12 rounded-full bg-white hover:bg-amber-50 shadow-lg
            flex items-center justify-center
            transition-all duration-300 ease-out
            ${moveHandel ? "rotate-45 scale-110" : "rotate-0 scale-100"}
          `}
          aria-pressed={moveHandel}
        >
          <Scan size={22} />
        </button>
        {/* RADIAL BUTTONS */}
        {moveHandel && (
          <>
            <button
              onClick={zoomIn}
              className="absolute -top-20 right-12.5 bg-white rounded-full p-2 cursor-pointer"
            >
              <Plus />
            </button>
            <button
              onClick={zoomOut}
              className="absolute -bottom-5 right-12.5 cursor-pointer bg-white rounded-full p-2"
            >
              <Minus />
            </button>
            <button
              onClick={() => mapRef.current?.panBy([-120, 0])}
              className="absolute -left-35 top-[-7px] -translate-y-1/2   cursor-pointer bg-white rounded-full p-2"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => mapRef.current?.panBy([120, 0])}
              className="absolute right-12.5 top-[-7px] -translate-y-1/2 cursor-pointer bg-white rounded-full p-2"
            >
              <ChevronRight />
            </button>
            <button
              onClick={() => mapRef.current?.panBy([0, -120])}
              className="absolute -top-20 left-[-78px] -translate-x-1/2 cursor-pointer bg-white rounded-full p-2"
            >
              <ChevronUp />
            </button>
            <button
              onClick={() => mapRef.current?.panBy([0, 120])}
              className="absolute -bottom-5 left-[-78px] -translate-x-1/2 cursor-pointer  bg-white rounded-full p-2"
            >
              <ChevronDown />
            </button>
          </>
        )}
      </div>

      {/* Share / Print */}
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
