/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart2,
  Car,
  FileText,
  MapPin,
  AlertTriangle,
  Wrench,
  LifeBuoy,
  CreditCard,
  Users,
  Bot,
  LogOut,
} from "lucide-react";

const sidebarLinks = [
  { to: "/dashboard", label: "Analytics & Summary", icon: BarChart2 },
  { to: "/vehicles", label: "Vehicles", icon: Car },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/drive-mark", label: "Drive Mark", icon: MapPin },
  { to: "/alert", label: "Alert", icon: AlertTriangle },
  { to: "/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/support", label: "Support", icon: LifeBuoy },
  { to: "/payment", label: "Payment", icon: CreditCard },
  { to: "/user-management", label: "User Management", icon: Users },
  { to: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { to: "/logout", label: "Log Out", icon: LogOut },
];

export default function TrackingSidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <aside
      className="fixed left-0 top-0 h-[calc(100vh-32px)] w-64 bg-white rounded-2xl shadow-lg flex flex-col items-center py-8 px-2 mt-4 mb-4 ml-4 font-['Inter','Arial','Helvetica',sans-serif'] z-30"
      style={{ minWidth: 220, maxWidth: 260 }}
    >
      <div className="flex flex-col items-center mb-8 w-full">
        <img
          src="/katsana-logo.png"
          alt="Katsana Logo"
          className="w-28 h-10 object-contain mb-2"
        />
        <div className="text-primary-green font-semibold text-base text-center w-full">
          Nidal Nabi Chowdhury
        </div>
      </div>
      <nav className="flex flex-col gap-1 w-full">
        {sidebarLinks.map(({ to, label, icon: Icon }) => {
          const isActive =
            pathname === to || (to === "/dashboard" && pathname === "/");
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition font-medium text-[15px] ${
                isActive
                  ? "bg-[#fe8e1c] text-white shadow-sm"
                  : "text-primary-green hover:bg-[#f5f6fa]"
              }`}
              style={{ fontFamily: "Inter, Arial, Helvetica, sans-serif" }}
            >
              <Icon
                size={20}
                className={isActive ? "text-white" : "text-[#fe8e1c]"}
              />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
