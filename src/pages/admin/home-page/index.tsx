import React, { useState, useEffect } from 'react';
import Loader from '../../../components/common/Loader';
// Removed: import { EducatorService } from '../../../services/admin/educatorService';
import toast from 'react-hot-toast';
import { DashboardService } from '../../../services/admin/dashboardService';

// Import SVG files
import EducatorsIcon from '../../../assets/dashboard/Admin/home-page/educators.svg';
import LoginsIcon from '../../../assets/dashboard/Admin/home-page/logins.svg';
import DownloadsIcon from '../../../assets/dashboard/Admin/home-page/downloads.svg';
import { DashboardCard } from '../../../types/admin';

const AdminDashboard: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [educatorCount, setEducatorCount] = useState<number>(0);
    const [loginsCount, setLoginsCount] = useState<number>(0);
    const [downloadsCount, setDownloadsCount] = useState<number>(0);

    useEffect(() => {
        const fetchDashboardCounts = async () => {
            try {
                setIsLoading(true);
                const response = await DashboardService.fetchDashboardCounts();
                if (response.error === false || response.error === 'false') {
                    setEducatorCount(response.totalEducator || 0);
                    setLoginsCount(response.totalLogins || 0);
                    setDownloadsCount(response.totalDownloads || 0);
                } else {
                    setEducatorCount(0);
                    setLoginsCount(0);
                    setDownloadsCount(0);
                    toast.error(response.message ?? "Failed to load dashboard counts");
                }
            } catch (error) {
                console.error("Error fetching dashboard counts:", error);
                setEducatorCount(0);
                setLoginsCount(0);
                setDownloadsCount(0);
                toast.error("Failed to load dashboard counts");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardCounts();
    }, []);

    const dashboardCards: DashboardCard[] = [
        {
            id: 'educators',
            title: 'Total Educators',
            value: educatorCount,
            icon: EducatorsIcon,
            alt: 'Educators',
            colorClass: 'text-green',
            iconSize: 'md'
        },
        {
            id: 'logins',
            title: 'Total Logins',
            value: loginsCount,
            icon: LoginsIcon,
            alt: 'Logins',
            colorClass: 'text-yellow',
            iconSize: 'lg'
        },
        {
            id: 'downloads',
            title: 'Total Downloads',
            value: downloadsCount,
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
                        {isLoading ? (
                            <div className="h-[60px] sm:h-[72px] lg:h-[84px] flex items-center justify-start">
                                <Loader />
                            </div>
                        ) : (
                            <div className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${card.colorClass} mb-2`}>
                                {card.value.toLocaleString()}
                            </div>
                        )}
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
