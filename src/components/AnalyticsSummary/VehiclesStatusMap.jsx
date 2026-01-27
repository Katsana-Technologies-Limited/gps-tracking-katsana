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
import { useSelector, useDispatch } from "react-redux";
import { setSelectedLastImei } from "../../slices/vehiclesSlice";
import useVtsAllDevices from "../../hooks/useVtsAllDevices";
import VehicleInfoCard from "../Vehicles/VehicleInfoCard";
import { getVehicleWaveColor } from "../Vehicles/statusConfig";
import VehicleStatusLegend from "../Vehicles/VehicleStatusLegend";
import LottieLoading from "../utils/LottieLoading";

const BARIKOI_KEY = import.meta.env.VITE_BARIKOI_API_KEY;
const GPS_DURATION = 10000;

const MAP_STYLE = `https://map.barikoi.com/styles/osm-liberty/style.json?key=${BARIKOI_KEY}`;
const SATELLITE_STYLE = `https://map.barikoi.com/styles/barikoi_satellite/style.json?key=${BARIKOI_KEY}`;

const FALLBACK_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
};

const MemoMap = React.memo(Map);

const VehiclesStatusMap = () => {
  const mapRef = useRef(null);
  const selectedImeiRef = useRef(null);
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
  const [showSummary, setShowSummary] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const dispatch = useDispatch();
  const { data: vehiclesData = [] } = useCustomerVehicle();
  const { filteredDevices, allDevices } = useVtsAllDevices();
  const lastSelectedImei = useSelector((s) => s.vehicles.selectedLastImei);
  const selectedImeis = useSelector((s) => s.vehicles.selectedImeis || []);

  const baseDevices = filteredDevices?.length
    ? filteredDevices
    : allDevices || [];

  // Vehicle image map
  const vehicleImageMap = useMemo(() => {
    const map = {};
    vehiclesData.forEach((vehicle) => {
      if (vehicle.imei) {
        map[vehicle.imei] = vehicle.vehicle_type_image || "/car-icon.svg";
      }
    });
    return map;
  }, [vehiclesData]);

  // Filter devices based on selected IMEIs
  const mapDevices = useMemo(() => {
    if (!baseDevices?.length) return [];

    if (Array.isArray(selectedImeis) && selectedImeis.length > 0) {
      return selectedImeis
        .map((si) =>
          baseDevices.find((d) => (d.device_data?.imei ?? d.imei) === si),
        )
        .filter(Boolean);
    }

    return baseDevices.filter(
      (d) => d.lat && d.lng && Number(d.lat) !== 0 && Number(d.lng) !== 0,
    );
  }, [baseDevices, selectedImeis]);

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

  // Load map styles
  useEffect(() => {
    if (!showSummary) return;
    let mounted = true;

    const fetchAndSanitize = async (url, setter) => {
      if (!BARIKOI_KEY) {
        if (mounted) setter(FALLBACK_STYLE);
        return;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      try {
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) {
          console.warn(
            "Map style fetch returned non-OK, using fallback",
            res.status,
          );
          if (mounted) setter(FALLBACK_STYLE);
          return;
        }
        const style = await res.json();
        const availableSources = style.sources
          ? Object.keys(style.sources)
          : [];
        if (Array.isArray(style.layers)) {
          style.layers = style.layers.filter((layer) => {
            if (layer.source && !availableSources.includes(layer.source))
              return false;
            return true;
          });
        }
        if (mounted) setter(style);
      } catch (e) {
        if (e.name === "AbortError") {
          console.warn("Map style fetch aborted (timeout), using fallback");
        } else {
          console.warn("Failed to fetch/sanitize map style, using fallback", e);
        }
        if (mounted) setter(FALLBACK_STYLE);
      } finally {
        clearTimeout(timeout);
      }
    };

    fetchAndSanitize(MAP_STYLE, setMapStyleObj);
    fetchAndSanitize(SATELLITE_STYLE, setSatStyleObj);

    return () => {
      mounted = false;
    };
  }, [showSummary]);

  // Initialize sources for selected vehicle
  const initSources = (device) => {
    const lng = Number(device.lng);
    const lat = Number(device.lat);
    if (!isValidCoord(lng, lat)) return;

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

    if (!routeCoords.current[imei]) {
      routeCoords.current[imei] = [[lng, lat]];
    }
    if (!lastPos.current[imei]) {
      lastPos.current[imei] = [lng, lat];
    }
    if (!nextPos.current[imei]) {
      nextPos.current[imei] = [lng, lat];
    }
    if (!startTime.current[imei]) {
      startTime.current[imei] = Date.now();
    }
  };

  // Handle marker click
  const onMarkerClick = (device) => {
    const imei = device.device_data?.imei ?? device.imei;

    selectedImeiRef.current = imei;
    setSelectedVehicleId(imei);
    dispatch(setSelectedLastImei(imei));

    initSources(device);

    const lng = Number(device.lng);
    const lat = Number(device.lat);

    if (isValidCoord(lng, lat)) {
      mapRef.current?.getMap()?.flyTo({
        center: [lng, lat],
        zoom: 16,
        speed: 1.4,
        curve: 1.4,
      });
    }
  };

  // Focus on last selected IMEI
  useEffect(() => {
    if (!lastSelectedImei || !showSummary) return;
    const device = baseDevices.find(
      (d) => (d.device_data?.imei ?? d.imei) === lastSelectedImei,
    );
    if (!device || !mapRef.current) return;

    try {
      onMarkerClick(device);
    } catch (e) {
      console.warn("Failed to focus last selected device on map", e);
    }
  }, [lastSelectedImei, baseDevices, showSummary]);

  // Get full vehicle info
  const selectedVehicleFull = useMemo(() => {
    if (!selectedVehicleId) return null;
    const deviceInfo = baseDevices?.find(
      (d) => (d.device_data?.imei ?? d.imei) === selectedVehicleId,
    );
    const vehicleInfo = vehiclesData?.find(
      (v) => String(v?.imei) === String(selectedVehicleId),
    );
    if (!deviceInfo && !vehicleInfo) return null;
    return { ...vehicleInfo, ...deviceInfo };
  }, [vehiclesData, baseDevices, selectedVehicleId]);

  // Update route coordinates
  useEffect(() => {
    const imei = selectedImeiRef.current;
    if (!imei) return;

    const device = baseDevices.find(
      (d) => (d.device_data?.imei ?? d.imei) === imei,
    );
    if (!device) return;

    const lng = Number(device.lng);
    const lat = Number(device.lat);
    if (!isValidCoord(lng, lat)) return;

    if (!lastPos.current[imei]) {
      lastPos.current[imei] = [lng, lat];
      nextPos.current[imei] = [lng, lat];
      routeCoords.current[imei] = [[lng, lat]];
      startTime.current[imei] = Date.now();
      return;
    }

    routeCoords.current[imei] = routeCoords.current[imei] ?? [];
    nextPos.current[imei] = [lng, lat];
    startTime.current[imei] = Date.now();

    routeCoords.current[imei].push([lng, lat]);

    const map = mapRef.current?.getMap();
    map?.getSource("active-route")?.setData({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: routeCoords.current[imei],
      },
    });
  }, [baseDevices]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      const imei = selectedImeiRef.current;
      if (!imei) {
        rafId.current = requestAnimationFrame(animate);
        return;
      }

      const start = startTime.current[imei];
      const from = lastPos.current[imei];
      const to = nextPos.current[imei];
      if (!start || !from || !to) {
        rafId.current = requestAnimationFrame(animate);
        return;
      }

      const t = Math.min((Date.now() - start) / GPS_DURATION, 1);
      const lng = from[0] + (to[0] - from[0]) * t;
      const lat = from[1] + (to[1] - from[1]) * t;

      const map = mapRef.current?.getMap();
      map?.getSource("active-vehicle")?.setData({
        type: "Feature",
        geometry: { type: "Point", coordinates: [lng, lat] },
      });

      rafId.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  // Fit bounds to show all vehicles
  const fitToAllVehicles = () => {
    if (!mapDevices.length || !mapRef.current) return;
    const valid = mapDevices.filter((d) =>
      isValidCoord(Number(d.lng), Number(d.lat)),
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

  // Fit to all vehicles when map first shows
  useEffect(() => {
    if (showSummary && mapDevices.length > 0 && mapRef.current) {
      const timer = setTimeout(() => {
        fitToAllVehicles();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showSummary]);

  const styleReady = (satellite ? satStyleObj : mapStyleObj) ?? FALLBACK_STYLE;

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

  // Show button initially
  if (!showSummary) {
    return (
      <div
        ref={wrapperRef}
        className="relative w-full h-140 rounded-2xl overflow-hidden bg-white flex items-center justify-center"
      >
        <button
          onClick={() => setShowSummary(true)}
          className="px-4 py-2.5 bg-linear-to-r from-orange-400 to-orange-500 text-white cursor-pointer rounded-lg shadow-lg hover:shadow-xl hover:from-orange-500 hover:to-orange-600 transition-all duration-300 font-medium"
        >
          View Summary Map
        </button>
      </div>
    );
  }

  // Show loading while styles load
  if (!styleReady) {
    return (
      <div
        ref={wrapperRef}
        className="relative w-full h-140 rounded-2xl overflow-hidden bg-white flex items-center justify-center"
      >
        <LottieLoading />
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-140 rounded-2xl overflow-hidden bg-white"
    >
      <MemoMap
        ref={mapRef}
        mapStyle={styleReady}
        style={{ width: "100%", height: "100%" }}
        initialViewState={{
          longitude: 90.3563,
          latitude: 23.685,
          zoom: 6,
        }}
        doubleClickZoom={false}
        dragRotate={false}
        attributionControl={false}
      >
        {mapDevices.map((d) => {
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
                {selectedVehicleId === imei && selectedVehicleFull && (
                  <div className="absolute bottom-11.25 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
                    <div className="relative shadow-2xl">
                      <VehicleInfoCard
                        vehicle={selectedVehicleFull}
                        onClose={() => setSelectedVehicleId(null)}
                      />
                    </div>
                    <div className="w-0 h-0 border-l-12 border-l-transparent border-r-12 border-r-transparent border-t-15 border-t-white drop-shadow-lg"></div>
                  </div>
                )}
              </div>
            </Marker>
          );
        })}
      </MemoMap>

      <div className="absolute top-3 left-3 z-20 bg-white rounded-lg shadow flex">
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
          className={`px-2 md:px-4 py-1 cursor-pointer text-[12px] md:text-sm ${
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
        className="absolute top-3 right-3 z-20 w-9 h-9 md:w-11 md:h-11 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50 transition cursor-pointer"
      >
        <Scan className="w-4 h-4 md:w-5 md:h-5" />
      </button>

      <div className="absolute bottom-4 right-3 z-20 pointer-events-none">
        {controlsOpen && (
          <div className="mb-14 flex flex-col items-center gap-2 pointer-events-auto">
            <button
              onClick={zoomIn}
              className="w-8 h-8 md:w-10 md:h-10 bg-white cursor-pointer rounded-full shadow flex items-center justify-center"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={zoomOut}
              className="w-8 h-8 md:w-10 md:h-10 bg-white cursor-pointer rounded-full shadow flex items-center justify-center"
            >
              <Minus className="w-4 h-4 md:w-5 md:h-5" />
            </button>
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
        <button
          onClick={() => setControlsOpen((p) => !p)}
          className="pointer-events-auto absolute bottom-0 right-0 w-10 h-10 md:w-12 md:h-12 bg-white cursor-pointer rounded-full shadow flex items-center justify-center hover:bg-gray-50 transition"
        >
          <Scan className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      <div>
        <VehicleStatusLegend />
        <div className="absolute bottom-4 left-3 z-10 flex gap-2">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 cursor-pointer bg-amber-50 hover:bg-amber-100 rounded-full md:rounded-2xl px-2 md:px-4 h-8 md:h-11 shadow transition"
          >
            <Share2 className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden md:inline text-sm font-medium">Share</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 cursor-pointer bg-amber-50 hover:bg-amber-100 rounded-full md:rounded-2xl px-2 md:px-4 h-8 md:h-11 shadow transition"
          >
            <Printer className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden md:inline text-sm font-medium">Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehiclesStatusMap;
