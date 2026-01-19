/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useMemo, useEffect } from "react";
import { Map, Marker } from "react-bkoi-gl";
import maplibregl, { visit } from "maplibre-gl";
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
import { useSelector } from "react-redux";
import { VehicleMarker } from "../Vehicles/VehicleMarker";
import useVtsAllDevices from "../../hooks/useVtsAllDevices";
import VehicleInfoCard from "../Vehicles/VehicleInfoCard";
import { getVehicleWaveColor } from "../Vehicles/statusConfig";
import VehicleStatusLegend from "../Vehicles/VehicleStatusLegend";
import LottieLoading from "../utils/LottieLoading";

const BARIKOI_KEY = import.meta.env.VITE_BARIKOI_API_KEY;

const GPS_DURATION = 10000;

/* ✅ USE STABLE STYLE ONLY */
const MAP_STYLE = `https://map.barikoi.com/styles/osm-liberty/style.json?key=${BARIKOI_KEY}`;
const SATELLITE_STYLE = `https://map.barikoi.com/styles/barikoi_satellite/style.json?key=${BARIKOI_KEY}`;

const MemoMap = React.memo(Map);

const VehiclesStatusMap = () => {
  const mapRef = useRef(null);
  const lastPos = useRef({});
  const nextPos = useRef({});
  const startTime = useRef({});
  const routeCoords = useRef({});
  const rafId = useRef(null);
  const wrapperRef = useRef(null);
  const [satellite, setSatellite] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [mapStyleObj, setMapStyleObj] = useState(null);
  const [satStyleObj, setSatStyleObj] = useState(null);

  const { data: vehiclesData } = useCustomerVehicle();
  const { filteredDevices, allDevices } = useVtsAllDevices();
  const lastSelectedImei = useSelector((s) => s.vehicles.selectedLastImei);
  const [mode, setMode] = useState("INIT");

  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const baseDevices =
    filteredDevices && filteredDevices.length
      ? filteredDevices
      : allDevices || [];

  const mapDevices = useMemo(() => {
    if (!baseDevices?.length) return [];
    if (lastSelectedImei) {
      const found = baseDevices.find(
        (d) => (d.device_data?.imei ?? d.imei) === lastSelectedImei,
      );
      return found ? [found] : [];
    }

    return baseDevices.filter(
      (d) =>
        d.online === "online" &&
        d.lat &&
        d.lng &&
        Number(d.lat) !== 0 &&
        Number(d.lng) !== 0,
    );
  }, [baseDevices, lastSelectedImei]);

  const onlineCount = mapDevices.length;

  const flyToVehicle = (v) => {
    const lng = Number(v.lng);
    const lat = Number(v.lat);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;
    mapRef.current?.flyTo({
      center: [lng, lat],
      zoom: 15,
      speed: 1.2,
      curve: 1.4,
    });
  };

  const initSources = (device) => {
    const lng = Number(device.lng);
    const lat = Number(device.lat);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;

    const map = mapRef.current?.getMap();
    const imei = device.device_data?.imei ?? device.imei;
    if (!map) return;

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
  };

  useEffect(() => {
    if (!lastSelectedImei) return;
    const device = baseDevices.find(
      (d) => (d.device_data?.imei ?? d.imei) === lastSelectedImei,
    );
    if (!device || !mapRef.current) return;
    setSelectedVehicleId(lastSelectedImei);
    flyToVehicle(device);
  }, [lastSelectedImei, baseDevices]);

  useEffect(() => {
    if (!selectedVehicleId) return;

    const device = filteredDevices.find(
      (d) => (d.device_data?.imei ?? d.imei) === selectedVehicleId,
    );
    if (!device) return;

    const imei = selectedVehicleId;
    const lng = Number(device.lng);
    const lat = Number(device.lat);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;

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
  }, [filteredDevices, selectedVehicleId]);

  useEffect(() => {
    const animate = () => {
      const imei = selectedVehicleId;
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

      if (
        !Number.isFinite(lng1) ||
        !Number.isFinite(lat1) ||
        !Number.isFinite(lng2) ||
        !Number.isFinite(lat2)
      ) {
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
  }, [selectedVehicleId]);

  const fitToAllVehicles = (devices) => {
    if (!devices.length || !mapRef.current) return;
    const valid = devices.filter(
      (d) => Number.isFinite(Number(d.lng)) && Number.isFinite(Number(d.lat)),
    );
    if (!valid.length) return;

    const map = mapRef.current.getMap();
    const bounds = valid.reduce(
      (b, d) => b.extend([Number(d.lng), Number(d.lat)]),
      new maplibregl.LngLatBounds(
        [Number(valid[0].lng), Number(valid[0].lat)],
        [Number(valid[0].lng), Number(valid[0].lat)],
      ),
    );

    map.fitBounds(bounds, {
      padding: 80,
      duration: 600,
    });
  };

  useEffect(() => {
    if (onlineCount > 1 && mode !== "CLUSTER") setMode("CLUSTER");
  }, [onlineCount]);

  const selectedVehicleFUll = useMemo(() => {
    if (!selectedVehicleId) return null;
    const vehicleInfo = vehiclesData?.find((v) => v.imei === selectedVehicleId);
    const deviceInfo = filteredDevices?.find(
      (d) => (d.device_data?.imei ?? d.imei) === selectedVehicleId,
    );
    if (!vehicleInfo && !deviceInfo) return null;
    return {
      ...vehicleInfo,
      ...deviceInfo,
    };
  }, [vehiclesData, filteredDevices, selectedVehicleId]);

  const initialViewState = {
    longitude: 90.3563,
    latitude: 23.685,
    zoom: 6,
    bearing: 0,
    pitch: 0,
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

  const styleReady = satellite ? satStyleObj : mapStyleObj;

  if (!styleReady) return <LottieLoading />;

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
        mapStyle={styleReady}
        style={{ width: "100%", height: "100%" }}
        initialViewState={initialViewState}
        doubleClickZoom={false}
        dragRotate={false}
        attributionControl={false}
      >
        {/* 🚗 VEHICLE MARKERS */}
        {mode === "CLUSTER" && mapDevices.length > 0 && (
          <Marker
            longitude={Number(mapDevices[0].lng)}
            latitude={Number(mapDevices[0].lat)}
            anchor="center"
            onClick={() => {
              setSelectedVehicleId(null);
              setMode("SINGLE");
              fitToAllVehicles(mapDevices);
            }}
          >
            <VehicleMarker count={onlineCount} />
          </Marker>
        )}

        {mode !== "CLUSTER" &&
          mapDevices.map((v) => {
            const id = v.device_data?.imei ?? v.id;
            const lng = Number(v.lng);
            const lat = Number(v.lat);
            if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
            const waveColor = getVehicleWaveColor(v);
            const filterImages = vehiclesData.find((vId) => vId?.imei === id);
            return (
              <Marker key={id} longitude={lng} latitude={lat} anchor="bottom">
                <div
                  className="relative flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    setSelectedVehicleId((prev) => {
                      if (prev === id) return null;
                      flyToVehicle(v);
                      initSources(v);
                      return id;
                    });
                  }}
                >
                  {/* 🌊 Dynamic Wave Animation Rings */}
                  <div
                    className="car-status-circle"
                    style={{ backgroundColor: waveColor }}
                  ></div>

                  <div className="car-wave-container">
                    <div
                      className="car-wave-ring"
                      style={{ backgroundColor: waveColor }}
                    ></div>
                    <div
                      className="car-wave-ring wave-2"
                      style={{ backgroundColor: waveColor }}
                    ></div>
                    <div
                      className="car-wave-ring wave-3"
                      style={{ backgroundColor: waveColor }}
                    ></div>
                  </div>
                  <img
                    src={
                      filterImages?.vehicle_type_image
                        ? `${import.meta.env.VITE_API_URL}${
                            filterImages?.vehicle_type_image
                          }`
                        : "/car-icon.svg"
                    }
                    className="w-10 h-10 z-10 hover:scale-110 transition-transform duration-300"
                    alt="car"
                  />
                  {selectedVehicleId === id && (
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
      </MemoMap>
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
      {/* 📤 Share / Print  / status */}
      {/* Mobile (Vehicle speed is greater than or equal to 5KM/H) /  Slow (Vehicle
      speed is less than 5 KM/H) /  Engine has beed turned off recently  / Off (Engine
      is currently at the momment turned off) / Offline (Vehicle is Offline and
      data was received more than 24 hrs ago) */}
      <div>
        {/* <div className="absolute bottom-6 left-3 z-10  flex flex-col gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-[#95F0B3]" />
          <div className="w-8 h-8 rounded-xl bg-[#95D8F0]" />
          <div className="w-8 h-8 rounded-xl bg-[#F0C695]" />
          <div className="w-8 h-8 rounded-xl bg-[#F09D95]" />
          <div className="w-8 h-8 rounded-xl bg-[#787878]" />
        </div> */}
        {/* VehicleStatusLegend left side */}
        <VehicleStatusLegend />
        <div className="absolute bottom-6 left-15 z-10 flex gap-2 h-9">
          <button
            onClick={handleShare}
            className="flex gap-2 justify-center items-center bg-amber-50 rounded-2xl px-3 cursor-pointer"
          >
            <Share2 size={21} />
            Share
          </button>
          <button
            onClick={handlePrint}
            className="flex gap-2 justify-center items-center bg-amber-50 rounded-2xl px-3 cursor-pointer"
          >
            <Printer size={21} />
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehiclesStatusMap;
