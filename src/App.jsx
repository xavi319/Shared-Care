import { Route, Routes } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ResidentDetailPage from "./pages/ResidentDetailPage";
import ResidentsPage from "./pages/ResidentsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardPage />} />
      <Route path="/residents" element={<ResidentsPage />} />
      <Route path="/residents/:residentId" element={<ResidentDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
