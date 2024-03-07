import LoginPage from "../components/Pages/auth/login";
import DashboardPage from "../components/Pages/dashboard/dashboard";
import RegisterPage from "../components/Pages/auth/register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../components/Pages/home/landing";
import NotFoundPage from "../components/Pages/notfound";
import DashboardUserPage from "../components/Pages/dashboard/dashboardUser";
import DashboardProductPage from "../components/Pages/dashboard/dashboardProduct";
import DashboardSalePage from "../components/Pages/dashboard/dashboardSale";
import DashboardHistoryPage from "../components/Pages/dashboard/dashboardHistory";
import ProtectedRoute from "./ProtectedRoute";
import RequireAuth from "./RequireAuth";
import DashboardEditUserPage from "../components/Pages/dashboard/dashboardEditUser";
import DashboardSettingPage from "../components/Pages/dashboard/dashboardSetting";
import DashboardHelpPage from "../components/Pages/dashboard/dashboardHelp";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/*" element={<NotFoundPage />} />
        <Route element={<ProtectedRoute />}>
          <Route
            element={<RequireAuth allowedRoles={["STAFF", "ADMINISTRATOR"]} />}
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/users" element={<DashboardUserPage />} />
            <Route
              path="/dashboard/products"
              element={<DashboardProductPage />}
            />
            <Route path="/dashboard/sales" element={<DashboardSalePage />} />
            <Route path="/dashboard/histories" element={<DashboardHistoryPage />} />
            <Route
              path="/dashboard/setting"
              element={<DashboardSettingPage />}
            />
            <Route path="/dashboard/help" element={<DashboardHelpPage />} />
            <Route
              path="/dashboard/users/:id"
              element={<DashboardEditUserPage />}
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
