import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import AdminDashboard from "./pages/admin/home-page";
import SchoolManagement from "./pages/admin/school-management";
import EducatorManagement from "./pages/admin/educator-management";
import Report from "./pages/admin/report";
import EducatorDashboard from "./pages/educator/home-page";
import { Toaster } from "react-hot-toast";
import AdminLayout from "./pages/admin/AdminLayout";
import NotFoundPage from "./pages/NotFoundPage";
import EducatorLayout from "./pages/educator/EducatorLayout";

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

        {/* Admin routes with persistent layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="school-management" element={<SchoolManagement />} />
          <Route path="educator-management" element={<EducatorManagement />} />
          <Route path="report" element={<Report />} />
        </Route>

        {/* Educator routes with persistent layout */}
        <Route path="/educator" element={<EducatorLayout />}>
          <Route index element={<EducatorDashboard />} />
        </Route>

        {/* Catch-all route for 404 - Page Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;