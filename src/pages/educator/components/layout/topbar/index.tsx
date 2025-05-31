import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Menu, X, ChevronDown } from 'lucide-react';
import LogoIcon from '../../../../../assets/dashboard/Educator/home-page/logo.png';
import LogoutModal from './modals/LogoutModal';

interface HeaderProps {
    className?: string;
}

interface NavItem {
    id: string;
    label: string;
    action?: () => void;
    link?: string;
    subItems?: NavItem[];
}

const CleanHeader: React.FC<HeaderProps> = ({ className = '' }) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const submenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const navigationItems: NavItem[] = [
        {
            id: 'about',
            label: 'About Us',
            action: () => {
                console.log('About us clicked');
                setShowMenu(false);
            }
        },
        {
            id: 'resources',
            label: 'Resources',
            subItems: [
                {
                    id: 'pbl-guide',
                    label: 'PBL Orientation Guide',
                    action: () => {
                        console.log('PBL Guide clicked');
                        setShowMenu(false);
                        setActiveSubmenu(null);
                    }
                },
                {
                    id: 'design-journal',
                    label: "Design Thinkers' Journal",
                    action: () => {
                        console.log('Design Journal clicked');
                        setShowMenu(false);
                        setActiveSubmenu(null);
                    }
                }
            ]
        },
        {
            id: 'support',
            label: 'Support',
            action: () => {
                console.log('Support clicked');
                setShowMenu(false);
            }
        }
    ];

    const openLogoutModal = () => setShowLogoutModal(true);
    const closeLogoutModal = () => setShowLogoutModal(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
        setActiveSubmenu(null);
    };

    const toggleSubmenu = (itemId: string, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setActiveSubmenu(activeSubmenu === itemId ? null : itemId);
    };

    const handleSubmenuClick = (subItem: NavItem, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        subItem.action?.();
        setActiveSubmenu(null);
    };

    // Close menu and submenu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Check if click is outside menu
            if (menuRef.current && !menuRef.current.contains(target)) {
                setShowMenu(false);
            }

            // Check if click is outside any active submenu
            if (activeSubmenu) {
                const submenuElement = submenuRefs.current[activeSubmenu];
                if (submenuElement && !submenuElement.contains(target)) {
                    // Also check if the click is not on the submenu button itself
                    const submenuButton = submenuElement.previousElementSibling;
                    if (submenuButton && !submenuButton.contains(target)) {
                        setActiveSubmenu(null);
                    }
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu, activeSubmenu]);

    return (
        <>
            <header className={`fixed top-0 right-0 left-0 flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16 sm:h-[70px] bg-white z-[30] ${className}`}>
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 cursor-pointer">
                    <img src={LogoIcon} alt="Britannica Education Logo" className="h-[36px] object-cover" />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navigationItems.map((item) => (
                        <div key={item.id} className="relative">
                            {item.subItems ? (
                                <>
                                    <button
                                        onClick={(e) => toggleSubmenu(item.id, e)}
                                        className="flex items-center gap-1 px-3 py-2 text-textColor hover:text-primary font-bold transition-colors duration-200 cursor-pointer"
                                    >
                                        <span className="transition-colors duration-200">{item.label}</span>
                                        <ChevronDown
                                            size={14}
                                            className={`transition-transform duration-200 ${activeSubmenu === item.id ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {/* Desktop Dropdown */}
                                    <div
                                        ref={(el) => { submenuRefs.current[item.id] = el; }}
                                        className={`absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg  transition-all duration-200 z-40 ${activeSubmenu === item.id ? 'opacity-100 visible' : 'opacity-0 invisible'
                                            }`}
                                    >
                                        <div className="py-1">
                                            {item.subItems.map((subItem) => (
                                                <button
                                                    key={subItem.id}
                                                    onClick={(e) => handleSubmenuClick(subItem, e)}
                                                    className="w-full px-4 py-3 text-left text-textColor hover:text-primary hover:bg-third transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg cursor-pointer"
                                                >
                                                    {subItem.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <button
                                    onClick={item.action}
                                    className="px-3 py-2 text-textColor hover:text-primary font-bold transition-colors duration-200 cursor-pointer"
                                >
                                    {item.label}
                                </button>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Right side - Desktop */}
                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={openLogoutModal}
                        className="bg-primary hover:bg-hover text-white px-6 py-2.5 rounded-lg font-bold cursor-pointer flex items-center gap-2 transition-all duration-200"
                    >
                        <LogOut size={16} />
                        <span className="font-bold">Log out</span>
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-3">
                    <button
                        onClick={openLogoutModal}
                        className="bg-primary hover:bg-hover text-white p-2.5 rounded-lg cursor-pointer transition-all duration-200"
                    >
                        <LogOut size={16} />
                    </button>

                    <button
                        onClick={toggleMenu}
                        className="p-2 text-textColor hover:text-primary transition-colors duration-200 cursor-pointer"
                    >
                        {showMenu ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {showMenu && (
                <div className="fixed inset-0 bg-black/40 bg-opacity-50 backdrop-blur-sm z-[25] md:hidden" onClick={() => setShowMenu(false)} />
            )}

            {/* Mobile Menu */}
            <div
                ref={menuRef}
                className={`fixed top-16 right-0 w-80 max-w-[90vw] bg-white z-[26] transform transition-transform duration-300 md:hidden ${showMenu ? 'translate-x-0' : 'translate-x-full'
                    }`}
                style={{ height: 'calc(100vh - 4rem)' }}
            >
                <div className="p-6">
                    <nav className="space-y-2">
                        {navigationItems.map((item) => (
                            <div key={item.id} className="pb-4 last:pb-0">
                                {item.subItems ? (
                                    <>
                                        <button
                                            onClick={(e) => toggleSubmenu(item.id, e)}
                                            className="w-full flex items-center justify-between py-3 text-textColor hover:text-primary font-bold transition-colors duration-200 cursor-pointer"
                                        >
                                            <span className="text-lg">{item.label}</span>
                                            <ChevronDown
                                                size={16}
                                                className={`transition-transform duration-200 ${activeSubmenu === item.id ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        {/* Mobile Submenu */}
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ${activeSubmenu === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                }`}
                                        >
                                            <div className="pl-4 pt-2 space-y-1">
                                                {item.subItems.map((subItem) => (
                                                    <button
                                                        key={subItem.id}
                                                        onClick={(e) => handleSubmenuClick(subItem, e)}
                                                        className="block w-full text-left py-2.5 px-3 text-textColor hover:text-primary hover:bg-third rounded-lg transition-colors duration-150 cursor-pointer"
                                                    >
                                                        {subItem.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <button
                                        onClick={item.action}
                                        className="w-full text-left py-3 text-lg text-textColor hover:text-primary font-bold transition-colors duration-200 cursor-pointer"
                                    >
                                        {item.label}
                                    </button>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

            {showLogoutModal && <LogoutModal onClose={closeLogoutModal} />}
        </>
    );
};

export default CleanHeader;