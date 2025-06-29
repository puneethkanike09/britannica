import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { isAuthenticated, isInitialized } = useAuth();

    if (!isInitialized) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin-login" replace />;
    }

    return <>{children}</>;
};

export default AdminProtectedRoute;