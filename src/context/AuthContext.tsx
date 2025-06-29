import { useState, useEffect, ReactNode } from "react";
import { AuthService } from "../services/authService";
import { AuthContext } from "./AuthContextInstance";
import { TokenService } from "../services/tokenService";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            const isAuth = AuthService.isAuthenticated();
            setIsAuthenticated(isAuth);
            setIsInitialized(true);
        };
        initializeAuth();
    }, []);

    // Listen for token changes
    useEffect(() => {
        const handleTokenChange = (token: string | null) => {
            const isAuth = AuthService.isAuthenticated();
            setIsAuthenticated(isAuth);
        };

        // Add listener for token updates
        const cleanup = TokenService.addTokenUpdateListener(handleTokenChange);

        // Initial check
        handleTokenChange(TokenService.getToken());

        return cleanup;
    }, []);

    const login = async (login_id: string, password: string, endpoint: "/auth/admin-login" | "/auth/teacher-login") => {
        const response = await AuthService.login({ login_id, password }, endpoint);
        if (response.error === false || response.error === "false") {
            setIsAuthenticated(true);
        } else {
            throw new Error(response.message || "Login failed");
        }
    };

    const logout = async () => {
        try {
            const response = await AuthService.logout();
            setIsAuthenticated(false);
            return response;
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