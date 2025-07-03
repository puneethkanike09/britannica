import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/admin-login";
import EducatorLogin from "./pages/educator-login";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/admin/home-page";
import SchoolManagement from "./pages/admin/school-management";
import EducatorManagement from "./pages/admin/educator-management";
import Report from "./pages/admin/report";
import EducatorDashboard from "./pages/educator/home-page";
import { Toaster } from "react-hot-toast";
import AdminLayout from "./pages/admin/AdminLayout";
import NotFoundPage from "./pages/NotFoundPage";
import EducatorLayout from "./pages/educator/EducatorLayout";
import CreatePassword from "./pages/CreatePassword";
import { AuthProvider } from "./context/AuthContext";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import EducatorProtectedRoute from "./components/EducatorProtectedRoute";
import { useEffect } from "react";
import toast from "react-hot-toast";
import GradeManagement from "./pages/admin/grade-management";
import ThemeManagement from "./pages/admin/theme-management";
import PblFileManagement from "./pages/admin/pbl-files-management";
import RegisteredEducatorManagement from "./pages/admin/registered-educator-management";
import UnregisteredEducatorManagement from "./pages/admin/unregistered-educator-management";
import EducatorRegistration from "./pages/educator-register";

function App() {
  useEffect(() => {
    const showOfflineToast = () => toast.error("No internet connection. You're offline.");
    const showOnlineToast = () => toast.success("You're back online!");

    if (!navigator.onLine) {
      showOfflineToast();
    }

    window.addEventListener("offline", showOfflineToast);
    window.addEventListener("online", showOnlineToast);
    return () => {
      window.removeEventListener("offline", showOfflineToast);
      window.removeEventListener("online", showOnlineToast);
    };
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              padding: "16px",
              color: "white",
              backgroundColor: "#141E8C",
            },
            ariaProps: {
              role: "status",
              "aria-live": "polite",
            },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<EducatorLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/educator-login" element={<EducatorLogin />} />
          <Route path="/educator-register" element={<EducatorRegistration />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/create-password" element={<CreatePassword />} />

          {/* Admin routes */}
          <Route
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/school-management" element={<SchoolManagement />} />
            <Route path="/educator-management" element={<EducatorManagement />} />
            <Route path="/registered-educator-management" element={<RegisteredEducatorManagement />} />
            <Route path="/unregistered-educator-management" element={<UnregisteredEducatorManagement />} />
            <Route path="/master-data/grade" element={<GradeManagement />} />
            <Route path="/master-data/theme" element={<ThemeManagement />} />
            <Route path="/pbl-files" element={<PblFileManagement />} />
            <Route path="/report" element={<Report />} />
          </Route>

          {/* Educator routes */}
          <Route
            element={
              <EducatorProtectedRoute>
                <EducatorLayout />
              </EducatorProtectedRoute>
            }
          >
            <Route path="/educator-dashboard" element={<EducatorDashboard />} />
          </Route>

          {/* Catch-all route for 404 - Page Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;