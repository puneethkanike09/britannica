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

function App() {
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

          {/* Admin routes with persistent layout */}
          <Route element={<AdminLayout />}>
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school-management"
              element={
                <ProtectedRoute requiredRole="admin">
                  <SchoolManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/educator-management"
              element={
                <ProtectedRoute requiredRole="admin">
                  <EducatorManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Report />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Educator routes with persistent layout */}
          <Route element={<EducatorLayout />}>
            <Route
              path="/educator-dashboard"
              element={
                <ProtectedRoute requiredRole="educator">
                  <EducatorDashboard />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all route for 404 - Page Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;