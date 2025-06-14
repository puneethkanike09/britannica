import { Navigate, useLocation } from "react-router-dom";

import { AuthService } from "../services/authService";
import { ProtectedRouteProps } from '../types/global';
import { useAuth } from "../hooks/useAuth";

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
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-darkGray">Loading...</p>
                </div>
            </div>
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