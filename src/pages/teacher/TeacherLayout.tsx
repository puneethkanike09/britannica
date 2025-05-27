import React, { ReactNode } from 'react';

interface TeacherLayoutProps {
    children: ReactNode;
    showBackButton?: boolean;
    onBack?: () => void;
}

const TeacherLayout: React.FC<TeacherLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen w-full bg-white">
            <main className="">{children}</main>
        </div>
    );
};

export default TeacherLayout;