import AdminLayout from '../AdminLayout';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import CalendarIcon from '../components/common/CalendarIcon';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// Import the download icon
import DownloadIcon from '../../../assets/dashboard/Admin/report/download.svg';

export default function Report() {
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const activityLogs = [
        {
            id: 1,
            date: "03/05/2023",
            time: "10:30 AM",
            activity: "Login",
            user: "Amitha",
        },
        {
            id: 2,
            date: "11/7/2024",
            time: "11:30 AM",
            activity: "Viewed grade 3 Pdf",
            user: "Sagar",
        },
        {
            id: 3,
            date: "03/05/2023",
            time: "10:30 PM",
            activity: "Downloaded grade 3 pdf",
            user: "Amitha",
        },
        {
            id: 4,
            date: "11/7/2024",
            time: "9:33 AM",
            activity: "Logout",
            user: "Sagar",
        },
        {
            id: 5,
            date: "03/06/2023",
            time: "2:15 PM",
            activity: "Updated profile",
            user: "Amitha",
        },
        {
            id: 6,
            date: "11/8/2024",
            time: "3:45 PM",
            activity: "Created new report",
            user: "Sagar",
        },
        {
            id: 7,
            date: "03/07/2023",
            time: "8:20 AM",
            activity: "Login",
            user: "Amitha",
        },
        {
            id: 8,
            date: "11/9/2024",
            time: "10:00 AM",
            activity: "Viewed dashboard",
            user: "Sagar",
        },
    ];

    // Calculate total pages
    const totalPages = Math.ceil(activityLogs.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = activityLogs.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pageNumbers = [];

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
                pageNumbers.push('...', currentPage - 1, currentPage, currentPage + 1, '...');
            }

            // Always show last page
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-secondary">Report</h1>
                    <button className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-lg font-medium cursor-pointer flex items-center gap-2">
                        <img src={DownloadIcon} alt="Download" className="h-5 w-5" />
                        <span>Download</span>
                    </button>
                </div>

                {/* Date Range Selectors */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative">
                        <DatePicker
                            selected={fromDate}
                            onChange={(date: Date | null) => setFromDate(date)}
                            placeholderText="From Date"
                            dateFormat="MM/dd/yyyy"
                            className=" pl-12 pr-4 py-3  border border-gray-300 rounded-lg text-base bg-primary/5 placeholder:text-gray-400  min-w-[180px]"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <CalendarIcon />
                        </div>
                    </div>

                    <div className="relative">
                        <DatePicker
                            selected={toDate}
                            onChange={(date: Date | null) => setToDate(date)}
                            placeholderText="To Date"
                            dateFormat="MM/dd/yyyy"
                            className=" pl-12 pr-4 py-3  border border-gray-300 rounded-lg text-base bg-primary/5 placeholder:text-gray-400  min-w-[180px]"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <CalendarIcon />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="overflow-x-auto w-full rounded-lg">
                        <table className="w-full table-fixed min-w-[800px]">
                            <colgroup>
                                <col className="w-48" />
                                <col className="w-48" />
                                <col className="w-64" />
                                <col className="w-48" />
                            </colgroup>
                            <thead>
                                <tr className="bg-indigo-900 text-white">
                                    <th className="px-4 py-4 border-r-2 border-white text-left font-semibold">Date</th>
                                    <th className="px-4 py-4 border-r-2 border-white text-left font-semibold">Time</th>
                                    <th className="px-4 py-4 border-r-2 border-white text-left font-semibold">Activity</th>
                                    <th className="px-4 py-4 border-r-2 border-white text-left font-semibold">Users</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((log, index) => (
                                    <tr key={log.id} className={index % 2 === 1 ? "bg-sky-50" : "bg-white"}>
                                        <td className="px-4 py-4 break-words">
                                            <div className="text-gray-700">{log.date}</div>
                                        </td>
                                        <td className="px-4 py-4 break-words">
                                            <div className="text-gray-700">{log.time}</div>
                                        </td>
                                        <td className="px-4 py-4 break-words">
                                            <div className="text-gray-700">{log.activity}</div>
                                        </td>
                                        <td className="px-4 py-4 break-words">
                                            <div className="text-gray-700">{log.user}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-6 w-full">
                            <nav className="flex items-center space-x-1">
                                <button
                                    onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-secondary cursor-pointer hover:bg-[#f0f9ff]'}`}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>

                                {getPageNumbers().map((number, index) => (
                                    <button
                                        key={index}
                                        onClick={() => typeof number === 'number' && paginate(number)}
                                        className={`px-[10px] py-1 rounded cursor-pointer ${number === currentPage ? 'bg-secondary text-white' : typeof number === 'number' ? 'text-secondary hover:bg-[#f0f9ff]' : 'text-gray-500'}`}
                                        disabled={typeof number !== 'number'}
                                    >
                                        {number}
                                    </button>
                                ))}

                                <button
                                    onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-secondary cursor-pointer hover:bg-[#f0f9ff]'}`}
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}