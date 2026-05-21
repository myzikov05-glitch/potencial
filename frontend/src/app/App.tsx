import { useMemo } from "react";
import { AdminPage } from "../pages/admin/ui/AdminPage";
import { LandingPage } from "../pages/landing/ui/LandingPage";
import { getApiBaseUrl } from "../shared/api/config";

export default function App() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  return isAdminRoute ? <AdminPage apiBaseUrl={apiBaseUrl} /> : <LandingPage />;
}
