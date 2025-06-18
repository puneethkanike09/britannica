import { Navigate, useLocation } from "react-router-dom";

import { AuthService } from "../services/authService";
import { ProtectedRouteProps } from '../types/global';
import { useAuth } from "../hooks/useAuth";
import Loader from "./common/Loader";

const ProtectedRoute = ({
    children,
    redirectTo = "/admin-login",
}: Omit<ProtectedRouteProps, 'requiredRole'>) => {
    const { isAuthenticated, isInitialized } = useAuth();
    const location = useLocation();

    // Show loading while auth is initializing
    if (!isInitialized) {
        return <Loader message="Auth is initializing..." />;
    }

    // Only check for valid token
    const hasValidToken = AuthService.isAuthenticated();

    if (!isAuthenticated || !hasValidToken) {
        // Redirect to login (default to admin-login, can be changed per usage)
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;