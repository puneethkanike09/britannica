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
    id: number;
    name: string;
    email: string;
    phone: string;
    address?: string;
}

export interface AddSchoolModalProps {
    onClose: () => void;
}

export interface SchoolActionModalProps {
    onClose: () => void;
    school: School;
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
}

export interface EducatorActionModalProps {
    onClose: () => void;
    educator: Educator;
}
