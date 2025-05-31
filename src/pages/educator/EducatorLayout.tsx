import React from 'react';
import { Outlet } from 'react-router-dom';

const EducatorLayout: React.FC = () => {
    return (
        <div className="min-h-screen w-full bg-white">
            <main className="">
                {/* This renders the matched child route */}
                <Outlet />
            </main>
        </div>
    );
};

export default EducatorLayout;