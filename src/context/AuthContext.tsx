import { useState, useEffect, ReactNode } from "react";
import { AuthService } from "../services/authService";
import { AuthContext, type AuthContextType } from "./AuthContextInstance";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [user, setUser] = useState<AuthContextType["user"]>(null);

    useEffect(() => {
        const initializeAuth = async () => {
            const isAuth = AuthService.isAuthenticated();
            const userData = AuthService.getUser(); // Fetches from token, not localStorage
            setIsAuthenticated(isAuth);
            setUser(userData);
            setIsInitialized(true);
        };
        initializeAuth();
    }, []);

    const login = async (login_id: string, password: string, role: "admin" | "educator") => {
        const response = await AuthService.login({ login_id, password }, role);
        if (response.success && response.data) {
            setIsAuthenticated(true);
            setUser(response.data.user);
        } else {
            throw new Error(response.message || "Login failed");
        }
    };

    const logout = async () => {
        try {
            await AuthService.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, isInitialized, user, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};