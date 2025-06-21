import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'; // Replaced FaTimes with X

// Import constants and components
import { ADMIN_NAV_ITEMS } from '../../../../../config/constants/Admin/sidebar';
import LogoIcon from '../../../../../assets/dashboard/Admin/sidebar/logo.png';
import LogoutModal from '../topbar/modals/LogoutModal';
import { SidebarProps } from '../../../../../types/admin';

const Sidebar: React.FC<SidebarProps> = ({
    showLogoutModal,
    onCloseLogoutModal,
    isCollapsed,
    onToggleCollapse
}) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    const closeSidebar = () => {
        if (isMobile) setIsOpen(false);
    };

    const navItems = ADMIN_NAV_ITEMS;

    return (
        <>
            {/* Mobile Menu Button */}
            {!isOpen && (
                <button
                    className="md:hidden fixed top-[10px] left-[12px] z-50 bg-transparent text-primary p-3 hover:text-textColor"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open menu"
                >
                    <Menu className="h-8 w-8" />
                </button>
            )}

            {/* Sidebar */}
            <div
                className={`${isCollapsed && !isMobile ? 'w-[90px] min-w-[90px]' : 'w-[320px] min-w-[320px]'
                    } flex-shrink-0 bg-primary text-white fixed inset-y-0 left-0 z-90 transition-all duration-300 ease-in-out ${isOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0`}
            >
                {/* Header */}
                <div className={`${isCollapsed && !isMobile ? 'px-4 justify-center' : 'pl-6 pr-5 justify-between'
                    } py-10 shadow-xs h-[81px] flex items-center transition-all duration-300`}>

                    {/* Logo */}
                    {(!isCollapsed || isMobile) && (
                        <NavLink to="/admin-dashboard" onClick={closeSidebar}>
                            <img
                                src={LogoIcon}
                                alt="Britannica Education Logo"
                                className="h-[40px] object-cover transition-all duration-300"
                            />
                        </NavLink>
                    )}

                    {/* Desktop Collapse Button */}
                    {!isMobile && (
                        <button
                            className="text-white hover:text-textColor cursor-pointer"
                            onClick={onToggleCollapse}
                            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                        </button>
                    )}

                    {/* Mobile Close Button */}
                    {isMobile && (
                        <button
                            className="text-white rounded-lg hover:text-textColor"
                            onClick={closeSidebar}
                            aria-label="Close menu"
                        >
                            <X className="h-7 w-7" /> {/* Replaced FaTimes with X */}
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex flex-col p-6 space-y-2 pt-12 overflow-y-auto h-[calc(100vh-81px)]">
                    {navItems.map(({ to, icon, alt, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center ${isCollapsed && !isMobile ? 'p-3 justify-center' : 'p-3'
                                } rounded-lg transition-all duration-300 ${isActive ? "bg-secondary font-bold text-white" : "hover:bg-hover"
                                }`
                            }
                            onClick={closeSidebar}
                            title={isCollapsed && !isMobile ? label : ""}
                        >
                            <img
                                src={icon}
                                alt={alt}
                                className={`h-5 w-5 ${isCollapsed && !isMobile ? '' : 'mr-3'
                                    } ${location.pathname === to ? 'scale-110' : ''}`}
                            />
                            {(!isCollapsed || isMobile) && <span className="text-lg">{label}</span>}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Mobile Overlay */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300"
                    onClick={closeSidebar}
                />
            )}

            {/* Logout Modal */}
            {showLogoutModal && <LogoutModal onClose={onCloseLogoutModal} />}
        </>
    );
};

export default Sidebar;