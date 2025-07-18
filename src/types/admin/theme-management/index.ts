export interface Theme {
    theme_id: number;
    theme_name: string;
    theme_desc: string;
    theme_color: string;
    status?: string;
    created_user?: string | number;
    created_ts?: string;
    last_updated_user?: string | number;
    last_updated_ts?: string;
}

export interface FetchThemesResponse {
    error: boolean | string;
    theme: Theme[];
    token: string;
    message?: string;
    totalPages?: number;
    totalElements?: number;
    currentPage?: number;
    pageSize?: number;
}

export interface AddThemeModalProps {
    onClose: () => void;
    onThemeAdded?: () => void;
}

export interface ThemeActionModalProps {
    onClose: () => void;
    theme: Theme;
    onThemeUpdated?: () => void;
    onThemeDeleted?: () => void;
} 