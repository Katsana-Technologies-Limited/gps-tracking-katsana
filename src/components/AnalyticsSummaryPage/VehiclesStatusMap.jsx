import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CiLink } from "react-icons/ci";
import { IoMdPrint } from "react-icons/io";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const carIcon = new L.DivIcon({
  className: "",
  html: `
    <div class="car-marker">
      <span class="car-wave"></span>
      <img src="/icons/vehicle.svg" />
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const vehicles = [
  {
    id: 1,
    lat: 23.8103,
    lng: 90.4125,
    number: "TMV 44837",
    reg: "DM NA 13-0756",
  },
  {
    id: 2,
    lat: 22.3569,
    lng: 91.7832,
    number: "CTG 88321",
    reg: "CTG GA 22-9981",
  },
  {
    id: 3,
    lat: 24.3636,
    lng: 88.6241,
    number: "RAJ 22119",
    reg: "RJ GA 19-3321",
  },
];

// eslint-disable-next-line no-unused-vars
const MapActions = ({ setSatellite }) => {
  const map = useMap();

  return (
    <>
      <div className="absolute bottom-6 right-3 flex flex-col gap-2">
        <button onClick={() => map.zoomIn()} className="map-btn">
          ＋
        </button>
        <button onClick={() => map.zoomOut()} className="map-btn">
          －
        </button>
        <button onClick={() => map.panBy([-100, 0])} className="map-btn">
          ←
        </button>
        <button onClick={() => map.panBy([100, 0])} className="map-btn">
          →
        </button>
      </div>
      <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow flex items-center gap-2 text-sm font-medium">
        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
        Online Vehicles: {vehicles.length}
      </div>
    </>
  );
};

const VehiclesStatusMap = () => {
  const mapRef = useRef(null);
  const [satellite, setSatellite] = useState(false);

  const handleFullscreen = () => {
    const el = mapRef.current;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Map link copied");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      ref={mapRef}
      className="relative w-full h-140 rounded-2xl overflow-hidden bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] z-10"
    >
      <div className="absolute top-3 left-3 flex bg-white rounded-lg shadow overflow-hidden">
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
      <div className="absolute top-3 right-3">
        <button onClick={handleFullscreen} className="map-btn">
          ⛶
        </button>
      </div>
      <div>
        <div className="absolute bottom-6 left-3 flex flex-col gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#95F0B3]" />
          <div className="w-8 h-8 rounded-xl bg-[#95D8F0]" />
          <div className="w-8 h-8 rounded-xl bg-[#F0C695]" />
          <div className="w-8 h-8 rounded-xl bg-[#F09D95]" />
          <div className="w-8 h-8 rounded-xl bg-[#787878]" />
        </div>
        <div className="absolute bottom-6 left-15 flex gap-2 ">
          <button onClick={handleShare} className="map-btn">
            <CiLink />
          </button>
          <button onClick={handlePrint} className="map-btn">
            <IoMdPrint />
          </button>
        </div>
      </div>
      <MapContainer
        center={[23.685, 90.3563]}
        zoom={7}
        scrollWheelZoom
        dragging
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url={
            satellite
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />
        <MapActions setSatellite={setSatellite} />
        {vehicles.map((v) => (
          <Marker key={v.id} position={[v.lat, v.lng]} icon={carIcon}>
            <Popup>
              <div className="w-65">
                <div className="bg-yellow-400 px-3 py-2 rounded font-semibold flex justify-between">
                  {v.number}
                  <img src="/icons/vehicle.svg" className="w-6 h-6" />
                </div>
                <div className="p-2 text-xs text-gray-600">
                  {v.reg}
                  <br />
                  Status: Online
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <style>{`
        .map-btn{
          background:white;
          border-radius:8px;
          padding:6px;
          box-shadow:0 2px 6px rgba(0,0,0,.15);
        }
        .car-marker{
          position:relative;
          width:40px;
          height:40px;
        }
        .car-marker img{
          width:32px;
          height:32px;
          position:relative;
        }
        .car-wave{
          position:absolute;
          width:40px;
          height:40px;
          border-radius:999px;
          background:rgba(255,165,0,.3);
          animation:pulse 1.6s infinite;
          top:0;
          left:0;
        }
        @keyframes pulse{
          0%{transform:scale(.6);opacity:1}
          100%{transform:scale(1.6);opacity:0}
        }
      `}</style>
    </div>
  );
};

export default VehiclesStatusMap;
