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
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import toast from "react-hot-toast";
import GradeManagement from "./pages/admin/grade-management";
import ThemeManagement from "./pages/admin/theme-management";
import TypesManagement from "./pages/admin/types-management";

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
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/educator-login" element={<EducatorLogin />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/create-password" element={<CreatePassword />} />
          {/* <Route path="/" element={<AdminLogin />} />a */}

          {/* Admin routes with persistent layout */}
          <Route
            element={
              <ProtectedRoute redirectTo="/admin-login">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/school-management" element={<SchoolManagement />} />
            <Route path="/educator-management" element={<EducatorManagement />} />
            <Route path="/master-data/grade" element={<GradeManagement />} />
            <Route path="/master-data/theme" element={<ThemeManagement />} />
            <Route path="/master-data/types" element={<TypesManagement />} />
            <Route path="/pbl-files" element={<SchoolManagement />} />
            <Route path="/report" element={<Report />} />
          </Route>

          {/* Educator routes with persistent layout */}
          <Route
            element={
              <ProtectedRoute redirectTo="/educator-login">
                <EducatorLayout />
              </ProtectedRoute>
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