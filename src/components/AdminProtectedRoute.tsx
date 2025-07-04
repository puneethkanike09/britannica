import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import Loader from "./common/Loader";

const AdminProtectedRoute = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { isAuthenticated, isInitialized } = useAuth();

    if (!isInitialized) {
        return <Loader message="Authenticating..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin-login" replace />;
    }

    return <>{children}</>;
};

export default AdminProtectedRoute;