// educator/teacher management page
export interface Teacher {
    teacher_id: string;
    teacher_name: string;
    school_name: string;
    teacher_login: string;
    email: string;
    phone: string;
    schoolId: number;
    user_id?: number;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    status?: string;
}

export interface FetchTeachersResponse {
    error: boolean | string;
    teacher: Teacher[];
    token: string;
    message?: string;
    totalPages?: number;
    totalElements?: number;
    currentPage?: number;
    pageSize?: number;
}

export interface AddTeacherModalProps {
    onClose: () => void;
    onTeacherAdded?: () => void;
}

export interface TeacherActionModalProps {
    onClose: () => void;
    teacher: Teacher;
    onTeacherUpdated?: () => void;
} 