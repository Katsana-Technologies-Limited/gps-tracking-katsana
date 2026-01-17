export function ProfileField({ label, value, icon }) {
  return (
    <div className="p-4 bg-linear-to-br from-slate-50 to-white rounded-xl border border-slate-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-2 text-slate-500 mb-2">
        <span className="text-[#fe8e1c]">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="font-semibold text-lg text-[#2c5364] wrap-break-word">
        {value || "-"}
      </div>
    </div>
  );
}
