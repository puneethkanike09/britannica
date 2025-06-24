import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import DownloadIcon from '../../../assets/dashboard/Admin/report/download.svg';
import toast from 'react-hot-toast';
import Loader from '../../../components/common/Loader';

export default function Report() {
    // State with explicit types
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const itemsPerPage: number = 6;

    // Activity logs with typed array, removing date field
    const activityLogs: ActivityLog[] = [
        {
            id: 1,
            time: '10:30 AM',
            activity: 'Login',
            user: 'Amitha',
            userId: 'Amitha@123',
            schoolName: 'Horizon Valley School',
            activityTimeStamp: '10:30 AM'
        },
        {
            id: 2,
            time: '11:30 AM',
            activity: 'Viewed grade 3 Pdf',
            user: 'Sagar',
            userId: 'Sagar@123',
            schoolName: 'Lumina School',
            activityTimeStamp: '11:30 AM'
        },
        {
            id: 3,
            time: '11:30 AM',
            activity: 'Downloaded grade 3 pdf',
            user: 'Vidya',
            userId: 'Vidya@123',
            schoolName: 'Prism Path School',
            activityTimeStamp: '11:30 AM'
        },
        {
            id: 4,
            time: '9:33 AM',
            activity: 'Logout',
            user: 'Puneeth',
            userId: 'Puneeth@123',
            schoolName: 'Nexus Scholars School',
            activityTimeStamp: '9:33 AM'
        },
        {
            id: 5,
            time: '2:15 PM',
            activity: 'Updated profile',
            user: 'Amitha',
            userId: 'Amitha@123',
            schoolName: 'Horizon Valley School',
            activityTimeStamp: '2:15 PM'
        },
        {
            id: 6,
            time: '3:45 PM',
            activity: 'Created new report',
            user: 'Sagar',
            userId: 'Sagar@123',
            schoolName: 'Lumina School',
            activityTimeStamp: '3:45 PM'
        },
        {
            id: 7,
            time: '8:20 AM',
            activity: 'Login',
            user: 'Amitha',
            userId: 'Amitha@123',
            schoolName: 'Horizon Valley School',
            activityTimeStamp: '8:20 AM'
        },
        {
            id: 8,
            time: '10:00 AM',
            activity: 'Viewed dashboard',
            user: 'Sagar',
            userId: 'Sagar@123',
            schoolName: 'Lumina School',
            activityTimeStamp: '10:00 AM'
        },
    ];

    // Simulate loading for 2 seconds on component mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Calculate total pages
    const totalPages: number = Math.ceil(activityLogs.length / itemsPerPage);

    // Get current items
    const indexOfLastItem: number = currentPage * itemsPerPage;
    const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
    const currentItems: ActivityLog[] = activityLogs.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    // Change page
    const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

    // Generate page numbers with ellipsis
    const getPageNumbers = (): (number | string)[] => {
        const pageNumbers: (number | string)[] = [];

        if (totalPages <= 4) {
            // If 4 or fewer pages, show all page numbers
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always show first page
            pageNumbers.push(1);

            if (currentPage <= 2) {
                // Near the beginning
                pageNumbers.push(2, 3, '...');
            } else if (currentPage >= totalPages - 1) {
                // Near the end
                pageNumbers.push('...', totalPages - 2, totalPages - 1);
            } else {
                // Middle - show current page, one before and one after
                pageNumbers.push(
                    '...',
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    '...'
                );
            }

            // Always show last page
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    const handleDownload = (): void => {
        setIsDownloading(true);
        toast.promise(
            new Promise((resolve) => {
                setTimeout(() => {
                    // Simulate a successful download API call
                    resolve('Report downloaded successfully!');
                }, 2000); // Simulate 2-second API call
            }),
            {
                loading: 'Downloading report...',
                success: () => {
                    setIsDownloading(false);
                    return 'Report downloaded successfully!';
                },
                error: (err) => {
                    setIsDownloading(false);
                    return `Error: ${err.message}`;
                },
            }
        );
    };

    return (
        <div className="max-w-full mx-auto rounded-lg sm:p-7 bg-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">Report</h1>

                <button
                    onClick={handleDownload}
                    disabled={isDownloading || isLoading}
                    className={`bg-primary hover:bg-hover text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 ${isDownloading || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                >
                    <img src={DownloadIcon} alt="Download" className="h-5 w-5" />
                    <span className="hidden md:inline font-bold">Download</span>
                </button>
            </div>

            {/* Date Range Selectors */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="relative w-full sm:w-auto">
                    <DatePicker
                        selected={fromDate}
                        onChange={(date: Date | null) => setFromDate(date)}
                        placeholderText="From Date"
                        dateFormat="MM/dd/yyyy"
                        className="w-full sm:min-w-[180px] pl-12 pr-4 py-3 border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder"
                        disabled={isLoading}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <Calendar className="w-5 h-5 text-inputPlaceholder" />
                    </div>
                </div>

                <div className="relative w-full sm:w-auto">
                    <DatePicker
                        selected={toDate}
                        onChange={(date: Date | null) => setToDate(date)}
                        placeholderText="To Date"
                        dateFormat="MM/dd/yyyy"
                        className="w-full sm:min-w-[180px] pl-12 pr-4 py-3 border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder"
                        disabled={isLoading}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <Calendar className="w-5 h-5 text-inputPlaceholder" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col">
                <div className="overflow-x-auto w-full rounded-lg">
                    <table className="w-full min-w-[800px]">
                        <colgroup>
                            <col className="w-[15%] min-w-[120px]" />
                            <col className="w-[25%] min-w-[200px]" />
                            <col className="w-[15%] min-w-[120px]" />
                            <col className="w-[20%] min-w-[160px]" />
                            <col className="w-[25%] min-w-[200px]" />
                        </colgroup>
                        <thead>
                            <tr className="bg-secondary text-white">
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">
                                    Time
                                </th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">
                                    Activity
                                </th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">
                                    Users
                                </th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">
                                    User ID
                                </th>
                                <th className="px-8 py-4 text-left font-black">
                                    School Name
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16">
                                        <Loader message="Loading activity logs..." />
                                    </td>
                                </tr>
                            ) : activityLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center text-textColor">
                                        No activity logs found.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((log, index) => (
                                    <tr
                                        key={log.id}
                                        className={index % 2 === 1 ? 'bg-third' : 'bg-white'}
                                    >
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{log.time}</div>
                                        </td>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{log.activity}</div>
                                        </td>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{log.user}</div>
                                        </td>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{log.userId}</div>
                                        </td>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{log.schoolName}</div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!isLoading && totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6 w-full">
                        <nav className="flex items-center space-x-1">
                            <button
                                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded ${currentPage === 1
                                    ? 'text-gray cursor-not-allowed'
                                    : 'text-textColor cursor-pointer hover:bg-third'
                                    }`}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            {getPageNumbers().map((number, index) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        typeof number === 'number' && paginate(number)
                                    }
                                    className={`px-[10px] py-1 rounded cursor-pointer ${number === currentPage
                                        ? 'bg-secondary text-white'
                                        : typeof number === 'number'
                                            ? 'text-textColor hover:bg-third'
                                            : 'text-darkGray'
                                        }`}
                                    disabled={typeof number !== 'number'}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                onClick={() =>
                                    currentPage < totalPages && paginate(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded ${currentPage === totalPages
                                    ? 'text-gray cursor-not-allowed'
                                    : 'text-textColor cursor-pointer hover:bg-third'
                                    }`}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}

export interface ActivityLog {
    id: number;
    time: string;
    activity: string;
    user: string;
    userId: string;
    schoolName: string;
    activityTimeStamp: string;
}