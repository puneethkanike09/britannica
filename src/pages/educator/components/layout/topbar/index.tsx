import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, X, ChevronDown } from "lucide-react";
import LogoIcon from "../../../../../assets/dashboard/Educator/home-page/logo.png";
import LogoutModal from "./modals/LogoutModal";
import UnregisterReasonModal from "./modals/UnregisterReasonModal";
import { EDUCATOR_NAV_ITEMS } from "../../../../../config/constants/Educator/topbar";

const Topbar: React.FC = () => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showUnregisterModal, setShowUnregisterModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
    const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
    const [isSupportDropdownOpen, setIsSupportDropdownOpen] = useState(false);
    const [isMobileResourcesOpen, setIsMobileResourcesOpen] = useState(false);
    const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
    const [isMobileSupportOpen, setIsMobileSupportOpen] = useState(false);
    const resourcesDropdownRef = useRef<HTMLDivElement>(null);
    const settingsDropdownRef = useRef<HTMLDivElement>(null);
    const supportDropdownRef = useRef<HTMLDivElement>(null);

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

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isResourcesDropdownOpen]);

    useEffect(() => {
        if (!isSettingsDropdownOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                settingsDropdownRef.current &&
                !settingsDropdownRef.current.contains(event.target as Node)
            ) {
                setIsSettingsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSettingsDropdownOpen]);

    useEffect(() => {
        if (!isSupportDropdownOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                supportDropdownRef.current &&
                !supportDropdownRef.current.contains(event.target as Node)
            ) {
                setIsSupportDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSupportDropdownOpen]);

    const openLogoutModal = () => setShowLogoutModal(true);
    const closeLogoutModal = () => setShowLogoutModal(false);

    const openUnregisterModal = () => setShowUnregisterModal(true);
    const closeUnregisterModal = () => setShowUnregisterModal(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const handleUnregisterAccount = (reason: string) => {
        console.log("Unregister account with reason:", reason);
        setIsSettingsDropdownOpen(false);
    };

    return (
        <>
            <header
                className={`fixed top-0 right-0 left-0 flex justify-between items-center px-4 sm:px-6 lg:px-6 h-16 sm:h-[81px] bg-white z-20 shadow-sm`}
            >
                {/* Logo */}
                <Link to="/educator-dashboard" className="flex items-center gap-3 cursor-pointer">
                    <img src={LogoIcon} alt="Britannica Education Logo" className="h-[40px] object-cover" />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {EDUCATOR_NAV_ITEMS.map((item) =>
                        item.dropdown ? (
                            <div className="relative" ref={item.label === "Resources" ? resourcesDropdownRef : item.label === "Support" ? supportDropdownRef : settingsDropdownRef} key={item.label}>
                                <button
                                    onClick={() => {
if (item.label === "Resources") {
    setIsResourcesDropdownOpen(!isResourcesDropdownOpen);
    setIsSupportDropdownOpen(false);
    setIsSettingsDropdownOpen(false);
} else if (item.label === "Support") {
    setIsSupportDropdownOpen(!isSupportDropdownOpen);
    setIsResourcesDropdownOpen(false);
    setIsSettingsDropdownOpen(false);
} else {
    setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
    setIsResourcesDropdownOpen(false);
    setIsSupportDropdownOpen(false);
}
                                    }}
                                    className="flex cursor-pointer items-center gap-1 text-textColor hover:text-primary font-medium transition-colors duration-300"
                                >
                                    {item.label}
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-300 ${
                                            (item.label === "Resources" && isResourcesDropdownOpen) ||
                                            (item.label === "Support" && isSupportDropdownOpen) ||
                                            (item.label === "Settings" && isSettingsDropdownOpen)
                                                ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>
                                {((item.label === "Resources" && isResourcesDropdownOpen) ||
                                  (item.label === "Support" && isSupportDropdownOpen) ||
                                  (item.label === "Settings" && isSettingsDropdownOpen)) && (
                                    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white border border-third rounded-lg shadow-lg ${
                                        item.label === "Support" ? "w-96 max-w-[90vw] py-4 px-6 text-sm text-textColor" : "w-56 py-2"
                                    }`}>
                                        {item.label === "Support" ? (
                                            <div>
                                                <div className="font-bold mb-1">Technical & Academic Support</div>
                                                <div className="mb-2">We are committed to providing prompt and effective assistance. If you're experiencing technical issues or product-related queries, please reach out to our support team.</div>
                                                <div className="mb-1"><span className="font-bold">Email:</span> <a href="mailto:contact@britannica.in" className="text-primary underline">contact@britannica.in</a></div>
                                                <div className="mb-1"><span className="font-bold">Phone:</span> <a href="tel:+918448569920" className="text-primary underline">+91 8448-569920</a></div>
                                                <div><span className="font-bold">Availability:</span> Official working hours from 9:00 AM to 6:00 PM (Monday to Friday)</div>
                                            </div>
                                        ) : (
                                            item.dropdown.map((sub, index) =>
                                                sub.content ? (
                                                    <div
                                                        key={index}
                                                        className="px-4 py-3 text-sm text-textColor whitespace-pre-line leading-relaxed"
                                                    >
                                                        {sub.content}
                                                    </div>
                                                ) : sub.label === "Unregister Account" ? (
                                                <button
                                                    key={sub.label}
                                                    onClick={() => {
                                                        openUnregisterModal();
                                                        setIsSettingsDropdownOpen(false);
                                                    }}
                                                    className="block cursor-pointer w-full text-left px-4 py-3 text-textColor hover:bg-third hover:text-primary transition-colors duration-300"
                                                >
                                                    {sub.label}
                                                </button>
                                            ) : sub.isExternal ? (
                                                <a
                                                    href={sub.to}
                                                    key={sub.label}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block px-4 py-3 text-textColor hover:bg-third hover:text-primary transition-colors duration-300"
                                                >
                                                    {sub.label}
                                                </a>
                                            ) : (
                                                <Link
                                                    to={sub.to || ""}
                                                    key={sub.label}
                                                    className="block px-4 py-3 text-textColor hover:bg-third hover:text-primary transition-colors duration-300"
                                                >
                                                    {sub.label}
                                                </Link>
                                                )
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to={item.to || ""}
                                key={item.label}
                                className="text-textColor hover:text-primary font-medium transition-colors duration-300"
                            >
                                {item.label}
                            </Link>
                        )
                    )}

                    {/* Logout Button */}
                    <button
                        onClick={openLogoutModal}
                        className="bg-primary hover:bg-hover text-white px-8 py-3 font-bold rounded-lg font-medium cursor-pointer flex items-center gap-2"
                    >
                        <LogOut className="font-black" size={18} />
                        Log out
                    </button>
                </nav>

                {/* Mobile Right Section - Menu Button Only */}
                <div className="md:hidden flex items-center">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="text-textColor hover:text-primary transition-colors duration-300"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={`fixed top-16 sm:top-[70px] right-0 w-80 max-w-[90vw] h-[calc(100vh-4rem)] sm:h-[calc(100vh-70px)] bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <nav className="flex flex-col p-6 gap-2">
                        {EDUCATOR_NAV_ITEMS.map((item) =>
                            item.dropdown ? (
                                <div className="py-3 px-4" key={item.label}>
                                    <button
                                        onClick={() => {
                                            if (item.label === "Resources") {
                                                setIsMobileResourcesOpen(!isMobileResourcesOpen);
                                                setIsMobileSupportOpen(false);
                                                setIsMobileSettingsOpen(false);
                                            } else if (item.label === "Support") {
                                                setIsMobileSupportOpen(!isMobileSupportOpen);
                                                setIsMobileResourcesOpen(false);
                                                setIsMobileSettingsOpen(false);
                                            } else {
                                                setIsMobileSettingsOpen(!isMobileSettingsOpen);
                                                setIsMobileResourcesOpen(false);
                                                setIsMobileSupportOpen(false);
                                            }
                                        }}
                                        className="flex items-center justify-between w-full text-textColor hover:text-primary font-medium transition-colors duration-300"
                                    >
                                        {item.label}
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform duration-300 ${
                                                (item.label === "Resources" && isMobileResourcesOpen) ||
                                                (item.label === "Support" && isMobileSupportOpen) ||
                                                (item.label === "Settings" && isMobileSettingsOpen)
                                                    ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>
                                    {((item.label === "Resources" && isMobileResourcesOpen) ||
                                      (item.label === "Support" && isMobileSupportOpen) ||
                                      (item.label === "Settings" && isMobileSettingsOpen)) && (
                                        <div className={`mt-3 ml-4 space-y-2 ${
                                            item.label === "Support" ? "text-sm text-textColor" : ""
                                        }`}>
                                            {item.label === "Support" ? (
                                                <div>
                                                    <div className="font-bold mb-1">Technical & Academic Support</div>
                                                    <div className="mb-2">We are committed to providing prompt and effective assistance. If you're experiencing technical issues or product-related queries, please reach out to our support team.</div>
                                                    <div className="mb-1"><span className="font-bold">Email:</span> <a href="mailto:contact@britannica.in" className="text-primary underline">contact@britannica.in</a></div>
                                                    <div className="mb-1"><span className="font-bold">Phone:</span> <a href="tel:+918448569920" className="text-primary underline">+91 8448-569920</a></div>
                                                    <div><span className="font-bold">Availability:</span> Official working hours from 9:00 AM to 6:00 PM (Monday to Friday)</div>
                                                </div>
                                            ) : (
                                                item.dropdown.map((sub, index) =>
                                                    sub.content ? (
                                                        <div
                                                            key={index}
                                                            className="py-2 px-3 text-sm text-textColor whitespace-pre-line leading-relaxed"
                                                        >
                                                            {sub.content}
                                                        </div>
                                                    ) : sub.label === "Unregister Account" ? (
                                                    <button
                                                        key={sub.label}
                                                        onClick={() => {
                                                            openUnregisterModal();
                                                            closeMobileMenu();
                                                        }}
                                                        className="block w-full text-left py-2 px-3 text-textColor hover:bg-third hover:text-primary rounded-lg transition-colors duration-300"
                                                    >
                                                        {sub.label}
                                                    </button>
                                                ) : sub.isExternal ? (
                                                    <a
                                                        href={sub.to}
                                                        key={sub.label}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block py-2 px-3 text-textColor hover:bg-third hover:text-primary rounded-lg transition-colors duration-300"
                                                        onClick={closeMobileMenu}
                                                    >
                                                        {sub.label}
                                                    </a>
                                                ) : (
                                                    <Link
                                                        to={sub.to || ""}
                                                        key={sub.label}
                                                        className="block py-2 px-3 text-textColor hover:bg-third hover:text-primary rounded-lg transition-colors duration-300"
                                                        onClick={closeMobileMenu}
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                )
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to={item.to || ""}
                                    key={item.label}
                                    className="py-3 px-4 text-textColor hover:bg-third hover:text-primary rounded-lg transition-colors duration-300 font-medium"
                                    onClick={closeMobileMenu}
                                >
                                    {item.label}
                                </Link>
                            )
                        )}
                        {/* Mobile Logout Button */}
                        <button
                            onClick={() => {
                                openLogoutModal();
                                closeMobileMenu();
                            }}
                            className="flex items-center gap-2 w-full py-3 px-4 text-textColor hover:bg-third hover:text-primary rounded-lg transition-colors duration-300 font-medium"
                        >
                            <LogOut size={16} />
                            Log out
                        </button>
                    </nav>
                </div>
            </header>
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-xs z-10 md:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            {showLogoutModal && <LogoutModal onClose={closeLogoutModal} />}
            {showUnregisterModal && (
                <UnregisterReasonModal onClose={closeUnregisterModal} onUnregister={handleUnregisterAccount} />
            )}
        </>
    );
};

export default Topbar;