import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";
import Loader from "./common/Loader";

const EducatorProtectedRoute = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isInitialized = useAuthStore((state) => state.isInitialized);

    if (!isInitialized) {
         return <Loader message="Authenticating..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/educator-login" replace />;
    }

    return <>{children}</>;
};

export default EducatorProtectedRoute; 