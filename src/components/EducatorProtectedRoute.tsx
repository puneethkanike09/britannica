import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import Loader from "./common/Loader";
import { TokenService } from "../services/tokenService";

const EducatorProtectedRoute = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { isAuthenticated, isInitialized } = useAuth();

    if (!isInitialized) {
        return <Loader message="Authenticating..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/educator-login" replace />;
    }

    // Check roles in the token
    const decoded = TokenService.getDecodedToken();
    const roles: string[] = decoded?.roles || [];

    // Allow both Teacher and Admin roles to access
    if (!(roles.includes("Teacher") || roles.includes("Admin"))) {
        return <Navigate to="/educator-login" replace />;
    }

    return <>{children}</>;
};

export default EducatorProtectedRoute; 