//Sidebar Item
export interface NavItem {
    to: string;
    icon: string;
    alt: string;
    label: string;
    end?: boolean;
}

//top bar
export interface TopbarProps {
    onOpenLogoutModal: () => void;
    isSidebarCollapsed?: boolean;
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
    date: string;
    time: string;
    activity: string;
    user: string;
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
}
