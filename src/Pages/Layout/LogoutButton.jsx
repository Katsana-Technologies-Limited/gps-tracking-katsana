import { LogOut } from "lucide-react";
import { useAxios } from "../../hooks/useAxios";

export default function LogoutButton() {
  const axiosUrl = useAxios();
  const handleLogout = async () => {
    try {
      await axiosUrl.post("/api/vts/auth/logout");
    } catch (e) {
      console.log(e);
    }
    localStorage.clear();
    window.location.href = "/";
  };
  return (
    <button
      onClick={handleLogout}
      className="flex mt-1 items-center gap-3 cursor-pointer px-4 py-2.5 rounded-lg transition font-medium text-[15px] w-full text-primary-green hover:bg-[#f5f6fa]"
      style={{ fontFamily: "Inter, Arial, Helvetica, sans-serif" }}
      tabIndex={0}
    >
      <LogOut size={20} className="text-[#fe8e1c]" />
      <span className="truncate">Log Out</span>
    </button>
  );
}
