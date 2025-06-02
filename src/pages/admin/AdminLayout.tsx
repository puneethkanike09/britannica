import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/layout/sidebar';
import Topbar from './components/layout/topbar';

const AdminLayout: React.FC = () => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        // Initialize from localStorage, default to false if not set
        return localStorage.getItem('sidebarCollapsed') === 'true';
    });

    // Sync localStorage whenever isSidebarCollapsed changes
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', isSidebarCollapsed.toString());
    }, [isSidebarCollapsed]);

    const openLogoutModal = () => {
        setShowLogoutModal(true);
    };

    const closeLogoutModal = () => {
        setShowLogoutModal(false);
    };

    const toggleSidebarCollapse = () => {
        setIsSidebarCollapsed((prev) => !prev);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen w-full overflow-hidden">
            <Sidebar
                showLogoutModal={showLogoutModal}
                onCloseLogoutModal={closeLogoutModal}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={toggleSidebarCollapse}
            />
            <div
                className={`flex-1 flex flex-col min-w-0 w-full transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-[90px]' : 'md:ml-[320px]'
                    }`}
            >
                <Topbar
                    onOpenLogoutModal={openLogoutModal}
                    isSidebarCollapsed={isSidebarCollapsed}
                />
                <main className="p-6 flex-1 sm:bg-gray/10 overflow-x-auto w-full mt-[81px]">
                    {/* This renders the matched child route */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;