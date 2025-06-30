import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, X, CheckSquare, Square } from "lucide-react";
import ViewIcon from '../../../assets/dashboard/Admin/registered-educator-management/view.svg';
import ViewEducatorModal from "./modals/ViewEducatorModal";
import ApproveEducatorModal from "./modals/ApproveEducatorModal";
import RejectReasonModal from "./modals/RejectReasonModal";
import Loader from "../../../components/common/Loader";
import BulkActionToolbar from "./components/BulkActionToolbar";
import BulkApproveModal from "./modals/BulkApproveModal";
import BulkRejectModal from "./modals/BulkRejectModal";
import toast from "react-hot-toast";

interface Educator {
    educator_id: string;
    name: string;
    school_name: string;
    login_id: string;
    email?: string;
    phone?: string;
    address_line_1?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
}

const RegisteredEducatorList: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [educators, setEducators] = useState<Educator[]>([]);
    const [selectedEducators, setSelectedEducators] = useState<Set<string>>(new Set());

    // Modal states
    const [showViewModal, setShowViewModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showBulkApproveModal, setShowBulkApproveModal] = useState(false);
    const [showBulkRejectModal, setShowBulkRejectModal] = useState(false);
    const [selectedEducator, setSelectedEducator] = useState<Educator | null>(null);

    const itemsPerPage = 6;

    // Dummy data for educators
    const dummyEducators: Educator[] = Array.from({ length: 15 }, (_, i) => ({
        educator_id: `educator-${i + 1}`,
        name: `${['Amitha', 'Sagar', 'Vidya', 'Puneeth', 'Rajesh', 'Priya', 'Suresh Kumar Gowda', 'Kavya', 'Ravi', 'Deepa', 'Arun', 'Sneha', 'Kiran', 'Meera', 'Vinay'][i] || `Educator ${i + 1}`}`,
        school_name: `${['Horizon Valley School', 'Lumina School', 'Spark Bridge Academy', 'Prism Path School', 'Golden Heights Academy'][i % 5]}`,
        login_id: `${['Amitha123', 'Sagar123', 'vidya123', 'Puneeth123'][i] || `educator${i + 1}`}`,
        email: `educator${i + 1}@school.com`,
        phone: i === 0 ? "9740969649" : "",
        address_line_1: i === 0 ? "Bangalore, Karnataka" : "",
        city: i === 0 ? "Bangalore" : "",
        state: i === 0 ? "Karnataka" : "",
        country: i === 0 ? "India" : "",
        pincode: i === 0 ? "573468" : "",
    }));

    // Load dummy educators on mount
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setEducators(dummyEducators);
            setIsLoading(false);
        }, 1000);
    }, []);

    // Calculate total pages
    const totalPages = Math.ceil(educators.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = educators.slice(indexOfFirstItem, indexOfLastItem);

    // Selection handlers
    const handleSelectAll = () => {
        if (selectedEducators.size === currentItems.length) {
            setSelectedEducators(new Set());
        } else {
            setSelectedEducators(new Set(currentItems.map(edu => edu.educator_id)));
        }
    };

    const handleSelectEducator = (educatorId: string) => {
        const newSelected = new Set(selectedEducators);
        if (newSelected.has(educatorId)) {
            newSelected.delete(educatorId);
        } else {
            newSelected.add(educatorId);
        }
        setSelectedEducators(newSelected);
    };

    const isAllSelected = currentItems.length > 0 && selectedEducators.size === currentItems.length;
    const isIndeterminate = selectedEducators.size > 0 && selectedEducators.size < currentItems.length;

    // Clear selections when page changes
    useEffect(() => {
        setSelectedEducators(new Set());
    }, [currentPage]);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Single educator actions
    const openApproveEducatorModal = (educator: Educator) => {
        setSelectedEducator(educator);
        setShowApproveModal(true);
    };

    const openRejectEducatorModal = (educator: Educator) => {
        setSelectedEducator(educator);
        setShowRejectModal(true);
    };

    const openViewEducatorModal = (educator: Educator) => {
        setSelectedEducator(educator);
        setShowViewModal(true);
    };

    // Bulk actions
    const handleBulkApprove = () => {
        setShowBulkApproveModal(true);
    };

    const handleBulkReject = () => {
        setShowBulkRejectModal(true);
    };

    // Handle individual approve
    const handleApproveEducator = (educator_id: string) => {
        setEducators(educators.filter((edu) => edu.educator_id !== educator_id));
        setShowApproveModal(false);
        setSelectedEducator(null);
        toast.success("Educator approved successfully");
    };

    // Handle individual reject
    const handleRejectEducator = (educator_id: string) => {
        setEducators(educators.filter((edu) => edu.educator_id !== educator_id));
        setShowRejectModal(false);
        setSelectedEducator(null);
        toast.success("Educator rejected successfully");
    };

    // Handle bulk approve complete
    const handleBulkApproveComplete = (approvedIds: string[]) => {
        setEducators(educators.filter(edu => !approvedIds.includes(edu.educator_id)));
        setSelectedEducators(new Set());
        setShowBulkApproveModal(false);
        toast.success("Selected educators approved successfully");
    };

    // Handle bulk reject complete
    const handleBulkRejectComplete = (rejectedIds: string[]) => {
        setEducators(educators.filter(edu => !rejectedIds.includes(edu.educator_id)));
        setSelectedEducators(new Set());
        setShowBulkRejectModal(false);
        toast.success("Selected educators rejected successfully");
    };

    // Close modals
    const closeViewEducatorModal = () => {
        setShowViewModal(false);
        setSelectedEducator(null);
    };

    const closeApproveEducatorModal = () => {
        setShowApproveModal(false);
        setSelectedEducator(null);
    };

    const closeRejectEducatorModal = () => {
        setShowRejectModal(false);
        setSelectedEducator(null);
    };

    // Generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pageNumbers: (number | string)[] = [];
        if (totalPages <= 4) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);
            if (currentPage <= 2) {
                pageNumbers.push(2, 3, "...");
            } else if (currentPage >= totalPages - 1) {
                pageNumbers.push("...", totalPages - 2, totalPages - 1);
            } else {
                pageNumbers.push("...", currentPage - 1, currentPage, currentPage + 1, "...");
            }
            pageNumbers.push(totalPages);
        }
        return pageNumbers;
    };

    const selectedEducatorsList = educators.filter(edu => selectedEducators.has(edu.educator_id));

    return (
        <div className="max-w-full mx-auto rounded-lg sm:p-7 bg-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">Registered Educator List</h1>
            </div>

            {/* Bulk Action Toolbar */}
            {selectedEducators.size > 0 && (
                <BulkActionToolbar
                    selectedCount={selectedEducators.size}
                    onBulkApprove={handleBulkApprove}
                    onBulkReject={handleBulkReject}
                    onClearSelection={() => setSelectedEducators(new Set())}
                />
            )}

            <div className="flex flex-col">
                <div className="overflow-x-auto w-full rounded-lg">
                    <table className="w-full min-w-[800px]">
                        <colgroup>
                            <col className="w-[5%] min-w-[60px]" />
                            <col className="w-[25%] min-w-[200px]" />
                            <col className="w-[25%] min-w-[200px]" />
                            <col className="w-[25%] min-w-[200px]" />
                            <col className="w-[20%] min-w-[160px]" />
                        </colgroup>
                        <thead>
                            <tr className="bg-secondary text-white">
                                <th className="px-8 py-4 text-center border-r-1 border-white">
                                    <div className="flex items-center justify-center">
                                        <button
                                            onClick={handleSelectAll}
                                            className="text-white hover:text-gray-200 transition-colors cursor-pointer"
                                            disabled={isLoading || currentItems.length === 0}
                                        >
                                            {isAllSelected ? (
                                                <CheckSquare className="h-5 w-5" />
                                            ) : isIndeterminate ? (
                                                <div className="h-5 w-5 border-2 border-white bg-white/20 rounded flex items-center justify-center">
                                                    <Check className="h-3 w-3" />
                                                </div>
                                            ) : (
                                                <Square className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">Educator Name</th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">School Name</th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">Login ID</th>
                                <th className="px-8 py-4 text-left font-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16">
                                        <Loader message="Loading educator data..." />
                                    </td>
                                </tr>
                            ) : educators.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center text-textColor">
                                        No educators found.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((educator, index) => {
                                    const isSelected = selectedEducators.has(educator.educator_id);
                                    return (
                                        <tr
                                            key={educator.educator_id}
                                            className={`${index % 2 === 1 ? "bg-third" : "bg-white"} ${isSelected ? "!font-bold" : ""}`}
                                        >
                                            <td className="px-8 py-4">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        onClick={() => handleSelectEducator(educator.educator_id)}
                                                        className="text-textColor hover:text-primary transition-colors cursor-pointer"
                                                        disabled={isLoading}
                                                    >
                                                        {isSelected ? (
                                                            <CheckSquare className="h-5 w-5 text-primary" />
                                                        ) : (
                                                            <Square className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4 break-all">
                                                <div className="text-textColor">{educator.name}</div>
                                            </td>
                                            <td className="px-8 py-4 break-all">
                                                <div className="text-textColor">{educator.school_name}</div>
                                            </td>
                                            <td className="px-8 py-4 break-all">
                                                <div className="text-textColor">{educator.login_id}</div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className="flex flex-nowrap gap-2">
                                                    <button
                                                        onClick={() => openViewEducatorModal(educator)}
                                                        className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                        disabled={isLoading}
                                                    >
                                                        <img src={ViewIcon} alt="View" className="h-4 w-4" />
                                                        <span className="hidden md:inline font-bold">View</span>
                                                    </button>
                                                    <button
                                                        onClick={() => openApproveEducatorModal(educator)}
                                                        className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                        disabled={isLoading}
                                                    >
                                                        <Check className="h-4 w-4" />
                                                        <span className="hidden md:inline font-bold">Approve</span>
                                                    </button>
                                                    <button
                                                        onClick={() => openRejectEducatorModal(educator)}
                                                        className="bg-white border border-primary cursor-pointer text-textColor hover:bg-gray/10 px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                        disabled={isLoading}
                                                    >
                                                        <X className="h-4 w-4" />
                                                        <span className="hidden md:inline font-bold">Reject</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
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
                                className={`p-2 rounded ${currentPage === 1 || isLoading ? "text-gray cursor-not-allowed" : "text-textColor cursor-pointer hover:bg-third"}`}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            {getPageNumbers().map((number, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof number === "number" && paginate(number)}
                                    className={`px-[10px] py-1 rounded cursor-pointer ${number === currentPage
                                        ? "bg-secondary text-white"
                                        : typeof number === "number"
                                            ? "text-textColor hover:bg-third"
                                            : "text-darkGray"
                                        }`}
                                    disabled={typeof number !== "number" || isLoading}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                                disabled={currentPage === totalPages || isLoading}
                                className={`p-2 rounded ${currentPage === totalPages || isLoading ? "text-gray cursor-not-allowed" : "text-textColor cursor-pointer hover:bg-third"}`}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showViewModal && selectedEducator && (
                <ViewEducatorModal onClose={closeViewEducatorModal} educator={selectedEducator} />
            )}
            {showApproveModal && selectedEducator && (
                <ApproveEducatorModal
                    onClose={closeApproveEducatorModal}
                    educator={selectedEducator}
                    onEducatorApproved={handleApproveEducator}
                />
            )}
            {showRejectModal && selectedEducator && (
                <RejectReasonModal
                    onClose={closeRejectEducatorModal}
                    educator={selectedEducator}
                    onEducatorRejected={handleRejectEducator}
                />
            )}
            {showBulkApproveModal && (
                <BulkApproveModal
                    onClose={() => setShowBulkApproveModal(false)}
                    educators={selectedEducatorsList}
                    onBulkApprove={handleBulkApproveComplete}
                />
            )}
            {showBulkRejectModal && (
                <BulkRejectModal
                    onClose={() => setShowBulkRejectModal(false)}
                    educators={selectedEducatorsList}
                    onBulkReject={handleBulkRejectComplete}
                />
            )}
        </div>
    );
};

export default RegisteredEducatorList;