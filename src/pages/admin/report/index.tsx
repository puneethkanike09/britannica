import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import DownloadIcon from '../../../assets/dashboard/Admin/report/download.svg';
import GenerateIcon from '../../../assets/dashboard/Admin/report/generate.svg';
import toast from 'react-hot-toast';
import Loader from '../../../components/common/Loader';
import { Report } from '../../../types/admin/report-management';
import { ReportService } from '../../../services/admin/reportService';

const ReportManagement: React.FC = () => {
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasGenerated, setHasGenerated] = useState<boolean>(false);
    const [errors, setErrors] = useState({
        fromDate: '',
        toDate: '',
    });
    const [reports, setReports] = useState<Report[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(5);

    // Convert Date to yyyy-mm-dd string
    const formatDate = (date: Date | null) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Fetch reports from API
    const fetchReports = async (page = currentPage, size = pageSize) => {
        if (!fromDate || !toDate) return;
        
        setIsLoading(true);
        try {
            const response = await ReportService.fetchReports({
                start_date: formatDate(fromDate),
                end_date: formatDate(toDate),
                page,
                size,
            });
            
            if (response.error === false || response.error === 'false') {
                setReports(response.reports || []);
                setTotalPages(response.totalPages || 1);
                setTotalElements(response.totalElements || 0);
                setPageSize(response.pageSize || size);
                setHasGenerated(true);
            } else {
                setReports([]);
                setTotalPages(1);
                setTotalElements(0);
                toast.error(response.message || 'Failed to fetch reports');
            }
        } catch (error) {
            setReports([]);
            setTotalPages(1);
            setTotalElements(0);
            toast.error('Failed to fetch reports');
            console.error('Fetch reports error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-fetch when pagination changes (only after initial generation)
    useEffect(() => {
        if (hasGenerated && fromDate && toDate) {
            fetchReports(currentPage, pageSize);
        }
    }, [currentPage, pageSize]);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const getPageNumbers = () => {
        const pageNumbers: (number | string)[] = [];
        if (totalPages <= 4) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);
            if (currentPage <= 2) {
                pageNumbers.push(2, 3, '...');
            } else if (currentPage >= totalPages - 1) {
                pageNumbers.push('...', totalPages - 2, totalPages - 1);
            } else {
                pageNumbers.push('...', currentPage - 1, currentPage, currentPage + 1, '...');
            }
            pageNumbers.push(totalPages);
        }
        return pageNumbers;
    };

    const handleFromDateChange = (date: Date | null) => {
        setFromDate(date);
        setCurrentPage(1);
        setHasGenerated(false);
        setReports([]);
        setTotalPages(1);
        setTotalElements(0);
        if (errors.fromDate) {
            setErrors((prev) => ({ ...prev, fromDate: '' }));
        }
    };

    const handleToDateChange = (date: Date | null) => {
        setToDate(date);
        setCurrentPage(1);
        setHasGenerated(false);
        setReports([]);
        setTotalPages(1);
        setTotalElements(0);
        if (errors.toDate) {
            setErrors((prev) => ({ ...prev, toDate: '' }));
        }
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    const validateForm = (): boolean => {
        const newErrors = {
            fromDate: '',
            toDate: '',
        };
        let isValid = true;
        
        if (!fromDate) {
            newErrors.fromDate = 'From Date is required';
            isValid = false;
        }
        if (!toDate) {
            newErrors.toDate = 'To Date is required';
            isValid = false;
        }
        if (fromDate && toDate && toDate < fromDate) {
            newErrors.toDate = 'To Date cannot be earlier than From Date';
            isValid = false;
        }
        
        setErrors(newErrors);
        return isValid;
    };

    const handleGenerate = () => {
        if (validateForm()) {
            setCurrentPage(1);
            fetchReports(1, pageSize);
        }
    };

    const handleDownload = async () => {
        if (!validateForm()) return;
        
        setIsDownloading(true);
        try {
            const blob = await ReportService.downloadReport({
                start_date: formatDate(fromDate),
                end_date: formatDate(toDate),
            });
            
            if (blob) {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `report_${formatDate(fromDate)}_to_${formatDate(toDate)}.xlsx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                toast.success('Report downloaded successfully!');
            } else {
                toast.error('Failed to download report');
            }
        } catch (error) {
            toast.error('Failed to download report');
            console.error('Download error:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="max-w-full mx-auto rounded-lg sm:p-7 bg-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">Report Management ( {totalElements} )</h1>
                <button
                    onClick={handleDownload}
                    disabled={isDownloading || isLoading || !hasGenerated}
                    className={`bg-primary hover:bg-hover text-white px-8 py-3 font-bold rounded-lg flex items-center gap-2 ${isDownloading || isLoading || !hasGenerated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <img src={DownloadIcon} alt="Download" className="h-6 w-6" />
                    <span className="hidden md:inline font-bold">Download</span>
                </button>
            </div>

            {/* Date Range Selectors and Generate Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 px-1">
                <div className="flex flex-col lg:flex-row gap-4 items-start">
                    <div className="relative w-full sm:w-auto flex flex-col gap-1">
                        <div className="relative">
                            <DatePicker
                                selected={fromDate}
                                onChange={handleFromDateChange}
                                placeholderText="From Date"
                                dateFormat="MM/dd/yyyy"
                                className={`w-full pl-12 pr-4 py-3 border rounded-lg text-base bg-inputBg placeholder:text-inputPlaceholder focus:outline-none focus:border-primary ${errors.fromDate ? 'border-red' : 'border-inputBorder'}`}
                                disabled={isLoading}
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <Calendar className="w-5 h-5 text-inputPlaceholder" />
                            </div>
                        </div>
                        {errors.fromDate && <p className="text-red text-sm mt-1">{errors.fromDate}</p>}
                    </div>

                    <div className="relative w-full sm:w-auto flex flex-col gap-1">
                        <div className="relative">
                            <DatePicker
                                selected={toDate}
                                onChange={handleToDateChange}
                                placeholderText="To Date"
                                dateFormat="MM/dd/yyyy"
                                className={`w-full pl-12 pr-4 py-3 border rounded-lg text-base bg-inputBg placeholder:text-inputPlaceholder focus:outline-none focus:border-primary ${errors.toDate ? 'border-red' : 'border-inputBorder'}`}
                                disabled={isLoading}
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <Calendar className="w-5 h-5 text-inputPlaceholder" />
                            </div>
                        </div>
                        {errors.toDate && <p className="text-red text-sm mt-1">{errors.toDate}</p>}
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className={`bg-primary hover:bg-hover text-white px-8 py-3 font-bold rounded-lg flex items-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <img src={GenerateIcon} alt="Generate" className="h-5 w-5" />
                        <span className="hidden md:inline font-bold">Generate</span>
                    </button>
                </div>

                <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <label htmlFor="pageSize" className="text-base text-textColor">Rows per page:</label>
                    <select
                        id="pageSize"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        className="p-2 border text-textColor rounded-lg text-base bg-inputBg border-inputBorder focus:outline-none focus:border-primary"
                        disabled={isLoading}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col">
                <div className="overflow-x-auto w-full rounded-lg">
                    <table className="w-full min-w-[800px]">
                        <colgroup>
                            <col className="w-[22%] min-w-[250px]" />
                            <col className="w-[38%] min-w-[400px]" />
                            <col className="w-[18%] min-w-[200px]" />
                            <col className="w-[21%] min-w-[240px]" />
                        </colgroup>
                        <thead>
                            <tr className="bg-secondary text-white">
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">Activity Time Stamp</th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">Activity</th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">User Name</th>
                                <th className="px-8 py-4 text-left font-black">School Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-16">
                                        <Loader message="Loading activity logs..." />
                                    </td>
                                </tr>
                            ) : !hasGenerated ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-16 text-center text-textColor">
                                        Please select date range and click Generate to view reports.
                                    </td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-16 text-center text-textColor">
                                        No activity logs found for the selected date range.
                                    </td>
                                </tr>
                            ) : (
                                reports.map((log, index) => (
                                    <tr
                                        key={log.userId + log.activityTs}
                                        className={index % 2 === 1 ? 'bg-third' : 'bg-white'}
                                    >
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{log.activityTs}</div>
                                        </td>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{log.description}</div>
                                        </td>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{log.firstName} {log.lastName}</div>
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

                {!isLoading && totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6 w-full">
                        <nav className="flex items-center space-x-1">
                            <button
                                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                                disabled={currentPage === 1 || isLoading}
                                className={`p-2 rounded ${currentPage === 1 || isLoading ? 'text-gray cursor-not-allowed' : 'text-textColor cursor-pointer hover:bg-third'}`}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            {getPageNumbers().map((number, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof number === 'number' && paginate(number)}
                                    className={`px-[10px] py-1 rounded cursor-pointer ${number === currentPage
                                        ? 'bg-secondary text-white'
                                        : typeof number === 'number'
                                            ? 'text-textColor hover:bg-third'
                                            : 'text-darkGray'
                                        }`}
                                    disabled={typeof number !== 'number' || isLoading}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                                disabled={currentPage === totalPages || isLoading}
                                className={`p-2 rounded ${currentPage === totalPages || isLoading ? 'text-gray cursor-not-allowed' : 'text-textColor cursor-pointer hover:bg-third'}`}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportManagement;