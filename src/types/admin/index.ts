//Sidebar Item
export interface SubMenuItem {
    to: string;
    label: string;
}

export interface NavItem {
    to: string;
    icon: string;
    alt: string;
    label: string;
    end?: boolean;
    hasSubmenu?: boolean;
    submenu?: SubMenuItem[];
}

//top bar
export interface TopbarProps {
    onOpenLogoutModal: () => void;
    isSidebarCollapsed?: boolean;
}

export interface SidebarProps {
    showLogoutModal: boolean;
    onCloseLogoutModal: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

//home page
export interface DashboardCard {
    id: string;
    title: string;
    value: number;
    icon: string;
    alt: string;
    colorClass: string;
    iconSize?: 'sm' | 'md' | 'lg';
}

// report page
export interface ActivityLog {
    id: number;
    time: string;
    activity: string;
    user: string;
    userId: string;
    schoolName: string;
    activityTimeStamp: string;
}

// school management page
export interface School {
    school_id: string;
    school_name: string;
    school_email: string;
    school_mobile_no: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    status?: string;
    created_user?: string;
    created_ts?: string;
    last_updated_user?: string;
    last_updated_ts?: string;
}

export interface FetchSchoolsResponse {
    error: boolean | string; // API returns "false" or "true" as strings
    schools: School[];
    token: string;
    message?: string;
}

export interface AddSchoolModalProps {
    onClose: () => void;
    onSchoolAdded?: () => void;
}

export interface SchoolActionModalProps {
    onClose: () => void;
    school: School;
    onSchoolUpdated?: () => void;
}

// educator management page
export interface Educator {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    loginId: string;
    schoolId?: number;
}

export interface AddEducatorModalProps {
    onClose: () => void;
    onEducatorAdded?: () => void;
}

export interface EducatorActionModalProps {
    onClose: () => void;
    educator: Teacher;
    onEducatorUpdated?: () => void;
}

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

// Grade Management
export interface Grade {
    grade_id: string;
    grade_name: string;
    description?: string;
}

export interface FetchGradesResponse {
    error: boolean | string;
    grade?: Grade[];
    token?: string;
    message?: string;
}

export interface AddGradePayload {
    grade_name: string;
    description?: string;
}

export interface UpdateGradePayload extends AddGradePayload {
    grade_id: string;
}

// Theme Management
export interface Theme {
    theme_id: string;
    theme_name: string;
    description?: string;
}

export interface FetchThemesResponse {
    error: boolean | string;
    theme?: Theme[];
    token?: string;
    message?: string;
}

export interface AddThemePayload {
    theme_name: string;
    description?: string;
}

export interface UpdateThemePayload extends AddThemePayload {
    theme_id: string;
}

// Type Management
export interface Type {
    type_id: string;
    type_name: string;
    description?: string;
}

export interface FetchTypesResponse {
    error: boolean | string;
    type?: Type[];
    token?: string;
    message?: string;
}

export interface AddTypePayload {
    type_name: string;
    description?: string;
}

export interface UpdateTypePayload extends AddTypePayload {
    type_id: string;
}

// PBL File Management
export interface PblFile {
    pbl_id: string;
    pbl_name: string;
    pbl_file_path: string;
    grade_id?: string;
    theme_id?: string;
    type_id?: string;
}

export interface FetchPblFilesResponse {
    error: boolean | string;
    pbl_file?: PblFile[];
    token?: string;
    message?: string;
}

export interface AddPblFilePayload {
    pbl_name: string;
    pbl_file_path: string;
    grade_id: string;
    theme_id: string;
    type_id: string;
}

export interface UpdatePblFilePayload extends AddPblFilePayload {
    pbl_id: string;
}


