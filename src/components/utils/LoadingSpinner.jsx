import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white/90">
    <Loader2 className="h-8 w-8 animate-spin text-[#4880ba]" />
    <span className="text-sm text-slate-500">Loading...</span>
  </div>
);

export default LoadingSpinner;
