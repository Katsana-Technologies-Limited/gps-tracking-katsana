/* eslint-disable no-unused-vars */
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
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import LogoutButton from "./LogoutButton";

const sidebarLinks = [
  { to: "/dashboard", label: "Analytics & Summary", icon: BarChart2 },
  {
    to: "/dashboard/vehicles",
    label: "Vehicles",
    icon: Car,
    subroutes: [
      { to: "/dashboard/vehicles/dashboard", label: "Dashboard" },
      { to: "/dashboard/vehicles/current-location", label: "Current Location" },
      { to: "/dashboard/vehicles/vehicle-route", label: "Vehicle Route" },
      { to: "/dashboard/vehicles/vehicle-alerts", label: "Vehicle Alerts" },
      { to: "/dashboard/vehicles/find-help", label: "Find Help" },
      {
        to: "/dashboard/vehicles/location-share-list",
        label: "Location Share List",
      },
      { to: "/dashboard/vehicles/route-share-list", label: "Route Share List" },
      { to: "/dashboard/vehicles/geo-fence", label: "Geo Fence" },
    ],
  },
  { to: "/dashboard/reports", label: "Reports", icon: FileText },
  { to: "/dashboard/drive-mark", label: "Drive Mark", icon: MapPin },
  { to: "/dashboard/alert", label: "Alert", icon: AlertTriangle },
  { to: "/dashboard/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/dashboard/support", label: "Support", icon: LifeBuoy },
  { to: "/dashboard/payment", label: "Payment", icon: CreditCard },
  { to: "/dashboard/user-management", label: "User Management", icon: Users },
  { to: "/dashboard/ai-assistant", label: "AI Assistant", icon: Bot },
];

import React, { useState, useRef, useEffect } from "react";

export default function TrackingSidebar() {
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState({});
  const navRef = useRef(null);

  // Expand Vehicles if a subroute is active
  useEffect(() => {
    sidebarLinks.forEach((link) => {
      if (link.subroutes) {
        if (
          link.subroutes.some((sub) => pathname.startsWith(sub.to)) ||
          pathname === link.to
        ) {
          setExpanded((prev) => ({ ...prev, [link.to]: true }));
        }
      }
    });
  }, [pathname]);

  const handleExpand = (to) => {
    setExpanded((prev) => ({ ...prev, [to]: !prev[to] }));
  };

  return (
    <aside
      className="fixed left-0 top-0 h-[calc(100vh-32px)] w-80 lg:w-68 2xl:w-80 bg-white rounded-2xl shadow-lg flex flex-col items-center py-8 px-2 mt-4 mb-4 ml-4 z-30 font-['Inter','Arial','Helvetica',sans-serif']"
      style={{ minWidth: 240, maxWidth: 340 }}
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
      <nav
        className="flex flex-col gap-1 w-full overflow-y-auto scrollbar-thin pr-1"
        style={{ maxHeight: "calc(100vh - 220px)", scrollbarGutter: "stable" }}
        ref={navRef}
      >
        {sidebarLinks.map(({ to, label, icon: Icon, subroutes }) => {
          const isActive =
            pathname === to || (to === "/dashboard" && pathname === "/");
          if (subroutes) {
            const isExpanded = expanded[to];
            const isSubActive = subroutes.some((sub) =>
              pathname.startsWith(sub.to)
            );
            return (
              <div key={to} className="w-full">
                <button
                  type="button"
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition font-medium text-[15px] w-full ${
                    isSubActive || isExpanded
                      ? "bg-[#fff7e6] text-[#222] shadow-sm"
                      : "text-primary-green hover:bg-[#f5f6fa]"
                  }`}
                  style={{ fontFamily: "Inter, Arial, Helvetica, sans-serif" }}
                  onClick={() => handleExpand(to)}
                  aria-expanded={isExpanded}
                >
                  <Icon
                    size={20}
                    className={
                      isSubActive ? "text-[#fe8e1c]" : "text-[#fe8e1c]"
                    }
                  />
                  <span className="truncate font-semibold">{label}</span>
                  <span className="ml-auto">
                    {isExpanded ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: isExpanded ? subroutes.length * 38 + 16 : 0,
                    opacity: isExpanded ? 1 : 0,
                  }}
                >
                  <ul className="pl-8 py-2 flex flex-col gap-1">
                    {subroutes.map((sub) => {
                      const isSubRouteActive = pathname.startsWith(sub.to);
                      return (
                        <li key={sub.to}>
                          <Link
                            to={sub.to}
                            className={`block px-2 py-1.5 rounded-md text-[15px] transition font-medium ${
                              isSubRouteActive
                                ? "text-[#fe8e1c] font-bold bg-transparent"
                                : "text-gray-700 hover:text-[#fe8e1c]"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          }
          // Normal sidebar link
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
      <LogoutButton />
    </aside>
  );
}
