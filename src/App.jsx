import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/utils/Login";
import DashboardLayout from "../../partner-katsana-frontend/src/Pagees/Layout/DashboardLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* <Route index element={<DashboardHomePage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
