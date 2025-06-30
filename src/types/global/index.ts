//loader props

export interface LoaderProps {
    message?: string;
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