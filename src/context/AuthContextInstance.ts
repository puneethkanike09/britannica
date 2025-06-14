import { createContext } from "react";

interface User {
    id: string;
    login_id: string;
    role: "admin" | "educator";
    name: string;
    email?: string;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: User | null;
    login: (login_id: string, password: string, role: "admin" | "educator") => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
