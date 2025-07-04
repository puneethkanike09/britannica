import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import Loader from "./common/Loader";

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

    return <>{children}</>;
};

export default EducatorProtectedRoute; 