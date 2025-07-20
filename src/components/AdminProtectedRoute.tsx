import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import Loader from "./common/Loader";
import { TokenService } from "../services/tokenService";

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

    // Check for Admin role only
    const decoded = TokenService.getDecodedToken();
    const roles: string[] = decoded?.roles || [];

    // If user is a Teacher, redirect them to educator dashboard
    if (roles.includes("Teacher") && !roles.includes("Admin")) {
        return <Navigate to="/educator/dashboard" replace />;
    }

    // If user is not an Admin, redirect to login
    if (!roles.includes("Admin")) {
        return <Navigate to="/admin-login" replace />;
    }

    return <>{children}</>;
};

export default AdminProtectedRoute;