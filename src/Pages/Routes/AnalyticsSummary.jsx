import "leaflet/dist/leaflet.css";
import TraveledDistance from "../../components/AnalyticsSummary/TraveledDistance";
import CounterVehicles from "../../components/AnalyticsSummary/CounterVehicles";
import VehiclesStatusOption from "../../components/AnalyticsSummary/VehiclesStatusOption";
import VehiclesStatusMap from "../../components/AnalyticsSummary/VehiclesStatusMap";
import AlertsSummaryNumberChart from "../../components/AnalyticsSummary/AlertsSummaryNumberChart";
import AlertsSummaryBarChart from "../../components/AnalyticsSummary/AlertsSummaryBarChart";

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
      <h1 className="text-lg font-semibold text-gray-700 mb-3">
        Analytics And Summary
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 2xl:grid-cols-11 gap-5 mb-5">
        <Card className="col-span-4">
          <TraveledDistance />
        </Card>
        <Card className="col-span-4">
          <CounterVehicles />
        </Card>
        <Card className="col-span-4 2xl:col-span-3 h-85">
          <VehiclesStatusOption />
        </Card>
      </div>

      <Card className="mb-5 p-0 overflow-hidden">
        <VehiclesStatusMap />
      </Card>

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
