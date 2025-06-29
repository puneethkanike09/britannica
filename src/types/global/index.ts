//loader props

export interface LoaderProps {
    message?: string;
}

export interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: "admin" | "educator";
    redirectTo?: string;
}

export interface AuthResponse {
    token: string;
    message: string;
}

// Simple API response format that matches the actual API structure
export interface ApiResponse {
    error: boolean | string;
    token?: string;
    message?: string;
    [key: string]: any; // Allow additional properties
}

export interface LogoutModalProps {
    onClose: () => void;
}