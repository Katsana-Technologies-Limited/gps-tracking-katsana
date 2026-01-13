import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/utils/Login/Login";
import LoginGuest from "./components/utils/Login/LoginGuest";
import TrackingLayout from "./Pages/Layout/TrackingLayout";
import AnalyticsSummary from "./Pages/Routes/AnalyticsSummary";
import Vehicles from "./Pages/Routes/Vehicles";
import Reports from "./Pages/Routes/Reports";
import MonthlyDistanceReport from "./components/Reports/MonthlyDistanceReport";
import HourlyDistanceReport from "./components/Reports/HourlyDistanceReport";
import DailyDistanceReport from "./components/Reports/DailyDistanceReport";
import LocationReport from "./components/Reports/LocationReport";
import SpeedReport from "./components/Reports/SpeedReport";
import EngineReport from "./components/Reports/EngineReport";
import TripReport from "./components/Reports/TripReport";
import FuelReport from "./components/Reports/FuelReport";
import LastLocationReport from "./components/Reports/LastLocationReport";
import DailyLiveStatusReport from "./components/Reports/DailyLiveStatusReport";
import MonthlyKPLCostReport from "./components/Reports/MonthlyKPLCostReport";
import VehicleActivityReport from "./components/Reports/VehicleActivityReport";
import MonthlyModelSummaryReport from "./components/Reports/MonthlyModelSummaryReport";
import Alert from "./Pages/Routes/Alert";
import Maintenance from "./Pages/Routes/Maintenance";
import Support from "./Pages/Routes/Support";
import Payment from "./Pages/Routes/Payment";
import UserManagement from "./Pages/Routes/UserManagement";
import AIAssistant from "./Pages/Routes/AIAssistant";
import ProtectedRoute from "./services/ProtectedRoute";
import VehicleRoute from "./components/Vehicles/VehicleRoute";
import VtsProfile from "./components/utils/Profile/VtsProfile";
import VehicleAlerts from "./components/Vehicles/VehicleAlerts";
import FindHelp from "./components/Vehicles/FindHelp";
import LocationShareList from "./components/Vehicles/LocationShareList";
import RouteShareList from "./components/Vehicles/RouteShareList";
import GeoFence from "./components/Vehicles/GeoFence";
import DailyAnalytics from "./components/Drive Mark/DailyAnalytics";
import VehicleCurrentLocationa from "./components/Vehicles/VehicleCurrentLocationa";

const App = () => {
  return (
    <div className="font-hind">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login-guest" element={<LoginGuest />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <TrackingLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AnalyticsSummary />} />
            <Route path="profile" element={<VtsProfile />} />
            <Route path="vehicles/dashboard" element={<Vehicles />} />
            <Route
              path="vehicles/current-location"
              element={<VehicleCurrentLocationa />}
            />
            <Route path="vehicles/vehicle-route" element={<VehicleRoute />} />
            <Route path="vehicles/vehicle-alerts" element={<VehicleAlerts />} />
            <Route path="vehicles/find-help" element={<FindHelp />} />
            <Route
              path="vehicles/location-share-list"
              element={<LocationShareList />}
            />
            <Route
              path="vehicles/route-share-list"
              element={<RouteShareList />}
            />
            <Route path="vehicles/geo-fence" element={<GeoFence />} />
            <Route path="reports" element={<Reports />} />
            <Route
              path="reports/monthly-distance"
              element={<MonthlyDistanceReport />}
            />
            <Route
              path="reports/hourly-distance"
              element={<HourlyDistanceReport />}
            />
            <Route
              path="reports/daily-distance"
              element={<DailyDistanceReport />}
            />
            <Route path="reports/location" element={<LocationReport />} />
            <Route path="reports/speed" element={<SpeedReport />} />
            <Route path="reports/engine" element={<EngineReport />} />
            <Route path="reports/trip" element={<TripReport />} />
            <Route path="reports/fuel" element={<FuelReport />} />
            <Route
              path="reports/last-location"
              element={<LastLocationReport />}
            />
            <Route
              path="reports/daily-live-status"
              element={<DailyLiveStatusReport />}
            />
            <Route
              path="reports/monthly-kpl-cost"
              element={<MonthlyKPLCostReport />}
            />
            <Route
              path="reports/vehicle-activity"
              element={<VehicleActivityReport />}
            />
            <Route
              path="reports/monthly-model-summary"
              element={<MonthlyModelSummaryReport />}
            />
            <Route
              path="drive-mark/daily-analytics"
              element={<DailyAnalytics />}
            />
            <Route path="alert" element={<Alert />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="support" element={<Support />} />
            <Route path="payment" element={<Payment />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
