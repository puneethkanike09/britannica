import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { TokenService } from "../services/tokenService";

const EducatorProtectedRoute = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { isAuthenticated, isInitialized } = useAuth();
    const [shouldRedirect, setShouldRedirect] = useState(false);

    // Periodic authentication check
    useEffect(() => {
        if (!isInitialized) return;

        const checkAuth = () => {
            const hasValidToken = TokenService.hasValidToken();
            if (!hasValidToken && isAuthenticated) {
                setShouldRedirect(true);
            }
        };

        // Check immediately
        checkAuth();

        // Set up periodic check every 30 seconds
        const interval = setInterval(checkAuth, 30000);

        // Listen for token changes
        const cleanup = TokenService.addTokenUpdateListener((token) => {
            if (!token && isAuthenticated) {
                setShouldRedirect(true);
            }
        });

        return () => {
            clearInterval(interval);
            cleanup();
        };
    }, [isAuthenticated, isInitialized]);

    if (!isInitialized) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated || shouldRedirect) {
        return <Navigate to="/educator-login" replace />;
    }

    return <>{children}</>;
};

export default EducatorProtectedRoute; 