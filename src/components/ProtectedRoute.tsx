import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({
    children,
    redirectTo,
}: {
    children: React.ReactNode;
    redirectTo?: string;
}) => {
    const { isAuthenticated, isInitialized } = useAuth();
    const location = useLocation();

    // Show loading while initializing
    if (!isInitialized) {
        return <div>Loading...</div>;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to={redirectTo || "/admin-login"} state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;