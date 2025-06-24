import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';

// Import constants and components
import { ADMIN_NAV_ITEMS } from '../../../../../config/constants/Admin/sidebar';
import LogoIcon from '../../../../../assets/dashboard/Admin/sidebar/logo.png';
import LogoutModal from '../topbar/modals/LogoutModal';
import { NavItem, SidebarProps, SubMenuItem } from '../../../../../types/admin';

const Sidebar: React.FC<SidebarProps> = ({
    showLogoutModal,
    onCloseLogoutModal,
    isCollapsed,
    onToggleCollapse
}) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
    const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(null);
    const menuRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    // Auto-expand menu if current path matches submenu item
    useEffect(() => {
        const newExpandedMenus = { ...expandedMenus };
        ADMIN_NAV_ITEMS.forEach(item => {
            if (item.hasSubmenu && item.submenu) {
                const isSubmenuActive = item.submenu.some(subItem =>
                    location.pathname === subItem.to || location.pathname.startsWith(subItem.to + '/')
                );
                if (isSubmenuActive) {
                    newExpandedMenus[item.to] = true;
                }
            }
        });
        setExpandedMenus(newExpandedMenus);
    }, [location.pathname]);

    const closeSidebar = () => {
        if (isMobile) setIsOpen(false);
    };

    const toggleSubmenu = (menuPath: string) => {
        if (isCollapsed && !isMobile) return; // Don't toggle if collapsed on desktop

        setExpandedMenus(prev => ({
            ...prev,
            [menuPath]: !prev[menuPath]
        }));
    };

    const isSubmenuItemActive = (submenuPath: string) => {
        return location.pathname === submenuPath || location.pathname.startsWith(submenuPath + '/');
    };

    const isParentMenuActive = (item: NavItem) => {
        if (item.hasSubmenu && item.submenu) {
            return item.submenu.some((subItem: SubMenuItem) => isSubmenuItemActive(subItem.to));
        }
        return location.pathname === item.to;
    };

    const handleMouseEnter = (menuPath: string) => {
        if (isCollapsed && !isMobile) {
            // Clear any existing timeout
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
            }

            const menuElement = menuRefs.current[menuPath];
            if (menuElement) {
                const rect = menuElement.getBoundingClientRect();
                setPopoverPosition({
                    top: rect.top,
                    left: rect.right // Remove the gap - attach directly
                });
            }
            setHoveredMenu(menuPath);
        }
    };

    const handleMouseLeave = () => {
        if (isCollapsed && !isMobile) {
            // Add a small delay before hiding to allow mouse to move to popover
            hoverTimeoutRef.current = setTimeout(() => {
                setHoveredMenu(null);
                setPopoverPosition(null);
            }, 150); // 150ms delay
        }
    };

    const handlePopoverMouseEnter = () => {
        // Clear the timeout when mouse enters popover
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
    };

    const handlePopoverMouseLeave = () => {
        // Hide immediately when leaving popover
        setHoveredMenu(null);
        setPopoverPosition(null);
    };

    const getCurrentHoveredItem = () => {
        return ADMIN_NAV_ITEMS.find(item => item.to === hoveredMenu);
    };

    const navItems = ADMIN_NAV_ITEMS;

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

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
                            <X className="h-7 w-7" />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex flex-col p-6 space-y-2 pt-12 overflow-y-auto h-[calc(100vh-81px)]">
                    {navItems.map((item) => (
                        <div key={item.to} className="relative">
                            {/* Main Navigation Item */}
                            {item.hasSubmenu ? (
                                <div
                                    className={`rounded-lg transition-all duration-300 ${isParentMenuActive(item) ? "bg-secondary" : "hover:bg-hover"}`}
                                >
                                    <button
                                        ref={(el) => {
                                            menuRefs.current[item.to] = el;
                                        }}
                                        onClick={() => toggleSubmenu(item.to)}
                                        onMouseEnter={() => handleMouseEnter(item.to)}
                                        onMouseLeave={handleMouseLeave}
                                        className={`w-full flex items-center ${isCollapsed && !isMobile ? 'p-3 justify-center' : 'p-3 justify-between'
                                            } transition-all duration-300 ${isParentMenuActive(item) ? "font-bold text-white" : ""
                                            }`}
                                        title={isCollapsed && !isMobile ? item.label : ""}
                                    >
                                        <div className="flex items-center">
                                            <img
                                                src={item.icon}
                                                alt={item.alt}
                                                className={`h-5 w-5 ${isCollapsed && !isMobile ? '' : 'mr-3'
                                                    } ${isParentMenuActive(item) ? 'scale-110' : ''}`}
                                            />
                                            {(!isCollapsed || isMobile) && <span className="text-lg">{item.label}</span>}
                                        </div>
                                        {(!isCollapsed || isMobile) && (
                                            <div className="ml-2 transition-transform duration-300 ease-in-out">
                                                {expandedMenus[item.to] ? (
                                                    <ChevronUp className="h-4 w-4 transform rotate-0" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4 transform rotate-0" />
                                                )}
                                            </div>
                                        )}
                                    </button>

                                    {/* Expanded Submenu Items (Normal Mode) */}
                                    {item.submenu && (!isCollapsed || isMobile) && (
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedMenus[item.to]
                                                ? 'max-h-96 opacity-100'
                                                : 'max-h-0 opacity-0'
                                                }`}
                                        >
                                            <div className="px-3 pb-3 space-y-1">
                                                {item.submenu.map((subItem) => (
                                                    <NavLink
                                                        key={subItem.to}
                                                        to={subItem.to}
                                                        className={({ isActive }) =>
                                                            `flex items-center p-3 pl-8 transition-all duration-300 rounded-md ${isActive || isSubmenuItemActive(subItem.to)
                                                                ? "bg-primary/50 font-bold text-white"
                                                                : "hover:bg-primary/50 text-white"
                                                            }`
                                                        }
                                                        onClick={closeSidebar}
                                                    >
                                                        <span className="text-lg">{subItem.label}</span>
                                                    </NavLink>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `flex items-center ${isCollapsed && !isMobile ? 'p-3 justify-center' : 'p-3'
                                        } rounded-lg transition-all duration-300 ${isActive ? "bg-secondary font-bold text-white" : "hover:bg-hover"
                                        }`
                                    }
                                    onClick={closeSidebar}
                                    title={isCollapsed && !isMobile ? item.label : ""}
                                >
                                    <img
                                        src={item.icon}
                                        alt={item.alt}
                                        className={`h-5 w-5 ${isCollapsed && !isMobile ? '' : 'mr-3'
                                            } ${location.pathname === item.to ? 'scale-110' : ''}`}
                                    />
                                    {(!isCollapsed || isMobile) && <span className="text-lg">{item.label}</span>}
                                </NavLink>
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Collapsed Mode Hover Popover - Moved Outside Sidebar */}
            {/* Collapsed Mode Hover Popover - Moved Outside Sidebar */}
            {isCollapsed && !isMobile && hoveredMenu && popoverPosition && (() => {
                const currentItem = getCurrentHoveredItem();
                return currentItem?.submenu ? (
                    <div
                        className="fixed z-[90] bg-white shadow-lg rounded-md p-1 min-w-[200px] py-1"
                        style={{
                            top: `${popoverPosition.top}px`,
                            left: `${popoverPosition.left}px`,
                        }}
                        onMouseEnter={handlePopoverMouseEnter}
                        onMouseLeave={handlePopoverMouseLeave}
                    >
                        <div className="px-4 py-2 border-b border-gray-100">
                            <span className="text-sm font-medium text-gray-800">{currentItem.label}</span>
                        </div>
                        {currentItem.submenu.map((subItem) => (
                            <NavLink
                                key={subItem.to}
                                to={subItem.to}
                                className={({ isActive }) =>
                                    `block px-4 py-2 text-sm transition-colors rounded-md duration-200 ${isActive || isSubmenuItemActive(subItem.to)
                                        ? "bg-secondary text-white font-medium"
                                        : "text-textColor hover:bg-third"
                                    }`
                                }
                                onClick={() => {
                                    closeSidebar();
                                    handlePopoverMouseLeave();
                                }}
                            >
                                {subItem.label}
                            </NavLink>
                        ))}
                    </div>
                ) : null;
            })()}

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