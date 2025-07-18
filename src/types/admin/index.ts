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

// home page (educators, logins, downloads, schools, etc)
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
