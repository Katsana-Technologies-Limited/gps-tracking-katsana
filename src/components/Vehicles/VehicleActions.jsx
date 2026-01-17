import { Link } from "react-router-dom";

const VehicleActions = ({ vehicle }) => {
  const identifier = vehicle?.imei || "865784056494464";

  const actions = [
    {
      label: "Map",
      title: "Location Report",
      path: `/reports/location?identifier=${identifier}`,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      label: "History",
      title: "Hourly Distance Report",
      path: `/reports/distance-report/hourly?identifier=${identifier}`,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Engine",
      title: "Engine Report",
      path: `/reports/engine?identifier=${identifier}`,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      label: "Speed",
      title: "Over Speed Report",
      path: `/activity/alerts/overspeed?identifier=${identifier}`,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      label: "Route",
      title: "Vehicle Route",
      path: `/location/vehicle-route?identifier=${identifier}`,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="px-1 py-3 grid grid-cols-5 gap-2">
        {actions.map((action, index) => (
          <div key={index} className="relative group flex justify-center">
            {/* 💬 Tooltip (White BG, Black Text) */}
            <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
              <span className="relative z-10 p-2 text-[10px] font-bold leading-none text-black whitespace-nowrap bg-white shadow-lg rounded-md border border-gray-100">
                {action.title}
              </span>
              {/* Tooltip Arrow */}
              <div className="w-3 h-3 -mt-2 rotate-45 bg-white border-r border-b border-gray-100"></div>
            </div>

            {/* 🔗 Action Link */}
            <Link
              to={action.path}
              className="w-full flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-gray-400 group-hover:text-orange-500 transition-colors">
                {action.icon}
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="px-2 text-right">
        <p className="text-[11px] text-slate-400 font-medium">
          Last Engine On: 14 Jan, 2026 10:39 am | 0d 2h 0m 55s
        </p>
      </div>
    </div>
  );
};

export default VehicleActions;

// {
// Location Report
// Hourly Distance Report
// Engine Report
// over Speed Report
// Vehicle Route

// }
