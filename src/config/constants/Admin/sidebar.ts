import HomeIcon from '../../../assets/dashboard/Admin/sidebar/home.svg';
import SchoolIcon from '../../../assets/dashboard/Admin/sidebar/school-management.svg';
import EducatorIcon from '../../../assets/dashboard/Admin/sidebar/educator-management.svg';
import RegisteredEducator from '../../../assets/dashboard/Admin/sidebar/registered-educator.svg';
import UnRegisteredEducator from '../../../assets/dashboard/Admin/sidebar/unregistered-educator.svg';
import MasterDataIcon from '../../../assets/dashboard/Admin/sidebar/masterData.svg'; // Add this icon
import PblFilesIcon from '../../../assets/dashboard/Admin/sidebar/pblFiles.svg'; // Add this icon
import ReportIcon from '../../../assets/dashboard/Admin/sidebar/report.svg';
import { NavItem } from '../../../types/admin';

export const ADMIN_NAV_ITEMS: NavItem[] = [
    {
        to: "/admin/dashboard",
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
        to: "/admin/registered-educator-management",
        icon: RegisteredEducator,
        alt: "Registered Educator",
        label: "Registered Educator"
    },
    {
        to: "/admin/unregistered-educator-management",
        icon: UnRegisteredEducator,
        alt: "Unregistered Educator",
        label: "Unregistered Educator"
    },
    {
        to: "/admin/master-data",
        icon: MasterDataIcon,
        alt: "Master Data Management",
        label: "Master Data Management",
        hasSubmenu: true,
        submenu: [
            {
                to: "/admin/master-data/grade",
                label: "Grade"
            },
            {
                to: "/admin/master-data/theme",
                label: "Theme"
            },
            {
                to: "/admin/master-data/type",
                label: "Types"
            }
        ]
    },
    {
        to: "/admin/pbl-files",
        icon: PblFilesIcon,
        alt: "PBL Files",
        label: "PBL File Management"
    },
    {
        to: "/admin/report",
        icon: ReportIcon,
        alt: "Report",
        label: "Report"
    }
];