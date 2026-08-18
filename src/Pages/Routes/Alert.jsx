import React from "react";
import { AlertTriangle } from "lucide-react";
import useDataQuery from "../../hooks/useDataQuery";

// Alarm codes worth calling out visually - matches the label set decoded in
// vts-backend-katsana/src/services/gpsTcpServer.js (ALARM_CODES). Anything
// not listed here just renders with the default (gray) severity dot.
const RED_CODES = new Set([0x01, 0x03, 0x13, 0x3c]); // SOS, Vibration, Disassemble, Car theft
const AMBER_CODES = new Set([0x04, 0x05, 0x06, 0x32]); // Enter/Exit fence, Overspeed, Pull alarm

function severityDotClass(alarmCode) {
  if (RED_CODES.has(alarmCode)) return "bg-red-500";
  if (AMBER_CODES.has(alarmCode)) return "bg-amber-500";
  return "bg-gray-400";
}

// device_time comes back from the API as a plain "YYYY-MM-DD HH:MM:SS" UTC
// string (mysql2's dateStrings option) with no timezone marker, so it must
// be parsed as UTC explicitly before converting to the customer-facing
// Asia/Dhaka display time - otherwise the browser would parse it as local
// time and shift it by whatever the visitor's own timezone offset is.
function formatAlarmTime(deviceTime) {
  if (!deviceTime) return "-";
  const utcDate = new Date(deviceTime.replace(" ", "T") + "Z");
  if (Number.isNaN(utcDate.getTime())) return deviceTime;
  return utcDate.toLocaleString("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Alert() {
  const { data, isLoading, error } = useDataQuery(
    ["vts-alarms"],
    "/api/vts/customer/alarms",
    true,
    {
      refetchInterval: 10000,
      refetchIntervalInBackground: true,
      staleTime: 0,
    },
  );

  const alarms = Array.isArray(data?.alarms) ? data.alarms : [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        Loading alerts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle size={48} className="text-primary-orange mb-4" />
        <h1 className="text-2xl font-bold mb-2">Alert</h1>
        <p className="text-gray-600">Couldn't load alerts right now. Please try again shortly.</p>
      </div>
    );
  }

  if (alarms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle size={48} className="text-primary-orange mb-4" />
        <h1 className="text-2xl font-bold mb-2">Alert</h1>
        <p className="text-gray-600">No alerts yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-700">Alert</h1>
      <div className="bg-white rounded-lg shadow divide-y divide-gray-100">
        {alarms.map((alarm, idx) => (
          <div
            key={`${alarm.device_id}-${alarm.device_time}-${idx}`}
            className="flex items-center gap-3 px-4 py-3"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full shrink-0 ${severityDotClass(alarm.alarm_code)}`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {alarm.alarm_label}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {alarm.registration_no || alarm.imei}
                {alarm.location_source === "lbs" ? " · approximate location" : ""}
              </p>
            </div>
            <span className="text-xs text-gray-400 shrink-0">
              {formatAlarmTime(alarm.device_time)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
