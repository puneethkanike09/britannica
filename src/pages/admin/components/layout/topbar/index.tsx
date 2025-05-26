import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import LogoutModal from './modals/LogoutModal';

const Topbar: React.FC = () => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const openLogoutModal = () => {
        setShowLogoutModal(true);
    };

    const closeLogoutModal = () => {
        setShowLogoutModal(false);
    };

    return (
        <header className="fixed top-0 right-0 left-0 md:left-[320px] flex justify-between items-center px-6 2xl:px-8 h-[81px] bg-white border-b border-stone-400/40 z-30">
            <div className="md:hidden w-8"></div>
            <div className="hidden md:block">

            </div>
            <button
                onClick={openLogoutModal}
                className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-lg font-medium cursor-pointer flex items-center gap-2"
            >
                <LogOut size={18} />
                <span className="hidden md:inline">Log out</span>
            </button>

            {showLogoutModal && <LogoutModal onClose={closeLogoutModal} />}
        </header>
    );
};

export default Topbar;