import { Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import DailyLogsPage from "./pages/DailyLogsPage";
import DailyLogSubmissionPage from "./pages/DailyLogSubmissionPage";
import FamilyDashboardPage from "./pages/FamilyDashboardPage";
import FamilyPlaceholderPage from "./pages/FamilyPlaceholderPage";
import FamilySchedulingPage from "./pages/FamilySchedulingPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ResidentDetailPage from "./pages/ResidentDetailPage";
import ResidentsPage from "./pages/ResidentsPage";
import MessagesPage from "./pages/MessagesPage";
import SchedulingPage from "./pages/SchedulingPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/daily-logs" element={<DailyLogsPage />} />
        <Route path="/daily-logs/:residentId/submit" element={<DailyLogSubmissionPage />} />
        <Route path="/residents" element={<ResidentsPage />} />
        <Route path="/residents/:residentId" element={<ResidentDetailPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/scheduling" element={<SchedulingPage />} />
        <Route path="/family" element={<FamilyDashboardPage />} />
        <Route path="/family/daily-logs" element={<FamilyPlaceholderPage page="dailyLogs" />} />
        <Route path="/family/scheduling" element={<FamilySchedulingPage />} />
        <Route path="/family/messages" element={<FamilyPlaceholderPage page="messages" />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
