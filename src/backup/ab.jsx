// ... (বাকি কোড অপরিবর্তিত)

{
  mode !== "CLUSTER" &&
    onlineDevices.map((v) => {
      const id = v.device_data?.imei ?? v.id;
      const waveColor = getVehicleWaveColor(v);

      return (
        <Marker key={id} longitude={v.lng} latitude={v.lat} anchor="center">
          <div
            className="relative flex items-center justify-center cursor-pointer"
            onClick={() => {
              setSelectedVehicleId((prev) => {
                if (prev === id) return null;
                flyToVehicle(v);
                return id;
              });
            }}
          >
            {/* ১. Solid Round Circle (গাড়ির পেছনে থাকবে) */}
            <div
              className="car-status-circle"
              style={{ backgroundColor: waveColor }}
            ></div>

            {/* ২. 🌊 Dynamic Wave Animation (সার্কেলের নিচ থেকে বের হবে) */}
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

            {/* ৩. 🚗 Vehicle Icon (সবার উপরে) */}
            <img
              src="/car-icon.svg"
              className="w-10 h-10 z-10 hover:scale-110 transition-transform duration-300"
              alt="car"
            />

            {/* 🔥 CARD POPUP */}
            {selectedVehicleId === id && (
              <div className="absolute bottom-[130%] left-1/2 -translate-x-1/2 z-50">
                <VehicleInfoCard vehicle={selectedVehicleFUll} />
                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[15px] border-t-white mx-auto -mt-1 shadow-xl"></div>
              </div>
            )}
          </div>
        </Marker>
      );
    });
}

// ... (বাকি কোড অপরিবর্তিত)
