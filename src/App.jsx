import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/utils/Login/Login";
import LoginGuest from "./components/utils/Login/LoginGuest";
import TrackingLayout from "./Pages/Layout/TrackingLayout";
import AnalyticsSummary from "./Pages/Routes/AnalyticsSummary";
import Vehicles from "./Pages/Routes/Vehicles";
import Reports from "./Pages/Routes/Reports";
import DriveMark from "./Pages/Routes/DriveMark";
import Alert from "./Pages/Routes/Alert";
import Maintenance from "./Pages/Routes/Maintenance";
import Support from "./Pages/Routes/Support";
import Payment from "./Pages/Routes/Payment";
import UserManagement from "./Pages/Routes/UserManagement";
import AIAssistant from "./Pages/Routes/AIAssistant";
import ProtectedRoute from "./services/ProtectedRoute";
import VehiclecurrentLocation from "./components/Vehicles/VehiclecurrentLocation";
import VehicleRoute from "./components/Vehicles/VehicleRoute";
import VtsProfile from "./components/utils/Profile/VtsProfile";
import VehicleAlerts from "./components/Vehicles/VehicleAlerts";
import FindHelp from "./components/Vehicles/FindHelp";
import LocationShareList from "./components/Vehicles/LocationShareList";
import RouteShareList from "./components/Vehicles/RouteShareList";
import GeoFence from "./components/Vehicles/GeoFence";

const App = () => {
  return (
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
            element={<VehiclecurrentLocation />}
          />
          <Route path="vehicles/vehicle-route" element={<VehicleRoute />} />
          <Route path="vehicles/vehicle-alerts" element={<VehicleAlerts />} />
          <Route path="vehicles/find-help" element={<FindHelp />} />
          <Route path="vehicles/location-share-list" element={<LocationShareList />} />
          <Route path="vehicles/route-share-list" element={<RouteShareList />} />
          <Route path="vehicles/geo-fence" element={<GeoFence />} />
          <Route path="reports" element={<Reports />} />
          <Route path="drive-mark" element={<DriveMark />} />
          <Route path="alert" element={<Alert />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="support" element={<Support />} />
          <Route path="payment" element={<Payment />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
