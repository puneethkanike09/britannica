import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthService } from "../services/authService";

interface User {
    id: string;
    login_id: string;
    role: "admin" | "educator";
    name: string;
    email?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: User | null;
    login: (login_id: string, password: string, role: "admin" | "educator") => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const initializeAuth = async () => {
            const isAuth = AuthService.isAuthenticated();
            const userData = AuthService.getUser();
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
            // Always throw the API's message for toast to use
            throw new Error(response.message || "Login failed");
        }
    };

    const logout = async () => {
        try {
            await AuthService.logout();
        } catch (error) {
            console.error("Logout error:", error);
            // Even if API fails, clear local state
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};