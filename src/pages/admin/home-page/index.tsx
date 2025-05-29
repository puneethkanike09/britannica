import React from 'react';

// Import SVG files instead of Font Awesome icons
import TeachersIcon from '../../../assets/dashboard/Admin/home-page/teachers.svg';
import LoginsIcon from '../../../assets/dashboard/Admin/home-page/logins.svg';
import DownloadsIcon from '../../../assets/dashboard/Admin/home-page/downloads.svg';

const AdminDashboard: React.FC = () => {
    return (
        <div className="max-w-full rounded-lg sm:p-10 bg-white mx-auto ">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-2">
                Welcome to the Britannica Education
            </h1>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-6 sm:mb-8">
                Admin Dashboard
            </h2>

            <div className="grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-3  gap-4 sm:gap-6 mt-4 sm:mt-6">
                <div className="bg-third p-4 sm:p-10 rounded-lg relative min-h-[150px]">
                    <img
                        src={TeachersIcon}
                        alt="Teachers"
                        className="absolute top-4 sm:top-6 right-4 sm:right-6 h-10 w-10 sm:h-12 sm:w-12 lg:h-12 lg:w-12"
                    />
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-green mb-2">50</div>
                    <div className="text-secondary font-semibold text-base sm:text-lg">Total No. of Teachers</div>
                </div>

                <div className="bg-third p-4 sm:p-10 rounded-lg relative min-h-[150px]">
                    <img
                        src={LoginsIcon}
                        alt="Logins"
                        className="absolute top-4 sm:top-6 right-4 sm:right-6 h-11 w-11 sm:h-13 sm:w-13 lg:h-13 lg:w-13"
                    />
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-yellow mb-2">10</div>
                    <div className="text-secondary font-semibold text-base sm:text-lg">Total No. of Logins</div>
                </div>

                <div className="bg-third p-4 sm:p-10 rounded-lg relative min-h-[150px]">
                    <img
                        src={DownloadsIcon}
                        alt="Downloads"
                        className="absolute top-4 sm:top-6 right-4 sm:right-6 h-10 w-10 sm:h-12 sm:w-12 lg:h-12 lg:w-12"
                    />
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-orange mb-2">6</div>
                    <div className="text-secondary font-semibold text-base sm:text-lg">Total No. of Downloads</div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;