export const VehicleMarker = ({ count = 1 }) => {
  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      <span className="absolute inset-0 rounded-full bg-blue-400 opacity-30 animate-ping z-0" />
      <div className="relative w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center z-10">
        <img
          src="/icons/rader.png"
          alt="Vehicle"
          className="w-full h-full object-contain"
        />
      </div>
      {count > 1 && (
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow z-20">
          {count}
        </div>
      )}
    </div>
  );
};
