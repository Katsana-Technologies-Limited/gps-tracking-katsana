export const TrafficToggle = ({ enabled, onToggle }) => {
  return (
    <div
      onClick={() => onToggle(!enabled)}
      className="
          relative w-20 h-8 bg-[#FFFFFF] rounded-md cursor-pointer
          flex items-center justify-between px-2
          text-xs font-semibold select-none shadow-2xl
        "
    >
      {/* Sliding background */}
      <div
        className={`
            absolute top-1 bottom-1 w-[calc(50%-4px)]
            rounded transition-all duration-300 ease-in-out
            bg-orange-500
            ${enabled ? "translate-x-full" : "translate-x-0"}
          `}
      />

      {/* OFF */}
      <span
        className={`z-10 pl-1 transition-colors duration-300 ${
          !enabled ? "text-white" : "text-gray-500"
        }`}
      >
        Off
      </span>

      {/* ON */}
      <span
        className={`z-10  transition-colors duration-300 ${
          enabled ? "text-white" : "text-gray-500"
        }`}
      >
        On
      </span>
    </div>
  );
};
