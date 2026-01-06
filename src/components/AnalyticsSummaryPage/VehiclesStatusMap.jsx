import { useEffect, useRef, useState } from "react";
import { Share2, Printer, Scan } from "lucide-react";

const barikoiAPiKey = import.meta.env.VITE_BARIKOI_API_KEY;
const MAP_STYLE = "https://map.barikoi.com/styles/barikoi-light/style.json";
const SATELLITE_STYLE =
  "https://map.barikoi.com/styles/barikoi-dark-mode/style.json";

const VehiclesStatusMap = () => {
  const mapContainerRef = useRef(null);
  const wrapperRef = useRef(null);
  const mapRef = useRef(null);

  const [satellite, setSatellite] = useState(false);

  /* ================= MAP INIT (ONCE) ================= */
  useEffect(() => {
    if (!window.bkoigl) return;

    const map = new window.bkoigl.Map({
      container: mapContainerRef.current,
      style: satellite ? SATELLITE_STYLE : MAP_STYLE,
      center: [90.3994, 23.7925],
      zoom: 14,
      accessToken: barikoiAPiKey,
    });

    mapRef.current = map;

    // ✅ Barikoi official controls
    map.on("load", async () => {
      map.addControl(new window.bkoigl.FullscreenControl(), "top-right");
      map.addControl(
        new window.bkoigl.NavigationControl({
          showCompass: false,
        }),
        "top-right"
      );
      map.addControl(
        new window.bkoigl.ScaleControl({ unit: "metric" }),
        "bottom-left"
      );

      // Vehicle icon
      const img = await map.loadImage(
        "https://cdn-icons-png.flaticon.com/512/7893/7893979.png"
      );
      map.addImage("vehicle", img.data, { pixelRatio: 2 });

      map.addSource("vehicle", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [90.3994, 23.7925],
          },
        },
      });

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
    });

    // 🔁 Simulated live movement
    let lng = 90.3994;
    let lat = 23.7925;

    const interval = setInterval(() => {
      lng += (Math.random() - 0.5) * 0.01;
      lat += (Math.random() - 0.5) * 0.008;

      map.getSource("vehicle")?.setData({
        type: "Feature",
        geometry: { type: "Point", coordinates: [lng, lat] },
      });

      map.easeTo({ center: [lng, lat], duration: 1500 });

      const el = document.getElementById("coords");
      if (el)
        el.innerText = `Lng: ${lng.toFixed(5)}, Lat: ${lat.toFixed(
          5
        )} • ${new Date().toLocaleTimeString()}`;
    }, 2000);

    return () => {
      clearInterval(interval);
      map.remove();
    };
  }, [satellite]);

  /* ---------------- Actions ---------------- */
  const map = () => mapRef.current;

  const zoomIn = () => map()?.zoomIn();
  const zoomOut = () => map()?.zoomOut();
  const panLeft = () => map()?.panBy([-120, 0]);
  const panRight = () => map()?.panBy([120, 0]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Map link copied");
  };

  const handlePrint = () => window.print();

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-[560px] rounded-2xl overflow-hidden bg-white"
    >
      {/* MAP */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* TOP LEFT: Map / Satellite */}
      <div className="absolute top-3 left-3 z-10 bg-white rounded-lg shadow flex overflow-hidden">
        <button
          onClick={() => setSatellite(false)}
          className={`px-4 py-1 text-sm ${
            !satellite && "bg-gray-100 font-medium"
          }`}
        >
          Map
        </button>
        <button
          onClick={() => setSatellite(true)}
          className={`px-4 py-1 text-sm ${
            satellite && "bg-gray-100 font-medium"
          }`}
        >
          Satellite
        </button>
      </div>

      {/* BOTTOM RIGHT: ACTIONS */}
      <div className="absolute bottom-6 right-3 z-10 flex flex-col gap-2">
        <button className="bg-white rounded-full p-2  font-extrabold ">
          <Scan size={21} className="rotate-45" />
        </button>
        {/* <button onClick={zoomIn} className="map-btn">
          ＋
        </button>
        <button onClick={zoomOut} className="map-btn">
          －
        </button>
        <button onClick={panLeft} className="map-btn">
          ←
        </button>
        <button onClick={panRight} className="map-btn">
          →
        </button> */}
      </div>

      {/* BOTTOM LEFT: Colors + Share */}
      {/* Bottom left */}
      <div>
        <div className="absolute bottom-6 left-3 z-10  flex flex-col gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#95F0B3]" />
          <div className="w-8 h-8 rounded-xl bg-[#95D8F0]" />
          <div className="w-8 h-8 rounded-xl bg-[#F0C695]" />
          <div className="w-8 h-8 rounded-xl bg-[#F09D95]" />
          <div className="w-8 h-8 rounded-xl bg-[#787878]" />
        </div>
        <div className="absolute bottom-6 left-15 z-10 flex gap-2 h-9 ">
          <button
            onClick={handleShare}
            className="flex gap-2 justify-center items-center bg-amber-50 rounded-2xl px-3"
          >
            <Share2 size={21} /> <span>Share</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex gap-2 justify-center items-center bg-amber-50 rounded-2xl px-3"
          >
            <Printer size={21} /> <span>Print</span>
          </button>
        </div>
      </div>

      {/* STATUS */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 bg-white px-4 py-2 rounded-xl shadow text-sm">
        <span className="w-2.5 h-2.5 bg-green-500 inline-block rounded-full animate-pulse mr-2" />
        Live Vehicle Tracking
        <div id="coords" className="text-xs text-gray-500 mt-1">
          Waiting for update...
        </div>
      </div>

      {/* STYLE */}
      <style>{`
        .map-btn{
          background:white;
          border-radius:8px;
          padding:6px;
          box-shadow:0 2px 6px rgba(0,0,0,.15);
        }
      `}</style>
    </div>
  );
};

export default VehiclesStatusMap;
