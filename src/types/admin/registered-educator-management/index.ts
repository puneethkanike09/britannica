// registered educator management page
export interface RegisteredEducator {
    login_id: string;
    school_name: string;
    user_name: string;
}

export interface FetchRegisteredEducatorsResponse {
    error: boolean | string;
    data: RegisteredEducator[];
    token: string;
    message?: string;
    totalPages?: number;
    totalElements?: number;
    currentPage?: number;
    pageSize?: number;
}

export interface ActionResponse {
    error: boolean | string;
    token?: string;
    message?: string;
}

export interface RegisteredEducatorActionModalProps {
    onClose: () => void;
    educator: RegisteredEducator;
    onEducatorUpdated?: () => void;
}

export interface RegisteredEducatorDeleteModalProps {
    onClose: () => void;
    educator: RegisteredEducator;
    onEducatorDeleted?: () => void;
} 