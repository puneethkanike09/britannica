import { Navigate, useLocation } from "react-router-dom";

import { AuthService } from "../services/authService";
import { ProtectedRouteProps } from '../types/global';
import { useAuth } from "../hooks/useAuth";
import Loader from "./common/Loader";

const ProtectedRoute = ({
    children,
    requiredRole,
    redirectTo = "/",
}: ProtectedRouteProps) => {
    const { isAuthenticated, user, isInitialized } = useAuth();
    const location = useLocation();

    // Show loading while auth is initializing
    if (!isInitialized) {
        return (
            <Loader message="Auth is initializing..." />
        );
    }

    // Double-check token validity
    const hasValidToken = AuthService.isAuthenticated();

    // If not authenticated or no valid token, redirect to login
    if (!isAuthenticated || !hasValidToken) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // If role is required and user doesn't have it, redirect to appropriate dashboard
    if (requiredRole && user?.role !== requiredRole) {
        const defaultRedirect = user?.role === "admin" ? "/admin-dashboard" : "/educator-dashboard";
        return <Navigate to={defaultRedirect} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;