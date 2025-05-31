import React from 'react';
import { LogOut } from 'lucide-react';
import { TopbarProps } from '../../../../../types/admin';



const Topbar: React.FC<TopbarProps> = ({ onOpenLogoutModal, isSidebarCollapsed = false }) => {
    return (
        <header
            className={`fixed top-0 right-0 left-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:left-[80px]' : 'md:left-[320px]'
                } flex justify-between items-center px-6 2xl:px-6 h-[81px] bg-white border-b border-stone-400/40 z-30`}
        >
            <div className="md:hidden w-8"></div>
            <div className="hidden md:block"></div>
            <button
                onClick={onOpenLogoutModal}
                className="bg-primary hover:bg-hover text-white px-8 py-3 rounded-lg font-medium cursor-pointer flex items-center gap-2"
            >
                <LogOut className='font-black' size={18} />
                <span className="hidden md:inline font-bold">Log out</span>
            </button>
        </header>
    );
};

export default Topbar;