import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/utils/Login";
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
import LoginGest from "./components/LoginGest";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login-gest" element={<LoginGest />} />
        <Route path="/dashboard" element={<TrackingLayout />}>
          <Route index element={<AnalyticsSummary />} />
          <Route path="vehicles" element={<Vehicles />} />
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
