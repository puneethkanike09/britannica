export interface UserAccessType {
    user_access_type_id: string | number;
    user_access_type_name: string;
    description: string;
    status?: string;
    created_user?: string | number;
    created_ts?: string;
    last_updated_user?: string | number;
    last_updated_ts?: string;
}

export interface FetchUserAccessTypesResponse {
    error: boolean | string;
    user_access_type: UserAccessType[];
    token: string;
    message?: string;
    totalPages?: number;
    totalElements?: number;
    currentPage?: number;
    pageSize?: number;
}

export interface AddUserAccessTypeModalProps {
    onClose: () => void;
    onUserAccessTypeAdded?: () => void;
}

export interface UserAccessTypeActionModalProps {
    onClose: () => void;
    userAccessType: UserAccessType;
    onUserAccessTypeUpdated?: () => void;
    onUserAccessTypeDeleted?: () => void;
} 