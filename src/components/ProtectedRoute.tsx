import { Navigate, useLocation } from "react-router-dom";

import { AuthService } from "../services/authService";
import { ProtectedRouteProps } from '../types/global';
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({
    children,
    redirectTo = "/admin-login",
}: Omit<ProtectedRouteProps, 'requiredRole'>) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();


    const hasValidToken = AuthService.isAuthenticated();

    if (!isAuthenticated || !hasValidToken) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;