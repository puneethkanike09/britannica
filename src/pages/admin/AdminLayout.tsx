import React, { ReactNode, useState } from 'react';
import Sidebar from './components/layout/sidebar';
import Topbar from './components/layout/topbar';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const openLogoutModal = () => {
        setShowLogoutModal(true);
    };

    const closeLogoutModal = () => {
        setShowLogoutModal(false);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen w-full overflow-hidden">
            <Sidebar showLogoutModal={showLogoutModal} onCloseLogoutModal={closeLogoutModal} />
            <div className="flex-1 flex flex-col min-w-0 w-full md:ml-[320px]">
                <Topbar onOpenLogoutModal={openLogoutModal} />
                <main className="p-6 flex-1 overflow-x-auto w-full mt-[81px]">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;