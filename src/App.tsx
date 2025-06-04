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

function App() {

  return (
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
          <Route path="/admin-dashboard" index element={<AdminDashboard />} />
          <Route path="/school-management" element={<SchoolManagement />} />
          <Route path="/educator-management" element={<EducatorManagement />} />
          <Route path="/report" element={<Report />} />
        </Route>

        {/* Educator routes with persistent layout */}
        <Route element={<EducatorLayout />}>
          <Route path="/educator-dashboard" element={<EducatorDashboard />} />
        </Route>

        {/* Catch-all route for 404 - Page Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;