//loader props

export interface LoaderProps {
    message?: string;
}

export interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: "admin" | "educator";
    redirectTo?: string;
}