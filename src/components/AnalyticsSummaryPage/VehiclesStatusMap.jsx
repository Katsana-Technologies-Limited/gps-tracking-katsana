import axios from "axios";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Share2, Printer, Scan } from "lucide-react";
import jsPDF from "jspdf";
import useCustomerVehicle from "../../hooks/useCustomerVehicle";
import useVtsDevices from "../../hooks/useVtsDevices";

const BARIKOI_KEY = import.meta.env.VITE_BARIKOI_API_KEY;
function useBarikoiAddresses(vehicleCoords) {
  const [addresses, setAddresses] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAddresses = useCallback(async () => {
    if (!BARIKOI_KEY) return;
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        Object.entries(vehicleCoords).map(async ([imei, { lat, lng }]) => {
          if (!lat || !lng) return [imei, null];
          try {
            const res = await axios.get(
              `https://barikoi.xyz/v1/api/search/reverse/geocode/${BARIKOI_KEY}/place`,
              { params: { longitude: lng, latitude: lat } }
            );
            return [imei, res.data.place || res.data];
          } catch {
            return [imei, null];
          }
        })
      );
      setAddresses(Object.fromEntries(results));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [vehicleCoords]);

  useEffect(() => {
    if (Object.keys(vehicleCoords).length) {
      fetchAddresses();
    }
    // eslint-disable-next-line
  }, [fetchAddresses]);

  return { addresses, loading, error };
}

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
  const { data: vehiclesData } = useCustomerVehicle();

  // Extract IMEIs from vehiclesData
  const imeis = useMemo(() => {
    if (!vehiclesData || !Array.isArray(vehiclesData)) return [];
    return vehiclesData.map((v) => v.imei).filter(Boolean);
  }, [vehiclesData]);

  // Fetch VTS data for all IMEIs every 10 seconds
  const { data: vtsData } = useVtsDevices(imeis);
  console.log(vtsData);
  // Prepare Barikoi reverse geocode hooks for each vehicle
  const vehicleAddresses = useMemo(() => {
    if (!imeis.length || !vtsData) return {};
    const result = {};
    imeis.forEach((imei) => {
      const vts = vtsData[imei]?.[0];
      if (vts && vts.lat && vts.lng) {
        result[imei] = { lat: vts.lat, lng: vts.lng };
      }
    });
    return result;
  }, [imeis, vtsData]);

  // Use the custom hook to get all addresses
  const { addresses: barikoiAddresses, loading: barikoiLoading } =
    useBarikoiAddresses(vehicleAddresses);

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

    map.on("load", async () => {
      map.addControl(new window.bkoigl.FullscreenControl(), "top-right");
      map.addControl(
        new window.bkoigl.NavigationControl({ showCompass: false }),
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

      // Add a source and layer for each vehicle
      if (imeis.length) {
        imeis.forEach((imei) => {
          map.addSource(`vehicle-${imei}`, {
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
            id: `vehicle-layer-${imei}`,
            type: "symbol",
            source: `vehicle-${imei}`,
            layout: {
              "icon-image": "vehicle",
              "icon-size": 0.4,
              "icon-allow-overlap": true,
            },
          });
        });
      }
    });

    return () => {
      map.remove();
    };
    // eslint-disable-next-line
  }, [satellite, imeis.join(",")]);

  // Update vehicle positions on the map when vtsData changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !vtsData) return;
    imeis.forEach((imei) => {
      const vts = vtsData[imei]?.[0];
      if (vts && vts.lat && vts.lng) {
        const source = map.getSource(`vehicle-${imei}`);
        if (source) {
          source.setData({
            type: "Feature",
            geometry: { type: "Point", coordinates: [vts.lng, vts.lat] },
          });
        }
      }
    });
  }, [vtsData, imeis]);

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

  // console.log(moveHandel);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-140 rounded-2xl overflow-hidden bg-white"
    >
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Show addresses for each vehicle below the map */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-white bg-opacity-90 rounded-xl shadow px-4 py-2 max-w-xl w-fit flex flex-col gap-1 text-xs">
        {imeis.map((imei) => {
          const vts = vtsData?.[imei]?.[0];
          const address = barikoiAddresses?.[imei];
          return (
            <div key={imei} className="flex flex-col gap-0.5">
              <span className="font-semibold">{vts?.name || imei}</span>
              <span>
                Lat: {vts?.lat}, Lng: {vts?.lng}
              </span>
              <span>
                {barikoiLoading
                  ? "Getting address..."
                  : address?.address || address?.address || "No address found"}
              </span>
            </div>
          );
        })}
      </div>
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
