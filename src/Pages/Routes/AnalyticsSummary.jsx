import "leaflet/dist/leaflet.css";
import TraveledDistance from "../../components/AnalyticsSummaryPage/TraveledDistance";
import CounterVehicles from "../../components/AnalyticsSummaryPage/CounterVehicles";
import VehiclesStatusOption from "../../components/AnalyticsSummaryPage/VehiclesStatusOption";
import VehiclesStatusMap from "../../components/AnalyticsSummaryPage/VehiclesStatusMap";
import AlertsSummaryNumberChart from "../../components/AnalyticsSummaryPage/AlertsSummaryNumberChart";
import AlertsSummaryBarChart from "../../components/AnalyticsSummaryPage/AlertsSummaryBarChart";

const Card = ({ children, className = "" }) => (
  <div
    className={`${className} bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-3`}
  >
    {children}
  </div>
);

const AnalyticsSummary = () => {
  return (
    <div className=" min-h-screen">
      <h1 className="text-lg font-medium text-gray-700 mb-4">
        Analytics And Summary
      </h1>

      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-11 gap-5 mb-5">
        <Card className="col-span-4">
          <TraveledDistance />
        </Card>
        <Card className="col-span-4">
          <CounterVehicles />
        </Card>
        <Card className="col-span-3 h-85">
          <VehiclesStatusOption />
        </Card>
      </div>

      {/* Map */}
      <Card className="mb-5 p-0 overflow-hidden">
        <VehiclesStatusMap />
      </Card>

      {/* Bottom cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <AlertsSummaryNumberChart />
        </Card>
        <Card>
          <AlertsSummaryBarChart />
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsSummary;
