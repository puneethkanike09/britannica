// Grade management types
export interface Grade {
    grade_id: number;
    grade_name: string;
    grade_desc: string;
    status?: string;
    created_user?: string | number;
    created_ts?: string;
    last_updated_user?: string | number;
    last_updated_ts?: string;
    description?: string;
}

export interface FetchGradesResponse {
    error: boolean | string;
    grade: Grade[];
    token: string;
    message?: string;
    totalPages?: number;
    totalElements?: number;
    currentPage?: number;
    pageSize?: number;
}

export interface AddGradeModalProps {
    onClose: () => void;
    onGradeAdded?: () => void;
}

export interface GradeActionModalProps {
    onClose: () => void;
    grade: Grade;
    onGradeUpdated?: () => void;
    onGradeDeleted?: () => void;
} 