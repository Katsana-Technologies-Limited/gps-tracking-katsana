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
  {
    to: "/dashboard/reports",
    label: "Reports",
    icon: FileText,
    subroutes: [
      {
        to: "/dashboard/reports/monthly-distance",
        label: "Monthly Distance Report",
      },
      {
        to: "/dashboard/reports/hourly-distance",
        label: "Hourly Distance Report",
      },
      {
        to: "/dashboard/reports/daily-distance",
        label: "Daily Distance Report",
      },
      { to: "/dashboard/reports/location", label: "Location Report" },
      { to: "/dashboard/reports/speed", label: "Speed Report" },
      { to: "/dashboard/reports/engine", label: "Engine Report" },
      { to: "/dashboard/reports/trip", label: "Trip Report" },
      { to: "/dashboard/reports/fuel", label: "Fuel Report" },
      { to: "/dashboard/reports/last-location", label: "Last Location Report" },
      {
        to: "/dashboard/reports/daily-live-status",
        label: "Daily Live Status",
      },
      { to: "/dashboard/reports/monthly-kpl-cost", label: "Monthly KPL Cost" },
      { to: "/dashboard/reports/vehicle-activity", label: "Vehicle Activity" },
      {
        to: "/dashboard/reports/monthly-model-summary",
        label: "Monthly Model Summary",
      },
    ],
  },
  {
    to: "/dashboard/drive-mark",
    label: "Drive Mark",
    icon: MapPin,
    subroutes: [
      { to: "/dashboard/drive-mark/daily-analytics", label: "Daily Analytics" },
      {
        to: "/dashboard/drive-mark/monthly-analytics",
        label: "Monthly Analytics",
      },
      { to: "/dashboard/drive-mark/driving-hazard", label: "Driving Hazard" },
      { to: "/dashboard/drive-mark/vehicle", label: "Vehicle" },
      {
        to: "/dashboard/drive-mark/monthly-drive-health",
        label: "Monthly Drive Health",
      },
      {
        to: "/dashboard/drive-mark/driving-hour-report",
        label: "Driving Hour Report",
      },
    ],
  },
  {
    to: "/dashboard/alert",
    label: "Alert",
    icon: AlertTriangle,
    subroutes: [
      { to: "/dashboard/alert/overspeed", label: "Overspeed Alerts" },
      {
        to: "/dashboard/alert/harsh-acceleration",
        label: "Harsh Acceleration Alerts",
      },
      { to: "/dashboard/alert/harsh-brake", label: "Harsh Brake Alerts" },
      { to: "/dashboard/alert/panic", label: "Panic Alerts" },
      {
        to: "/dashboard/alert/driving-fatigue",
        label: "Driving Fatigue Alerts",
      },
      { to: "/dashboard/alert/offline", label: "Offline Alerts" },
      { to: "/dashboard/alert/disconnection", label: "Disconnection Alerts" },
      { to: "/dashboard/alert/geo-fence", label: "Geo Fence Alerts" },
      { to: "/dashboard/alert/long-runtime", label: "Long Runtime Alert" },
      { to: "/dashboard/alert/legal", label: "Legal Alerts" },
      { to: "/dashboard/alert/management", label: "Alert Management" },
      { to: "/dashboard/alert/summary", label: "Alert Summary" },
    ],
  },
  {
    to: "/dashboard/maintenance",
    label: "Maintenance",
    icon: Wrench,
    subroutes: [
      { to: "/dashboard/maintenance/list", label: "Maintenance List" },
      { to: "/dashboard/maintenance/create", label: "Create Maintenance" },
    ],
  },
  {
    to: "/dashboard/support",
    label: "Support",
    icon: LifeBuoy,
    subroutes: [
      { to: "/dashboard/support/vehicle-profiles", label: "Vehicle Profiles" },
      { to: "/dashboard/support/vehicle-group", label: "Vehicle Group" },
      { to: "/dashboard/support/device-details", label: "Device Details" },
      { to: "/dashboard/support/support-ticket", label: "Support Ticket" },
    ],
  },
  { to: "/dashboard/payment", label: "Payment", icon: CreditCard },
  {
    to: "/dashboard/user-management",
    label: "User Management",
    icon: Users,
    subroutes: [
      { to: "/dashboard/user-management/your-profile", label: "Your Profile" },
      { to: "/dashboard/user-management/sub-admin", label: "Sub-Admin" },
      { to: "/dashboard/user-management/guest-user", label: "Guest User" },
      {
        to: "/dashboard/user-management/guest-user-logs",
        label: "Guest User Logs",
      },
    ],
  },
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
      className="fixed lg:left-4 top-0 bottom-0 h-auto w-68 lg:w-60 2xl:w-80 bg-white rounded-2xl flex flex-col items-center py-8 pl-2 mr-2 mt-4 mb-4 z-30 font-['Inter','Arial','Helvetica',sans-serif']"
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
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition font-medium text-[15px] w-full cursor-pointer ${
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
                  <ul className="pl-10 py-2 flex flex-col gap-1">
                    {subroutes.map((sub) => {
                      const isSubRouteActive = pathname.startsWith(sub.to);
                      return (
                        <li key={sub.to} className="flex items-center">
                          <span
                            className="text-[#fe8e1c] text-lg mr-2"
                            style={{ lineHeight: "1" }}
                          >
                            &#8226;
                          </span>
                          <Link
                            to={sub.to}
                            className={`block px-0 py-1.5 rounded-md text-[15px] transition font-medium ${
                              isSubRouteActive
                                ? "text-[#fe8e1c] font-bold bg-transparent"
                                : "text-gray-700 hover:text-[#fe8e1c]"
                            }`}
                            style={{ minWidth: 0 }}
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
