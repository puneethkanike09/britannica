import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";
import Loader from "./common/Loader";

const AdminProtectedRoute = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isInitialized = useAuthStore((state) => state.isInitialized);

    if (!isInitialized) {
        return <Loader message="Authenticating..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin-login" replace />;
    }

    return <>{children}</>;
};

export default AdminProtectedRoute;