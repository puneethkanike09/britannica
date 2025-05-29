import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import SVG files
import HomeIcon from '../../../../../assets/dashboard/Admin/sidebar/home.svg';
import SchoolIcon from '../../../../../assets/dashboard/Admin/sidebar/school-management.svg';
import LogoIcon from '../../../../../assets/dashboard/Admin/sidebar/logo.png';
import TeacherIcon from '../../../../../assets/dashboard/Admin/sidebar/teacher-management.svg';
import ReportIcon from '../../../../../assets/dashboard/Admin/sidebar/report.svg';
import LogoutModal from '../topbar/modals/LogoutModal';

interface SidebarProps {
    showLogoutModal: boolean;
    onCloseLogoutModal: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ showLogoutModal, onCloseLogoutModal, isCollapsed, onToggleCollapse }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            setIsOverlayVisible(true);
        } else {
            const timer = setTimeout(() => {
                setIsOverlayVisible(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const openSidebar = () => {
        setIsOpen(true);
    };

    const closeSidebar = () => {
        if (isMobile) {
            setIsOpen(false);
        }
    };

    const toggleCollapse = () => {
        onToggleCollapse();
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <>
            {/* Hamburger Menu Button */}
            {!isOpen && (
                <button
                    className="md:hidden fixed top-[20px] left-[12px] z-50 bg-transparent text-primary p-3 rounded-lg focus:outline-none transition-all duration-300 ease-in-out hover:bg-gray-200 active:scale-95"
                    onClick={openSidebar}
                    aria-label="Open menu"
                >
                    <div className="relative w-5 h-4">
                        <span
                            className="absolute left-0 top-0 w-full h-0.5 bg-primary rounded transition-all duration-300 ease-in-out"
                        ></span>
                        <span
                            className="absolute left-0 top-2 w-full h-0.5 bg-primary rounded transition-all duration-300 ease-in-out opacity-100"
                        ></span>
                        <span
                            className="absolute left-0 top-4 w-full h-0.5 bg-primary rounded transition-all duration-300 ease-in-out"
                        ></span>
                    </div>
                </button>
            )}

            <div
                className={`${isCollapsed && !isMobile ? 'w-[80px] min-w-[80px]' : 'w-[320px] min-w-[320px]'} flex-shrink-0 bg-primary text-white fixed inset-y-0 left-0 z-90 transition-all duration-300 ease-in-out will-change-transform ${isOpen || !isMobile ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
                style={{ backfaceVisibility: 'hidden' }}
            >
                <div className={`${isCollapsed && !isMobile ? 'px-4 justify-center' : 'pl-8 pr-4 justify-between'} py-10 border-b border-stone-300/50 h-[81px] flex items-center transition-all duration-300`}>
                    {/* Logo - only show when not collapsed or on mobile */}
                    {(!isCollapsed || isMobile) && (
                        <Link to="/" onClick={closeSidebar}>
                            <div className="flex items-center">
                                <img
                                    src={LogoIcon}
                                    alt="Britannica Education Logo"
                                    className="h-[40px] object-cover transition-all duration-300"
                                />
                            </div>
                        </Link>
                    )}

                    {/* Desktop Collapse Button */}
                    {!isMobile && (
                        <button
                            className="text-white p-2 rounded-lg hover:bg-[#0090d0] focus:outline-none transition-colors duration-200"
                            onClick={toggleCollapse}
                            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {isCollapsed ? (
                                <ChevronRight className="h-5 w-5" />
                            ) : (
                                <ChevronLeft className="h-5 w-5" />
                            )}
                        </button>
                    )}

                    {/* Mobile Close Button */}
                    {isMobile && (
                        <button
                            className="md:hidden text-white p-2 rounded-lg hover:bg-[#0090d0] focus:outline-none"
                            onClick={closeSidebar}
                            aria-label="Close menu"
                        >
                            <FaTimes className="h-5 w-5" />
                        </button>
                    )}
                </div>

                <nav className={`flex flex-col ${isCollapsed && !isMobile ? 'p-4' : 'p-8'} space-y-2 pt-10 transition-all duration-300`}>
                    <Link
                        to="/admin"
                        className={`flex items-center ${isCollapsed && !isMobile ? 'p-3 justify-center' : 'p-3'} rounded-lg ${isActive("/admin") ? "bg-secondary font-bold text-white" : "hover:bg-[#0090d0]"} transition-all duration-200`}
                        onClick={closeSidebar}
                        title={isCollapsed && !isMobile ? "Home" : ""}
                    >
                        <img
                            src={HomeIcon}
                            alt="Home"
                            className={`h-5 w-5 ${isCollapsed && !isMobile ? '' : 'mr-3'} ${isActive("/admin") ? 'scale-110' : ''}`}
                        />
                        {(!isCollapsed || isMobile) && <span className="text-lg">Home</span>}
                    </Link>

                    <Link
                        to="/admin/school-management"
                        className={`flex items-center ${isCollapsed && !isMobile ? 'p-3 justify-center' : 'p-3'} rounded-lg ${isActive("/admin/school-management") ? "bg-secondary font-bold text-white" : "hover:bg-[#0090d0]"} transition-all duration-200`}
                        onClick={closeSidebar}
                        title={isCollapsed && !isMobile ? "School Management" : ""}
                    >
                        <img
                            src={SchoolIcon}
                            alt="School Management"
                            className={`h-5 w-5 ${isCollapsed && !isMobile ? '' : 'mr-3'} ${isActive("/admin/school-management") ? 'scale-110' : ''}`}
                        />
                        {(!isCollapsed || isMobile) && <span className="text-lg">School Management</span>}
                    </Link>

                    <Link
                        to="/admin/teacher-management"
                        className={`flex items-center ${isCollapsed && !isMobile ? 'p-3 justify-center' : 'p-3'} rounded-lg ${isActive("/admin/teacher-management") ? "bg-secondary font-bold text-white" : "hover:bg-[#0090d0]"} transition-all duration-200`}
                        onClick={closeSidebar}
                        title={isCollapsed && !isMobile ? "Teacher Management" : ""}
                    >
                        <img
                            src={TeacherIcon}
                            alt="Teacher Management"
                            className={`h-5 w-5 ${isCollapsed && !isMobile ? '' : 'mr-3'} ${isActive("/admin/teacher-management") ? 'scale-110' : ''}`}
                        />
                        {(!isCollapsed || isMobile) && <span className="text-lg">Teacher Management</span>}
                    </Link>

                    <Link
                        to="/admin/report"
                        className={`flex items-center ${isCollapsed && !isMobile ? 'p-3 justify-center' : 'p-3'} rounded-lg ${isActive("/admin/report") ? "bg-secondary font-bold text-white" : "hover:bg-[#0090d0]"} transition-all duration-200`}
                        onClick={closeSidebar}
                        title={isCollapsed && !isMobile ? "Report" : ""}
                    >
                        <img
                            src={ReportIcon}
                            alt="Report"
                            className={`h-5 w-5 ${isCollapsed && !isMobile ? '' : 'mr-3'} ${isActive("/admin/report") ? 'scale-110' : ''}`}
                        />
                        {(!isCollapsed || isMobile) && <span className="text-lg">Report</span>}
                    </Link>
                </nav>
            </div>

            {(isOverlayVisible && isMobile) && (
                <div
                    className={`fixed inset-0 bg-black/40 bg-opacity-50 z-50 md:hidden transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={closeSidebar}
                />
            )}
            {showLogoutModal && <LogoutModal onClose={onCloseLogoutModal} />}
        </>
    );
};

export default Sidebar;