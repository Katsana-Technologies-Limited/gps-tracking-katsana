/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from "react";
import { Map, Marker } from "react-bkoi-gl";
import "bkoi-gl/dist/style/bkoi-gl.css";
import "react-bkoi-gl/styles";
import useVtsAllDevices from "../../hooks/useVtsAllDevices";
import useCustomerVehicle from "../../hooks/useCustomerVehicle";
import VehicleInfoCard from "../Vehicles/VehicleInfoCard";
import { useSelector } from "react-redux";

const BARIKOI_KEY = import.meta.env.VITE_BARIKOI_API_KEY;
const MAP_STYLE_URL = `https://map.barikoi.com/styles/osm-liberty/style.json?key=${BARIKOI_KEY}`;
const GPS_DURATION = 10000;

const VehiclesLiveMap = () => {
  const mapRef = useRef(null);
  const selectedImeiRef = useRef(null);
  const lastPos = useRef({});
  const nextPos = useRef({});
  const startTime = useRef({});
  const routeCoords = useRef({});
  const rafId = useRef(null);

  const { filteredDevices } = useVtsAllDevices();
  const { data: customerVehicles = [] } = useCustomerVehicle();
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const lastSelectedImei = useSelector(
    (state) => state.vehicles.selectedLastImei,
  );
  const [mapStyleObj, setMapStyleObj] = useState(null);

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
    (async () => {
      try {
        const res = await fetch(MAP_STYLE_URL);
        if (!res.ok) return;
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
        if (mounted) setMapStyleObj(style);
      } catch (e) {
        console.warn("Failed to fetch/sanitize map style", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // const onMapLoad = (e) => {
  //   return;
  // };

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

  if (!mapStyleObj) {
    return (
      <div className="w-full h-150 rounded-xl overflow-hidden flex items-center justify-center">
        <div className="text-sm text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-150 rounded-xl overflow-hidden">
      <Map
        ref={mapRef}
        mapStyle={mapStyleObj}
        // onLoad={onMapLoad}
        initialViewState={{
          longitude: 90.3563,
          latitude: 23.685,
          zoom: 6,
        }}
      >
        {/* UI MARKERS (STATIC) - Now with IMEI-matched images */}
        {filteredDevices.map((d) => {
          const imei = d.device_data?.imei ?? d.imei;
          const lng = Number(d.lng);
          const lat = Number(d.lat);
          if (!isValidCoord(lng, lat)) return null;

          // Get the vehicle image based on IMEI, fallback to default car icon
          const vehicleImage = vehicleImageMap[imei] || "/car-icon.svg";

          return (
            <Marker
              key={imei}
              longitude={lng}
              latitude={lat}
              anchor="bottom"
              onClick={() => onMarkerClick(d)}
            >
              <div className="relative flex items-center justify-center">
                <img
                  src={`${import.meta.env.VITE_API_URL}${vehicleImage}`}
                  alt={`Vehicle ${imei}`}
                  className="w-9 h-9 cursor-pointer hover:scale-110 object-contain"
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
    </div>
  );
};

export default VehiclesLiveMap;
