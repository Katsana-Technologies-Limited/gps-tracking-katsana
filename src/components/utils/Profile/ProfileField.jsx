export function ProfileField({ label, value, icon }) {
  return (
    <div className="p-3 md:p-4 bg-linear-to-br from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-2 text-gray-600 mb-1.5 md:mb-2">
        <span className="text-primary-orange">{icon}</span>
        <span className="text-xs md:text-sm font-medium">{label}</span>
      </div>
      <div className="font-semibold text-sm md:text-base text-[#2c5364] wrap-break-word">
        {value || "-"}
      </div>
    </div>
  );
}
