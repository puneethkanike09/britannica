//topbar nav item
export interface EducatorNavItem {
    label: string;
    to?: string;
    dropdown?: Array<{
        label: string;
        to: string;
    }>;
}


export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: SelectOption[];
    className?: string;
    isOpen: boolean;
    onToggle: () => void;
    error?: string;
    isSubmitting?: boolean;
    onErrorClear?: (field: string) => void;
    isSubmittingDropdowns?: boolean;
}


export interface DocumentCardProps {
    title: string;
    onView: () => void;
    onDownload: () => void;
}

export interface PdfProject {
    id: string | number;
    title: string;
    type: string;
    file: string;
}

export interface Grade {
    grade_id: string;
    grade_name: string;
}

export interface Theme {
    theme_id: string;
    theme_name: string;
}

export interface UserAccessType {
    user_access_type_id: string;
    user_access_type_name: string;
}

export interface FetchGradesResponse {
    error: boolean | string;
    grade?: Grade[];
    token?: string;
    message?: string;
}

export interface FetchThemesResponse {
    error: boolean | string;
    theme?: Theme[];
    token?: string;
    message?: string;
}

export interface FetchUserAccessTypesResponse {
    error: boolean | string;
    user_access_type?: UserAccessType[];
    token?: string;
    message?: string;
}

export interface FetchPblFilesPayload {
    token: string;
    grade_id: string | number;
    theme_id: string | number;
    user_access_type_id: string | number;
}

export interface FetchPblFilesResponse {
    error: boolean | string;
    pbl_file?: Array<{
        pbl_id: string | number;
        pbl_file_path: string;
        pbl_name: string;
    }>;
    message?: string;
}

export interface FetchPblFileByIdResponse {
    error: boolean | string;
    token?: string;
    pbl_file?: Array<{
        file_url: string;
        pbl_id: string | number;
        pbl_name: string;
        pbl_file_path: string;
    }>;
    message?: string;
}