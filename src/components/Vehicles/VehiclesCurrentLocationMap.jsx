/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from "react";
import { Map, Marker } from "react-bkoi-gl";
import "bkoi-gl/dist/style/bkoi-gl.css";
import "react-bkoi-gl/styles";
import useVtsAllDevices from "../../hooks/useVtsAllDevices";
import useCustomerVehicle from "../../hooks/useCustomerVehicle";
import VehicleInfoCard from "../Vehicles/VehicleInfoCard";
import { useSelector } from "react-redux";
import { getVehicleWaveColor } from "./statusConfig";
import jsPDF from "jspdf";
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
import VehicleStatusLegend from "./VehicleStatusLegend";

const BARIKOI_KEY = import.meta.env.VITE_BARIKOI_API_KEY;
const GPS_DURATION = 30000;
/* ✅ USE STABLE STYLE ONLY */
const MAP_STYLE = `https://map.barikoi.com/styles/osm-liberty/style.json?key=${BARIKOI_KEY}`;
const SATELLITE_STYLE = `https://map.barikoi.com/styles/barikoi_satellite/style.json?key=${BARIKOI_KEY}`;

const VehiclesLiveMap = () => {
  const mapRef = useRef(null);
  const wrapperRef = useRef(null);
  const selectedImeiRef = useRef(null);
  const lastPos = useRef({});
  const nextPos = useRef({});
  const startTime = useRef({});
  const routeCoords = useRef({});
  const rafId = useRef(null);

  console.log("lastPos", lastPos.current);
  console.log("nextPos", nextPos.current);
  console.log("routeCoords", routeCoords.current);

  const { filteredDevices } = useVtsAllDevices();
  const { data: customerVehicles = [] } = useCustomerVehicle();
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [satellite, setSatellite] = useState(false);
  const [mapStyleObj, setMapStyleObj] = useState(null);
  const [satStyleObj, setSatStyleObj] = useState(null);
  const [controlsOpen, setControlsOpen] = useState(false);

  const lastSelectedImei = useSelector(
    (state) => state.vehicles.selectedLastImei,
  );

  const vehicleImageMap = React.useMemo(() => {
    const map = {};
    customerVehicles.forEach((vehicle) => {
      if (vehicle.imei) {
        map[vehicle.imei] = vehicle.vehicle_type_image || "/car-icon.svg";
      }
    });
    return map;
  }, [customerVehicles]);

  const isValidCoord = (lng, lat) => {
    const L = Number(lng);
    const La = Number(lat);
    return (
      Number.isFinite(L) &&
      Number.isFinite(La) &&
      Math.abs(L) <= 180 &&
      Math.abs(La) <= 90
    );
  };

  useEffect(() => {
    let mounted = true;
    const fetchAndSanitize = async (url, setter) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const style = await res.json();
        const availableSources = style.sources
          ? Object.keys(style.sources)
          : [];
        if (Array.isArray(style.layers)) {
          style.layers = style.layers.filter((layer) => {
            // drop layers that reference missing sources only
            if (layer.source && !availableSources.includes(layer.source))
              return false;
            return true;
          });
        }
        if (mounted) setter(style);
      } catch (e) {
        console.warn("Failed to fetch/sanitize map style", e);
      }
    };

    fetchAndSanitize(MAP_STYLE, setMapStyleObj);
    fetchAndSanitize(SATELLITE_STYLE, setSatStyleObj);

    return () => {
      mounted = false;
    };
  }, []);

  const initSources = (device) => {
    const lng = Number(device.lng);
    const lat = Number(device.lat);
    if (!isValidCoord(lng, lat)) return;

    const map = mapRef.current?.getMap();
    const imei = device.device_data?.imei ?? device.imei;

    if (!map.getSource("active-vehicle")) {
      map.addSource("active-vehicle", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
        },
      });

      map.addLayer({
        id: "active-vehicle-layer",
        type: "symbol",
        source: "active-vehicle",
        layout: {
          "icon-image": "vehicle-icon",
          "icon-size": 0.5,
          "icon-allow-overlap": true,
        },
      });
    }

    if (!map.getSource("active-route")) {
      map.addSource("active-route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates: [] },
        },
      });

      map.addLayer({
        id: "active-route-layer",
        type: "line",
        source: "active-route",
        paint: {
          "line-color": "#ef4444",
          "line-width": 4,
        },
      });
    }

    lastPos.current[imei] = [lng, lat];
    nextPos.current[imei] = [lng, lat];
    routeCoords.current[imei] = [[lng, lat]];

    console.log(" Initialized sources for", imei);
    console.log("lastPos", lastPos.current[imei]);
    console.log("nextPos", nextPos.current[imei]);
    console.log("routeCoords", routeCoords.current[imei]);
  };

  const onMarkerClick = (device) => {
    const imei = device.device_data?.imei ?? device.imei;
    if (selectedImeiRef.current === imei) {
      selectedImeiRef.current = null;
      setSelectedVehicleId(null);
      return;
    }

    selectedImeiRef.current = imei;
    setSelectedVehicleId(imei);

    const lng = Number(device.lng);
    const lat = Number(device.lat);
    if (!isValidCoord(lng, lat)) {
      console.warn("Skipping focus for device with invalid coordinates", imei);
      return;
    }

    initSources(device);

    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: 16,
      speed: 1.5,
      curve: 1.4,
    });
  };

  useEffect(() => {
    if (!lastSelectedImei) return;
    const device = filteredDevices.find(
      (d) => (d.device_data?.imei ?? d.imei) === lastSelectedImei,
    );
    if (!device) return;
    try {
      onMarkerClick(device);
    } catch (e) {
      console.warn("Failed to focus last selected device on map", e);
    }
  }, [lastSelectedImei, filteredDevices]);

  const selectedVehicleFUll = React.useMemo(() => {
    if (!selectedVehicleId) return null;
    const deviceInfo = filteredDevices?.find(
      (d) => (d.device_data?.imei ?? d.imei) === selectedVehicleId,
    );
    const vehicleInfo = customerVehicles?.find(
      (v) => String(v?.imei) === String(selectedVehicleId),
    );
    if (!deviceInfo && !vehicleInfo) return null;
    return { ...vehicleInfo, ...deviceInfo };
  }, [customerVehicles, filteredDevices, selectedVehicleId]);

  useEffect(() => {
    if (!selectedImeiRef.current) return;

    const device = filteredDevices.find(
      (d) => (d.device_data?.imei ?? d.imei) === selectedImeiRef.current,
    );

    if (!device) return;

    const imei = selectedImeiRef.current;
    const lng = Number(device.lng);
    const lat = Number(device.lat);
    if (!isValidCoord(lng, lat)) return;

    if (!Array.isArray(nextPos.current[imei])) {
      lastPos.current[imei] = [lng, lat];
      nextPos.current[imei] = [lng, lat];
      routeCoords.current[imei] = [[lng, lat]];
      startTime.current[imei] = Date.now();
    } else {
      const now = Date.now();
      const prevStart = startTime.current[imei] || now;
      const elapsed = Math.max(0, now - prevStart);
      const progress = Math.min(elapsed / GPS_DURATION, 1);

      const [lng1, lat1] = lastPos.current[imei] || nextPos.current[imei];
      const [lng2, lat2] = nextPos.current[imei] || [lng1, lat1];

      const currentLng = lng1 + (lng2 - lng1) * progress;
      const currentLat = lat1 + (lat2 - lat1) * progress;

      lastPos.current[imei] = [currentLng, currentLat];
      nextPos.current[imei] = [lng, lat];
      routeCoords.current[imei] = routeCoords.current[imei] || [];
      routeCoords.current[imei].push([lng, lat]);
      startTime.current[imei] = Date.now();
    }

    const map = mapRef.current?.getMap();
    if (!map) return;
    map.getSource("active-route")?.setData({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: routeCoords.current[imei],
      },
    });
  }, [filteredDevices]);

  useEffect(() => {
    const animate = () => {
      const imei = selectedImeiRef.current;
      if (
        !imei ||
        !startTime.current[imei] ||
        !Array.isArray(lastPos.current[imei]) ||
        !Array.isArray(nextPos.current[imei])
      ) {
        rafId.current = requestAnimationFrame(animate);
        return;
      }

      const now = Date.now();
      const t = Math.min((now - startTime.current[imei]) / GPS_DURATION, 1);

      const [lng1, lat1] = lastPos.current[imei];
      const [lng2, lat2] = nextPos.current[imei];

      if (!isValidCoord(lng1, lat1) || !isValidCoord(lng2, lat2)) {
        rafId.current = requestAnimationFrame(animate);
        return;
      }

      const lng = lng1 + (lng2 - lng1) * t;
      const lat = lat1 + (lat2 - lat1) * t;

      const map = mapRef.current?.getMap();
      if (!map) {
        rafId.current = requestAnimationFrame(animate);
        return;
      }
      map.getSource("active-vehicle")?.setData({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
      });

      rafId.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  const styleReady = satellite ? satStyleObj : mapStyleObj;

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

  if (!styleReady) {
    return (
      <div className="w-full h-150 rounded-xl overflow-hidden flex items-center justify-center">
        <div className="text-sm text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-150 rounded-xl overflow-hidden"
    >
      <Map
        ref={mapRef}
        mapStyle={styleReady}
        initialViewState={{
          longitude: 90.3563,
          latitude: 23.685,
          zoom: 6,
        }}
      >
        {filteredDevices.map((d) => {
          const imei = d.device_data?.imei ?? d.imei;
          const lng = Number(d.lng);
          const lat = Number(d.lat);
          if (!isValidCoord(lng, lat)) return null;

          const vehicleImage = vehicleImageMap[imei] || "/car-icon.svg";
          const waveColor = getVehicleWaveColor(d);

          return (
            <Marker
              key={imei}
              longitude={lng}
              latitude={lat}
              anchor="bottom"
              onClick={() => onMarkerClick(d)}
            >
              <div className="relative flex items-center justify-center">
                <div
                  className="car-status-circle"
                  style={{ backgroundColor: waveColor }}
                />

                <div className="car-wave-container">
                  <div
                    className="car-wave-ring"
                    style={{ backgroundColor: waveColor }}
                  />
                  <div
                    className="car-wave-ring wave-2"
                    style={{ backgroundColor: waveColor }}
                  />
                  <div
                    className="car-wave-ring wave-3"
                    style={{ backgroundColor: waveColor }}
                  />
                </div>
                <img
                  src={`${import.meta.env.VITE_API_URL}${vehicleImage}`}
                  alt={`Vehicle ${imei}`}
                  className="w-9 h-9 z-10 cursor-pointer hover:scale-110 object-contain"
                  onError={(e) => {
                    e.target.src = "/car-icon.svg";
                  }}
                />
                {selectedVehicleId === imei && selectedVehicleFUll && (
                  <div className="absolute bottom-11.25 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
                    <div className="relative shadow-2xl">
                      <VehicleInfoCard
                        vehicle={selectedVehicleFUll}
                        onClose={() => setSelectedVehicleId(null)}
                      />
                    </div>
                    <div className="w-0 h-0 border-l-12 border-l-transparent border-r-12 border-r-transparent  border-t-15 border-t-white  drop-shadow-lg"></div>
                  </div>
                )}
              </div>
            </Marker>
          );
        })}
      </Map>

      <div className="absolute top-3 left-3 z-20 bg-white rounded-lg shadow  flex">
        <button
          onClick={() => setSatellite(false)}
          className={`px-2 md:px-4 py-1 cursor-pointer text-[12px] md:text-sm ${
            !satellite && "bg-gray-100 font-medium"
          }`}
        >
          Map
        </button>
        <button
          onClick={() => setSatellite(true)}
          className={`px-2 md:px-4 py-1 cursor-pointer text-[12px] md:text-sm  ${
            satellite && "bg-gray-100 font-medium"
          }`}
        >
          Satellite
        </button>
      </div>

      {/* Fullscreen Button (Top Right) */}
      <button
        onClick={() => {
          const el = wrapperRef.current;
          !document.fullscreenElement
            ? el.requestFullscreen()
            : document.exitFullscreen();
        }}
        className="
    absolute top-3 right-3 z-20
    w-9 h-9 md:w-11 md:h-11
    bg-white rounded-full shadow
    flex items-center justify-center
    hover:bg-gray-50 transition cursor-pointer
  "
      >
        <Scan className="w-4 h-4 md:w-5 md:h-5" />
      </button>

      {/* Map Controls Wrapper */}
      <div className="absolute bottom-4 right-3 z-20 pointer-events-none">
        {/* === EXPANDED CONTROLS (ABOVE SCAN, NEVER AFFECT SCAN) === */}
        {controlsOpen && (
          <div className="mb-14 flex flex-col items-center gap-2 pointer-events-auto">
            {/* Zoom In */}
            <button
              onClick={zoomIn}
              className="w-8 h-8 md:w-10 md:h-10 bg-white cursor-pointer rounded-full shadow flex items-center justify-center"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {/* Zoom Out */}
            <button
              onClick={zoomOut}
              className="w-8 h-8 md:w-10 md:h-10 bg-white cursor-pointer rounded-full shadow flex items-center justify-center"
            >
              <Minus className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {/* Pan Controls */}
            <div className="relative w-20 h-20 md:w-28 md:h-28">
              <button
                onClick={() => mapRef.current?.panBy([-120, 0])}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 md:w-10 md:h-10 bg-white cursor-pointer rounded-full shadow flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <button
                onClick={() => mapRef.current?.panBy([120, 0])}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-7 h-7 md:w-10 md:h-10 bg-white cursor-pointer rounded-full shadow flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <button
                onClick={() => mapRef.current?.panBy([0, -120])}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-7 md:w-10 md:h-10 bg-white cursor-pointer rounded-full shadow flex items-center justify-center"
              >
                <ChevronUp className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <button
                onClick={() => mapRef.current?.panBy([0, 120])}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-7 md:w-10 md:h-10 bg-white cursor-pointer rounded-full shadow flex items-center justify-center"
              >
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        )}

        {/* === SCAN BUTTON (ABSOLUTELY FIXED, NEVER MOVES) === */}
        <button
          onClick={() => setControlsOpen((p) => !p)}
          className="
      pointer-events-auto
      absolute bottom-0 right-0
      w-10 h-10 md:w-12 md:h-12
      bg-white cursor-pointer rounded-full shadow
      flex items-center justify-center
      hover:bg-gray-50 transition
    "
        >
          <Scan className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      {/* 📤 Share / Print  / status */}
      <div>
        {/* VehicleStatusLegend */}
        <VehicleStatusLegend />

        {/* Share + Print */}
        <div className="absolute bottom-4 left-3 z-10 flex gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="
        flex items-center justify-center gap-2 cursor-pointer
        bg-amber-50 hover:bg-amber-100
        rounded-full md:rounded-2xl
        px-2 md:px-4
        h-8 md:h-11
        shadow
        transition
      "
          >
            <Share2 className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden md:inline text-sm font-medium">Share</span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="
        flex items-center justify-center gap-2 cursor-pointer
        bg-amber-50 hover:bg-amber-100
        rounded-full md:rounded-2xl
        px-2 md:px-4
        h-8 md:h-11
        shadow
        transition
      "
          >
            <Printer className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden md:inline text-sm font-medium">Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehiclesLiveMap;
