import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const EducatorProtectedRoute = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { isAuthenticated, isInitialized } = useAuth();

    if (!isInitialized) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/educator-login" replace />;
    }

    return <>{children}</>;
};

export default EducatorProtectedRoute; 