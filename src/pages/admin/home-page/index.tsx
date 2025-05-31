import React from 'react';


// Import SVG files
import EducatorsIcon from '../../../assets/dashboard/Admin/home-page/educators.svg';
import LoginsIcon from '../../../assets/dashboard/Admin/home-page/logins.svg';
import DownloadsIcon from '../../../assets/dashboard/Admin/home-page/downloads.svg';
import { DashboardCard } from '../../../types/admin';

const AdminDashboard: React.FC = () => {
    const dashboardCards: DashboardCard[] = [
        {
            id: 'educators',
            title: 'Total Educators',
            value: 50,
            icon: EducatorsIcon,
            alt: 'Educators',
            colorClass: 'text-green',
            iconSize: 'md'
        },
        {
            id: 'logins',
            title: 'Total Logins',
            value: 10,
            icon: LoginsIcon,
            alt: 'Logins',
            colorClass: 'text-yellow',
            iconSize: 'lg'
        },
        {
            id: 'downloads',
            title: 'Total Downloads',
            value: 6,
            icon: DownloadsIcon,
            alt: 'Downloads',
            colorClass: 'text-orange',
            iconSize: 'md'
        }
    ];

    const getIconSizeClasses = (size: string = 'md') => {
        const sizeMap = {
            sm: 'h-8 w-8 sm:h-10 sm:w-10 lg:h-10 lg:w-10',
            md: 'h-10 w-10 sm:h-12 sm:w-12 lg:h-12 lg:w-12',
            lg: 'h-11 w-11 sm:h-13 sm:w-13 lg:h-13 lg:w-13'
        };
        return sizeMap[size as keyof typeof sizeMap] || sizeMap.md;
    };

    return (
        <div className="max-w-full rounded-lg sm:p-7 bg-white mx-auto">
            {/* Header Section */}
            <header className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-2">
                    Welcome to the Britannica Education
                </h1>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary">
                    Admin Dashboard
                </h2>
            </header>

            {/* Cards Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
                {dashboardCards.map((card) => (
                    <div
                        key={card.id}
                        className="bg-third p-4 sm:p-10 rounded-lg relative min-h-[150px]"
                    >
                        <img
                            src={card.icon}
                            alt={card.alt}
                            className={`absolute top-4 sm:top-6 right-4 sm:right-6 ${getIconSizeClasses(card.iconSize)}`}
                        />
                        <div className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${card.colorClass} mb-2`}>
                            {card.value.toLocaleString()}
                        </div>
                        <div className="text-textColor font-semibold text-base sm:text-lg">
                            {card.title}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default AdminDashboard;

