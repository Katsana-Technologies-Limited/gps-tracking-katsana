import { useEffect, useRef, useState } from "react";
import { Share2, Printer, Scan } from "lucide-react";
import jsPDF from "jspdf";

const barikoiAPiKey = import.meta.env.VITE_BARIKOI_API_KEY;
const MAP_STYLE = "https://map.barikoi.com/styles/barikoi-light/style.json";
const SATELLITE_STYLE =
  "https://map.barikoi.com/styles/barikoi_satellite/style.json";

const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.src = src;
  });

const RadialBtn = ({ children, onClick, style }) => (
  <button
    onClick={onClick}
    className={`absolute ${style} w-10 h-10 z-10 rounded-full bg-white shadow-md
        flex items-center justify-center text-lg font-semibold
        hover:scale-110 transition-transform duration-200`}
  >
    {children}
  </button>
);

const VehiclesStatusMap = () => {
  const mapContainerRef = useRef(null);
  const wrapperRef = useRef(null);
  const mapRef = useRef(null);

  const [satellite, setSatellite] = useState(false);
  const [moveHandel, setMoveHandel] = useState(false);

  /* ================= MAP INIT (ONCE) ================= */
  useEffect(() => {
    if (!window.bkoigl) return;

    const map = new window.bkoigl.Map({
      container: mapContainerRef.current,
      style: satellite ? SATELLITE_STYLE : MAP_STYLE,
      center: [90.3994, 23.7925],
      zoom: 14,
      accessToken: barikoiAPiKey,
      preserveDrawingBuffer: true,
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Map link copied");
  };

  const handlePrint = async () => {
    const map = mapRef.current;
    if (!map) return;

    // wait one frame
    await new Promise((r) => setTimeout(r, 200));

    const canvas = map.getCanvas();
    const mapImage = canvas.toDataURL("image/png");

    const logo = await loadImage("/public/logo.png");

    const width = canvas.width;
    const headerHeight = 80;
    const height = canvas.height + headerHeight;

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [width, height],
    });

    // header
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, width, headerHeight, "F");

    pdf.addImage(logo, "PNG", 20, 15, 120, 40);
    pdf.setFontSize(14);
    pdf.text("Live Vehicle Tracking Map", width / 2, 45, { align: "center" });

    // map
    pdf.addImage(mapImage, "PNG", 0, headerHeight, width, canvas.height);

    // iframe print (same page)
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    iframe.src = pdf.output("bloburl");
    iframe.onload = () => iframe.contentWindow.print();
  };

  const toggleMove = () => {
    setMoveHandel((prev) => !prev);
  };

  console.log(moveHandel);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-140 rounded-2xl overflow-hidden bg-white"
    >
      <div ref={mapContainerRef} className="w-full h-full" />
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
      <button
        onClick={() => {
          const el = wrapperRef.current;
          if (!document.fullscreenElement) {
            el.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        }}
        className="absolute top-3 right-5 z-20 w-11 h-11 bg-white rounded-full p-2 shadow-md hover:scale-105 transition flex justify-center items-center"
      >
        <Scan size={21} />
      </button>
      <div className="absolute bottom-20 right-17 z-20">
        <button
          onClick={toggleMove}
          className={`relative z-30 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ease-out ${
            moveHandel ? "rotate-45 scale-110" : "rotate-0 scale-100"
          }
  `}
          aria-pressed={moveHandel}
        >
          <Scan size={22} />
        </button>

        {/* RADIAL BUTTONS (ALWAYS RENDERED) */}
        <div
          className={`absolute inset-0 z-10 transition-all duration-300 ease-out
    ${
      moveHandel
        ? "scale-100 opacity-100 pointer-events-auto"
        : "scale-75 opacity-0 pointer-events-none"
    }
  `}
        >
          {/* Zoom In */}
          <RadialBtn
            style="top-[-60px] left-1/2 -translate-x-1/2"
            onClick={zoomIn}
          >
            +
          </RadialBtn>

          {/* Zoom Out */}
          <RadialBtn
            style="bottom-[-60px] left-1/2 -translate-x-1/2"
            onClick={zoomOut}
          >
            −
          </RadialBtn>

          {/* Left */}
          <RadialBtn
            style="left-[-60px] top-1/2 -translate-y-1/2"
            onClick={() => mapRef.current?.panBy([-120, 0])}
          >
            ←
          </RadialBtn>

          {/* Right */}
          <RadialBtn
            style="right-[-60px] top-1/2 -translate-y-1/2"
            onClick={() => mapRef.current?.panBy([120, 0])}
          >
            →
          </RadialBtn>

          {/* Top */}
          <RadialBtn
            style="top-[-42px] right-[-42px]"
            onClick={() => mapRef.current?.panBy([0, -120])}
          >
            ↑
          </RadialBtn>
          <RadialBtn
            style="bottom-[-42px] right-[-42px]"
            onClick={() => mapRef.current?.panBy([0, 120])}
          >
            ↓
          </RadialBtn>
        </div>
      </div>
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
      {/* <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 bg-white px-4 py-2 rounded-xl shadow text-sm">
        <span className="w-2.5 h-2.5 bg-green-500 inline-block rounded-full animate-pulse mr-2" />
        Live Vehicle Tracking
        <div id="coords" className="text-xs text-gray-500 mt-1">
          Waiting for update...
        </div>
      </div> */}
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
