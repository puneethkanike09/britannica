import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
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
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/create-password" element={<CreatePassword />} />

          {/* Admin routes with persistent layout and role protection */}
          <Route
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/school-management" element={<SchoolManagement />} />
            <Route path="/educator-management" element={<EducatorManagement />} />
            <Route path="/report" element={<Report />} />
          </Route>

          {/* Educator routes with persistent layout and role protection */}
          <Route
            element={
              <ProtectedRoute requiredRole="educator">
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