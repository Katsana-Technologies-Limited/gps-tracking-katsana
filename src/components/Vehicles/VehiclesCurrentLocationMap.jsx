import React, { useRef, useEffect } from "react";
import { Map, Marker } from "react-bkoi-gl";
// import maplibregl from "maplibre-gl";
import "bkoi-gl/dist/style/bkoi-gl.css";
import "react-bkoi-gl/styles";
import useVtsAllDevices from "../../hooks/useVtsAllDevices";

const BARIKOI_KEY = import.meta.env.VITE_BARIKOI_API_KEY;
const MAP_STYLE = `https://map.barikoi.com/styles/osm-liberty/style.json?key=${BARIKOI_KEY}`;

const GPS_DURATION = 30000; // 30s

const VehiclesLiveMap = () => {
  const mapRef = useRef(null);

  // selected vehicle imei
  const selectedImeiRef = useRef(null);

  // animation refs
  const lastPos = useRef({});
  const nextPos = useRef({});
  const startTime = useRef({});
  const routeCoords = useRef({});
  const rafId = useRef(null);

  const { filteredDevices } = useVtsAllDevices();

  /* ---------------- MAP LOAD ---------------- */
  const onMapLoad = async (e) => {
    const map = e.target;

    // load icon
    if (!map.hasImage("vehicle-icon")) {
      const img = await map.loadImage(
        "https://cdn-icons-png.flaticon.com/512/7893/7893979.png"
      );
      map.addImage("vehicle-icon", img.data, { pixelRatio: 2 });
    }
  };

  /* ---------------- INIT GEOJSON ---------------- */
  const initSources = (device) => {
    const map = mapRef.current.getMap();
    const imei = device.device_data?.imei ?? device.imei;

    if (!map.getSource("active-vehicle")) {
      map.addSource("active-vehicle", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [device.lng, device.lat],
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

    lastPos.current[imei] = [device.lng, device.lat];
    nextPos.current[imei] = [device.lng, device.lat];
    routeCoords.current[imei] = [[device.lng, device.lat]];
  };

  /* ---------------- MARKER CLICK ---------------- */
  const onMarkerClick = (device) => {
    const imei = device.device_data?.imei ?? device.imei;
    selectedImeiRef.current = imei;

    initSources(device);

    mapRef.current.flyTo({
      center: [device.lng, device.lat],
      zoom: 16,
      speed: 1.5,
      curve: 1.4,
    });
  };

  /* ---------------- GPS UPDATE (30s) ---------------- */
  useEffect(() => {
    if (!selectedImeiRef.current) return;

    const device = filteredDevices.find(
      (d) => (d.device_data?.imei ?? d.imei) === selectedImeiRef.current
    );

    if (!device) return;

    const imei = selectedImeiRef.current;
    const lng = Number(device.lng);
    const lat = Number(device.lat);

    lastPos.current[imei] = [...nextPos.current[imei]];
    nextPos.current[imei] = [lng, lat];
    startTime.current[imei] = Date.now();

    routeCoords.current[imei].push([lng, lat]);

    const map = mapRef.current.getMap();
    map.getSource("active-route")?.setData({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: routeCoords.current[imei],
      },
    });
  }, [filteredDevices]);

  /* ---------------- SMOOTH ANIMATION ---------------- */
  useEffect(() => {
    const animate = () => {
      const imei = selectedImeiRef.current;
      if (!imei || !startTime.current[imei]) {
        rafId.current = requestAnimationFrame(animate);
        return;
      }

      const now = Date.now();
      const t = Math.min((now - startTime.current[imei]) / GPS_DURATION, 1);

      const [lng1, lat1] = lastPos.current[imei];
      const [lng2, lat2] = nextPos.current[imei];

      const lng = lng1 + (lng2 - lng1) * t;
      const lat = lat1 + (lat2 - lat1) * t;

      const map = mapRef.current.getMap();
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

  /* ---------------- RENDER ---------------- */
  return (
    <div className="w-full h-150 rounded-xl overflow-hidden">
      <Map
        ref={mapRef}
        mapStyle={MAP_STYLE}
        onLoad={onMapLoad}
        initialViewState={{
          longitude: 90.3563,
          latitude: 23.685,
          zoom: 6,
        }}
      >
        {/* UI MARKERS (STATIC) */}
        {filteredDevices.map((d) => {
          const imei = d.device_data?.imei ?? d.imei;
          return (
            <Marker
              key={imei}
              longitude={d.lng}
              latitude={d.lat}
              anchor="bottom"
              onClick={() => onMarkerClick(d)}
            >
              <img
                src="/car-icon.svg"
                className="w-9 h-9 cursor-pointer hover:scale-110"
              />
            </Marker>
          );
        })}
      </Map>
    </div>
  );
};

export default VehiclesLiveMap;
