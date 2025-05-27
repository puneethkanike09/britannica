
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import AdminDashboard from "./pages/admin/home-page";
import SchoolManagement from "./pages/admin/school-management";
import TeacherManagement from "./pages/admin/teacher-management";
import Report from "./pages/admin/report";
import TeacherDashboard from "./pages/teacher/home-page";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            padding: '16px',
            color: 'white',
            backgroundColor: '#141E8C'
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/school-management" element={<SchoolManagement />} />
        <Route path="/admin/teacher-management" element={<TeacherManagement />} />
        <Route path="/admin/report" element={<Report />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
