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
} from "lucide-react";

export const sidebarLinks = [
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
