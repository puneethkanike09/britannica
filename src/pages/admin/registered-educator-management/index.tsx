import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import Loader from "../../../components/common/Loader";
import ViewIcon from "../../../assets/dashboard/Admin/educator-management/view.svg";
import ViewEducatorModal from "./modals/ViewEducatorModal";
import ApproveEducatorModal from "./modals/ApproveEducatorModal"; // New modal import
import RejectReasonModal from "./modals/RejectReasonModal"; // New modal import

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
    const [showViewModal, setShowViewModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedEducator, setSelectedEducator] = useState<Educator | null>(null);

    const itemsPerPage = 6;

    // Dummy data for educators
    const dummyEducators: Educator[] = Array.from({ length: 15 }, (_, i) => ({
        educator_id: `educator-${i + 1}`,
        name: `Educator ${i + 1}`,
        school_name: `School ${Math.floor(i / 3) + 1} High School`,
        login_id: `educator${i + 1}`,
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
        }, 1000); // Simulate loading
    }, []);

    // Calculate total pages
    const totalPages = Math.ceil(educators.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = educators.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Open Approve Educator Modal
    const openApproveEducatorModal = (educator: Educator) => {
        setSelectedEducator(educator);
        setShowApproveModal(true);
    };

    // Open Reject Educator Modal
    const openRejectEducatorModal = (educator: Educator) => {
        setSelectedEducator(educator);
        setShowRejectModal(true);
    };

    // Close Approve Educator Modal
    const closeApproveEducatorModal = () => {
        setShowApproveModal(false);
        setSelectedEducator(null);
    };

    // Close Reject Educator Modal
    const closeRejectEducatorModal = () => {
        setShowRejectModal(false);
        setSelectedEducator(null);
    };

    // Handle Approve Educator
    const handleApproveEducator = (educator_id: string) => {
        setEducators(educators.filter((edu) => edu.educator_id !== educator_id));
        setShowApproveModal(false);
        setSelectedEducator(null);
    };

    // Handle Reject Educator
    const handleRejectEducator = (educator_id: string, reason: string) => {
        console.log(`Rejected educator ${educator_id} with reason: ${reason}`); // Log reason for debugging
        setEducators(educators.filter((edu) => edu.educator_id !== educator_id));
        setShowRejectModal(false);
        setSelectedEducator(null);
    };

    // Open View Educator Modal
    const openViewEducatorModal = (educator: Educator) => {
        setSelectedEducator(educator);
        setShowViewModal(true);
    };

    // Close View Educator Modal
    const closeViewEducatorModal = () => {
        setShowViewModal(false);
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

    return (
        <div className="max-w-full mx-auto rounded-lg sm:p-7 bg-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">Registered Educator List</h1>
            </div>

            <div className="flex flex-col">
                <div className="overflow-x-auto w-full rounded-lg">
                    <table className="w-full table-fixed min-w-[800px]">
                        <colgroup>
                            <col className="w-48" />
                            <col className="w-48" />
                            <col className="w-48" />
                            <col className="w-78" />
                        </colgroup>
                        <thead>
                            <tr className="bg-secondary text-white">
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">Educator Name</th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">School Name</th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">Login ID</th>
                                <th className="px-8 py-4 text-left font-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-16">
                                        <Loader message="Loading educator data..." />
                                    </td>
                                </tr>
                            ) : educators.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-16 text-center text-textColor">
                                        No educators found.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((educator, index) => (
                                    <tr key={educator.educator_id} className={index % 2 === 1 ? "bg-sky-50" : "bg-white"}>
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
        </div>
    );
};

export default RegisteredEducatorList;