import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../hooks/useAxios";

export default function LogoutButton({ collapsed = false }) {
  const navigate = useNavigate();
  const axiosUrl = useAxios();

  const handleLogout = async () => {
    try {
      await axiosUrl.post("/api/vts/auth/logout");
    } catch (e) {
      console.log(e);
    }
    localStorage.clear();
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      type="button"
      title={collapsed ? "Log Out" : ""}
      className={`flex items-center cursor-pointer rounded-lg transition font-medium
    ${
      collapsed
        ? "py-2.5 text-primary-green hover:bg-[#f5f6fa]"
        : "mt-1 gap-3 px-4 py-2.5 w-full text-[15px] text-primary-green hover:bg-[#f5f6fa]"
    }
  `}
      style={{ fontFamily: "Inter, Arial, Helvetica, sans-serif" }}
    >
      <LogOut size={20} className="text-[#fe8e1c]" />
      {!collapsed && <span className="truncate">Log Out</span>}
    </button>
  );
}
