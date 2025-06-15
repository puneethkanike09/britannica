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

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}


export interface LogoutModalProps {
    onClose: () => void;
}