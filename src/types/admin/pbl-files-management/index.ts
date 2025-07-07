export interface PblFile {
    pbl_id: string | number;
    pbl_name: string;
    grade_name: string;
    theme_name: string;
    user_access_type_name: string;
}

export interface FetchPblFilesResponse {
    error: boolean | string;
    pbl_files: PblFile[];
    token: string;
    message?: string;
    totalPages?: number;
    totalItems?: number;
    currentPage?: number;
    pageSize?: number;
}

// export interface AddPblFileModalProps {
//     onClose: () => void;
//     onFileAdded?: () => void;
// }

// export interface PblFileActionModalProps {
//     onClose: () => void;
//     file: PblFile;
//     onFileUpdated?: () => void;
//     onFileDeleted?: () => void;
// }