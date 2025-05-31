import HomeIcon from '../../../assets/dashboard/Admin/sidebar/home.svg';
import SchoolIcon from '../../../assets/dashboard/Admin/sidebar/school-management.svg';
import EducatorIcon from '../../../assets/dashboard/Admin/sidebar/educator-management.svg';
import ReportIcon from '../../../assets/dashboard/Admin/sidebar/report.svg';
import { NavItem } from '../../../types/admin';



export const ADMIN_NAV_ITEMS: NavItem[] = [
    {
        to: "/admin",
        icon: HomeIcon,
        alt: "Home",
        label: "Home",
        end: true
    },
    {
        to: "/admin/school-management",
        icon: SchoolIcon,
        alt: "School Management",
        label: "School Management"
    },
    {
        to: "/admin/educator-management",
        icon: EducatorIcon,
        alt: "Educator Management",
        label: "Educator Management"
    },
    {
        to: "/admin/report",
        icon: ReportIcon,
        alt: "Report",
        label: "Report"
    }
];
