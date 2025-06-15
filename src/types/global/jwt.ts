import { User } from "./user";

// JWT payload type for our app
export interface JwtPayload {
    sub?: string;
    username?: string;
    roles?: string[];
    email?: string;
    exp?: number;
    [key: string]: unknown;
}



export interface AuthContextType {
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: User | null;
    login: (login_id: string, password: string, role: "admin" | "educator") => Promise<void>;
    logout: () => Promise<void>;
}