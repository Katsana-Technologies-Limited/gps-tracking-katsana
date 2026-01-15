import React, { useEffect, useRef, useState } from "react";
import bkoigl from "bkoi-gl";
import "bkoi-gl/dist/style/bkoi-gl.css";

const LiveTrackingMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [coords, setCoords] = useState("Initializing…");

  // Mutable refs for animation (state এ রাখলে পারফরম্যান্স স্লো হবে)
  const lastPos = useRef([90.3994, 23.7925]);
  const nextPos = useRef([90.3994, 23.7925]);
  const startTime = useRef(Date.now());
  const routeCoords = useRef([[90.3994, 23.7925]]);
  const animationFrameId = useRef(null);

  const GPS_INTERVAL = 30000; //30s
  const BARIKOI_API_KEY =
    "bkoi_b09a189ca08dce0954d3957cc391e8c7a5d6c78f626e111b6cfec3b551fc1e5f";

  useEffect(() => {
    // Initialize Map
    mapRef.current = new bkoigl.Map({
      container: mapContainerRef.current,
      style: "https://map.barikoi.com/styles/osm-liberty/style.json",
      center: lastPos.current,
      zoom: 14,
      accessToken: BARIKOI_API_KEY,
    });

    const map = mapRef.current;

    map.on("load", async () => {
      // Load Vehicle Icon
      const image = await map.loadImage(
        "https://cdn-icons-png.flaticon.com/512/7893/7893979.png"
      );
      map.addImage("vehicle", image.data, { pixelRatio: 2 });

      // Add Vehicle Source
      map.addSource("vehicle", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "Point", coordinates: lastPos.current },
        },
      });

      // Add Vehicle Layer
      map.addLayer({
        id: "vehicle-layer",
        type: "symbol",
        source: "vehicle",
        layout: {
          "icon-image": "vehicle",
          "icon-size": 0.4,
          "icon-allow-overlap": true,
        },
      });

      // Add Route Source
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates: routeCoords.current },
        },
      });

      // Add Route Layer
      map.addLayer({
        id: "route-layer",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#ef4444",
          "line-width": 4,
        },
      });

      // Start Animation Loop
      animate();
    });

    // Simulated GPS Update Interval
    const gpsUpdateInterval = setInterval(() => {
      lastPos.current = [...nextPos.current];
      nextPos.current = [
        nextPos.current[0] + (Math.random() - 0.5) * 0.01,
        nextPos.current[1] + (Math.random() - 0.5) * 0.008,
      ];
      startTime.current = Date.now();
    }, GPS_INTERVAL);

    // Animation Function
    function animate() {
      const now = Date.now();
      const progress = Math.min((now - startTime.current) / GPS_INTERVAL, 1);

      const lng =
        lastPos.current[0] +
        (nextPos.current[0] - lastPos.current[0]) * progress;
      const lat =
        lastPos.current[1] +
        (nextPos.current[1] - lastPos.current[1]) * progress;
      const current = [lng, lat];

      // Update Vehicle Position
      const vehicleSource = map.getSource("vehicle");
      if (vehicleSource) {
        vehicleSource.setData({
          type: "Feature",
          geometry: { type: "Point", coordinates: current },
        });
      }

      // Update Route Trail
      routeCoords.current.push(current);
      const routeSource = map.getSource("route");
      if (routeSource) {
        routeSource.setData({
          type: "Feature",
          geometry: { type: "LineString", coordinates: routeCoords.current },
        });
      }

      // Smooth Camera Movement
      map.easeTo({
        center: current,
        duration: 0, // Set to 0 because requestAnimationFrame is already handling smooth steps
      });

      setCoords(
        `Lng: ${lng.toFixed(6)}, Lat: ${lat.toFixed(
          6
        )} • ${new Date().toLocaleTimeString()}`
      );

      animationFrameId.current = requestAnimationFrame(animate);
    }

    // Cleanup on unmount
    return () => {
      clearInterval(gpsUpdateInterval);
      cancelAnimationFrame(animationFrameId.current);
      map.remove();
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

      {/* Status Overlay */}
      <div style={styles.statusBox}>
        <h3 style={styles.heading}>
          <span style={styles.liveDot}></span> Live Tracking
        </h3>
        <div style={{ color: "#fff" }}>Vehicle ID: DHK-247</div>
        <div style={styles.coords}>{coords}</div>
      </div>
    </div>
  );
};

// Inline Styles (আপনি চাইলে Tailwind বা CSS ফাইলে নিতে পারেন)
const styles = {
  statusBox: {
    position: "absolute",
    top: "20px",
    left: "20px",
    background: "rgba(15, 23, 42, 0.95)",
    padding: "16px 20px",
    borderRadius: "16px",
    zIndex: 10,
    fontFamily: "system-ui, sans-serif",
    minWidth: "260px",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  },
  heading: {
    margin: "0 0 8px 0",
    fontSize: "16px",
    color: "#60a5fa",
    display: "flex",
    alignItems: "center",
  },
  liveDot: {
    width: "10px",
    height: "10px",
    background: "#10b981",
    borderRadius: "50%",
    display: "inline-block",
    marginRight: "8px",
    boxShadow: "0 0 8px #10b981",
    animation: "pulse 2s infinite",
  },
  coords: {
    fontFamily: "monospace",
    fontSize: "13px",
    marginTop: "8px",
    color: "#e2e8f0",
  },
};

// Add CSS for pulse animation
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  @keyframes pulse {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
    100% { opacity: 1; transform: scale(1); }
  }
`;
document.head.appendChild(styleTag);

export default LiveTrackingMap;
