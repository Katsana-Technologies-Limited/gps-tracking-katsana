import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/utils/Login";
import TrackingLayout from "./Pages/Layout/TrackingLayout";
import DashboardHomePage from "./Pages/Routes/DashboardHomePage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<TrackingLayout />}>
          <Route index element={<DashboardHomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
