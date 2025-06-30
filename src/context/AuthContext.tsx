import { useState, useEffect, ReactNode } from "react";
import { AdminAuthService } from "../services/admin/adminAuthService";
import { EducatorAuthService } from "../services/educator/educatorAuthService";
import { AuthContext } from "./AuthContextInstance";
import { TokenService } from "../services/tokenService";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            // Default to admin check, or you can add logic to check which one
            const isAuth = AdminAuthService.isAuthenticated() || EducatorAuthService.isAuthenticated();
            setIsAuthenticated(isAuth);
            setIsInitialized(true);
        };
        initializeAuth();
    }, []);

    // Listen for token changes
    useEffect(() => {
        const handleTokenChange = () => {
            const isAuth = AdminAuthService.isAuthenticated() || EducatorAuthService.isAuthenticated();
            setIsAuthenticated(isAuth);
        };

        // Add listener for token updates
        const cleanup = TokenService.addTokenUpdateListener(handleTokenChange);

        // Initial check
        handleTokenChange();

        return cleanup;
    }, []);

    const login = async (login_id: string, password: string, endpoint: "/auth/admin-login" | "/auth/teacher-login") => {
        let response;
        if (endpoint === "/auth/admin-login") {
            response = await AdminAuthService.login({ login_id, password });
        } else {
            response = await EducatorAuthService.login({ login_id, password });
        }
        if (response.error === false || response.error === "false") {
            setIsAuthenticated(true);
        } else {
            throw new Error(response.message || "Login failed");
        }
    };

    const logout = async () => {
        try {
            // Try both logouts for safety
            await AdminAuthService.logout();
            await EducatorAuthService.logout();
            setIsAuthenticated(false);
            return { error: false };
        } catch (error) {
            console.error("Logout error:", error);
            setIsAuthenticated(false);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, isInitialized, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};