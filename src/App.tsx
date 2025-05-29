import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import AdminDashboard from "./pages/admin/home-page";
import SchoolManagement from "./pages/admin/school-management";
import TeacherManagement from "./pages/admin/teacher-management";
import Report from "./pages/admin/report";
import TeacherDashboard from "./pages/teacher/home-page";
import { Toaster } from "react-hot-toast";
import AdminLayout from "./pages/admin/AdminLayout";
import TeacherLayout from "./pages/teacher/TeacherLayout";

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
          <Route path="teacher-management" element={<TeacherManagement />} />
          <Route path="report" element={<Report />} />
        </Route>

        {/* Teacher routes with persistent layout */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<TeacherDashboard />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
