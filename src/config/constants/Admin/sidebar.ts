import HomeIcon from '../../../assets/dashboard/Admin/sidebar/home.svg';
import SchoolIcon from '../../../assets/dashboard/Admin/sidebar/school-management.svg';
import EducatorIcon from '../../../assets/dashboard/Admin/sidebar/educator-management.svg';
import MasterDataIcon from '../../../assets/dashboard/Admin/sidebar/masterData.svg'; // Add this icon
import PblFilesIcon from '../../../assets/dashboard/Admin/sidebar/pblFiles.svg'; // Add this icon
import ReportIcon from '../../../assets/dashboard/Admin/sidebar/report.svg';
import { NavItem } from '../../../types/admin';

export const ADMIN_NAV_ITEMS: NavItem[] = [
    {
        to: "/admin-dashboard",
        icon: HomeIcon,
        alt: "Home",
        label: "Home",
        end: true
    },
    {
        to: "/school-management",
        icon: SchoolIcon,
        alt: "School Management",
        label: "School Management"
    },
    {
        to: "/educator-management",
        icon: EducatorIcon,
        alt: "Educator Management",
        label: "Educator Management"
    },
    {
        to: "/registered-educator-management",
        icon: EducatorIcon,
        alt: "Registered Educator",
        label: "Registered Educator"
    },
    {
        to: "/unregistered-educator-management",
        icon: EducatorIcon,
        alt: "Unregistered Educator",
        label: "Unregistered Educator"
    },
    {
        to: "/master-data",
        icon: MasterDataIcon,
        alt: "Master Data Management",
        label: "Master Data Management",
        hasSubmenu: true,
        submenu: [
            {
                to: "/master-data/grade",
                label: "Grade"
            },
            {
                to: "/master-data/theme",
                label: "Theme"
            },
            {
                to: "/master-data/types",
                label: "Types"
            }
        ]
    },
    {
        to: "/pbl-files",
        icon: PblFilesIcon,
        alt: "PBL Files",
        label: "PBL File Management"
    },
    {
        to: "/report",
        icon: ReportIcon,
        alt: "Report",
        label: "Report"
    }
];