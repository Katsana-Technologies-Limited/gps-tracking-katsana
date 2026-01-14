import React from "react";

const NearByLocation = ({ vehicleData }) => {
  const lat = vehicleData?.lat?.toFixed(5) || "23.40203";
  const lng = vehicleData?.lng?.toFixed(5) || "91.17074";

  return (
    <div className=" px-1 py-3 w-full max-w-[280px] flex flex-col justify-between relative ">
      {/* Location and Coordinates Part */}
      <div className="z-10">
        <p className="text-[14px] leading-tight text-gray-800 font-medium">
          CEMEC Canteen, Comilla Sadar Dakshin Upazila, Chittagong Division (1
          Km)
        </p>

        <a
          href={`https://www.google.com/maps?q=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-1"
        >
          <p className="text-[13px] text-gray-700 font-normal">
            {lat}, {lng}
          </p>
        </a>

        {/* Subscription Info */}
        <p className="mt-3 text-[13px] text-gray-800">
          <span className="font-bold">Subscription Ends: </span>
          <span>{vehicleData?.expire_date || "15/02/2026"}</span>
        </p>
      </div>

      {/* Background Map Markers Image */}
      <div className="absolute -bottom-10 right-0 left-0 h-16 pointer-events-none opacity-90">
        <img
          src="https://bondste.in/_next/static/media/mapMarkers.f6892e17.png"
          alt="map-markers"
          className="w-full h-full object-contain object-bottom"
        />
      </div>
    </div>
  );
};

export default NearByLocation;
