import { createContext } from "react";

export interface AuthContextType {
    isAuthenticated: boolean;
    isInitialized: boolean;
    login: (login_id: string, password: string, endpoint: "/auth/admin-login" | "/auth/teacher-login") => Promise<void>;
    logout: () => Promise<{ error: boolean | string; message?: string }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
