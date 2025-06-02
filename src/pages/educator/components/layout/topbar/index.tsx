import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Menu, X, ChevronDown } from 'lucide-react';
import LogoIcon from '../../../../../assets/dashboard/Educator/home-page/logo.png';
import LogoutModal from './modals/LogoutModal';
import { EDUCATOR_NAV_ITEMS } from '../../../../../config/constants/Educator/topbar';

const CleanHeader: React.FC = () => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
    const [isMobileResourcesOpen, setIsMobileResourcesOpen] = useState(false);
    const resourcesDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isResourcesDropdownOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                resourcesDropdownRef.current &&
                !resourcesDropdownRef.current.contains(event.target as Node)
            ) {
                setIsResourcesDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isResourcesDropdownOpen]);

    const openLogoutModal = () => setShowLogoutModal(true);
    const closeLogoutModal = () => setShowLogoutModal(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            <header className={`fixed top-0 right-0 left-0 flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16 sm:h-[70px] bg-white z-20 shadow-sm`}>
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 cursor-pointer">
                    <img src={LogoIcon} alt="Britannica Education Logo" className="h-[36px] object-cover" />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {EDUCATOR_NAV_ITEMS.map((item) =>
                        item.dropdown ? (
                            <div className="relative" ref={resourcesDropdownRef} key={item.label}>
                                <button
                                    onClick={() => setIsResourcesDropdownOpen(!isResourcesDropdownOpen)}
                                    className="flex cursor-pointer items-center gap-1 text-textColor hover:text-primary font-medium transition-colors duration-200"
                                >
                                    {item.label}
                                    <ChevronDown size={16} className={`transition-transform duration-200 ${isResourcesDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isResourcesDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-3 w-64 bg-white border border-third rounded-lg shadow-lg py-2 ">
                                        {item.dropdown.map((sub) => (
                                            <Link
                                                to={sub.to}
                                                key={sub.label}
                                                className="block px-4 py-3 text-textColor hover:bg-third hover:text-primary transition-colors duration-200"
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to={item.to || ''}
                                key={item.label}
                                className="text-textColor hover:text-primary font-medium transition-colors duration-200"
                            >
                                {item.label}
                            </Link>
                        )
                    )}
                    {/* Logout Button */}
                    <button
                        onClick={openLogoutModal}
                        className="bg-primary hover:bg-hover text-white px-6 py-2.5 rounded-lg font-bold cursor-pointer flex items-center gap-2 transition-all duration-200"
                    >
                        <LogOut size={16} />
                        <span className="font-bold">Log out</span>
                    </button>
                </nav>

                {/* Mobile Right Section - Logout Button + Menu Button */}
                <div className="md:hidden flex items-center gap-2">
                    {/* Mobile Logout Button (Icon only) */}
                    <button
                        onClick={openLogoutModal}
                        className="p-2 text-textColor hover:text-primary transition-colors duration-200"
                        aria-label="Log out"
                    >
                        <LogOut size={20} />
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="p-2 text-textColor hover:text-primary transition-colors duration-200"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div className={`fixed top-16 sm:top-[70px] right-0 w-80 max-w-[90vw] h-[calc(100vh-4rem)] sm:h-[calc(100vh-70px)] bg-white shadow-xl transform transition-transform duration-300 ease-in-out  md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}>
                    <nav className="flex flex-col p-6 gap-2">
                        {/* About us */}
                        <Link
                            to=""
                            className="py-3 px-4 text-textColor hover:bg-third hover:text-primary rounded-lg transition-colors duration-200 font-medium"
                            onClick={closeMobileMenu}
                        >
                            About us
                        </Link>

                        {/* Resources */}
                        <div className="py-3 px-4">
                            <button
                                onClick={() => setIsMobileResourcesOpen(!isMobileResourcesOpen)}
                                className="flex items-center justify-between w-full text-textColor hover:text-primary font-medium transition-colors duration-200"
                            >
                                Resources
                                <ChevronDown size={16} className={`transition-transform duration-200 ${isMobileResourcesOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Mobile Resources Submenu */}
                            {isMobileResourcesOpen && (
                                <div className="mt-3 ml-4 space-y-2">
                                    <Link
                                        to=""
                                        className="block py-2 px-3 text-textColor hover:bg-third hover:text-primary rounded-lg transition-colors duration-200"
                                        onClick={closeMobileMenu}
                                    >
                                        PBL Orientation Guide
                                    </Link>
                                    <Link
                                        to=""
                                        className="block py-2 px-3 text-textColor hover:bg-third hover:text-primary rounded-lg transition-colors duration-200"
                                        onClick={closeMobileMenu}
                                    >
                                        Design Thinkers' Journal
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Support */}
                        <Link
                            to=""
                            className="py-3 px-4 text-textColor hover:bg-third hover:text-primary rounded-lg transition-colors duration-200 font-medium"
                            onClick={closeMobileMenu}
                        >
                            Support
                        </Link>
                    </nav>
                </div>
            </header>
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40  backdrop-blur-xs z-10 md:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            {showLogoutModal && <LogoutModal onClose={closeLogoutModal} />}
        </>
    );
};

export default CleanHeader;