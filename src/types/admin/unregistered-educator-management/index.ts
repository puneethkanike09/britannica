// unregistered educator management page
export interface UnregisteredEducator {
    login_id: string;
    school_name: string;
    user_name: string;
}

export interface FetchUnregisteredEducatorsResponse {
    error: boolean | string;
    teachers: UnregisteredEducator[];
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

export interface UnregisteredEducatorActionModalProps {
    onClose: () => void;
    educator: UnregisteredEducator;
    onEducatorUpdated?: () => void;
}

export interface UnregisteredEducatorDeleteModalProps {
    onClose: () => void;
    educator: UnregisteredEducator;
    onEducatorDeleted?: () => void;
} 