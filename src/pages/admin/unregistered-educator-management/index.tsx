import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, X, CheckSquare, Square, Search } from "lucide-react";
import ViewIcon from '../../../assets/dashboard/Admin/unregistered-educator-management/view.svg';
import ViewUnregisteredModal from "./modals/ViewUnregisteredModal";
import UnregisterEducatorModal from "./modals/UnregisterEducatorModal";
import BulkUnregisterModal from "./modals/BulkUnregisterModal";
import Loader from "../../../components/common/Loader";
import BulkActionToolbar from "./components/BulkActionToolbar";
import toast from "react-hot-toast";
import { UnregisteredEducatorService } from "../../../services/admin/unregisteredEducatorService";
import { UnregisteredEducator } from "../../../types/admin/unregistered-educator-management";

const UnregisteredEducatorList: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [educators, setEducators] = useState<UnregisteredEducator[]>([]);
    const [selectedEducators, setSelectedEducators] = useState<Set<number>>(new Set());
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [searchText, setSearchText] = useState("");
    const [appliedSearchText, setAppliedSearchText] = useState("");

    // Modal states
    const [showViewModal, setShowViewModal] = useState(false);
    const [showUnregisterModal, setShowUnregisterModal] = useState(false);
    const [showBulkUnregisterModal, setShowBulkUnregisterModal] = useState(false);
    const [selectedEducator, setSelectedEducator] = useState<UnregisteredEducator | null>(null);
    const [unregisterLoading, setUnregisterLoading] = useState(false);
    const [bulkUnregisterLoading, setBulkUnregisterLoading] = useState(false);

    // Fetch unregistered educators from backend
    const loadUnregisteredEducators = async (page = currentPage, size = pageSize, search = searchText) => {
        setIsLoading(true);
        try {
            const response = await UnregisteredEducatorService.fetchUnregisteredEducators({ page, size, search });
            if (response.error === false || response.error === "false") {
                setEducators(response.teachers || []);
                setTotalPages(response.totalPages || 1);
                setTotalElements(response.totalElements || 0);
                setPageSize(response.pageSize || size);
            } else {
                setEducators([]); // Clear previous results
                setTotalPages(1);
                setTotalElements(0);
                toast.error(response.message ?? "Failed to load unregistered educators");
            }
        } catch (error) {
            console.error("Error fetching unregistered educators:", error);
            toast.error("Failed to load unregistered educators");
            setEducators([]); // Clear previous results
            setTotalPages(1);
            setTotalElements(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUnregisteredEducators(currentPage, pageSize, appliedSearchText);
    }, [currentPage, pageSize, appliedSearchText]);

    // Get current items (now just use educators as server returns paginated data)
    const currentItems = educators;

    // Selection handlers
    const handleSelectAll = () => {
        if (selectedEducators.size === currentItems.length) {
            setSelectedEducators(new Set());
        } else {
            setSelectedEducators(new Set(currentItems.map(edu => edu.user_id)));
        }
    };

    const handleSelectEducator = (educatorId: number) => {
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

    // Search box handler
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        setAppliedSearchText(searchText);
    };

    // Page size change handler
    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    // Single educator actions
    const openViewEducatorModal = (educator: UnregisteredEducator) => {
        setSelectedEducator(educator);
        setShowViewModal(true);
    };

    const openUnregisterEducatorModal = (educator: UnregisteredEducator) => {
        setSelectedEducator(educator);
        setShowUnregisterModal(true);
    };

    // Bulk actions
    const handleBulkUnregister = () => {
        setShowBulkUnregisterModal(true);
    };

    // Handle individual unregister
    const handleUnregisterEducator = async (user_id: number) => {
        setUnregisterLoading(true);
        try {
            const response = await UnregisteredEducatorService.unregisterEducator(user_id);
            if (response.error === false || response.error === "false") {
                toast.success(response.message ?? "Educator unregistered successfully!");
                setShowUnregisterModal(false);
                setSelectedEducator(null);
                setSearchText("");
                setAppliedSearchText("");
                setCurrentPage(1);
                await loadUnregisteredEducators(1, pageSize, ""); // Always reload with empty search
                setSelectedEducators(new Set());
            } else {
                toast.error(response.message ?? "Failed to unregister educator");
            }
        } catch (error) {
            console.error("Error unregistering educator:", error);
            toast.error("Failed to unregister educator");
        } finally {
            setUnregisterLoading(false);
        }
    };

    // Handle bulk unregister complete
    const handleBulkUnregisterComplete = async (unregisteredIds: number[]) => {
        setBulkUnregisterLoading(true);
        try {
            const response = await UnregisteredEducatorService.bulkUnregisterEducators(unregisteredIds);
            if (response.error === false || response.error === "false") {
                toast.success(response.message ?? "Selected educators unregistered successfully!");
                setShowBulkUnregisterModal(false);
                setSearchText("");
                setAppliedSearchText("");
                setCurrentPage(1);
                await loadUnregisteredEducators(1, pageSize, ""); // Always reload with empty search
                setSelectedEducators(new Set());
            } else {
                toast.error(response.message ?? "Failed to unregister educators");
            }
        } catch (error) {
            console.error("Error bulk unregistering educators:", error);
            toast.error("Failed to unregister educators");
        } finally {
            setBulkUnregisterLoading(false);
        }
    };

    // Close modals
    const closeViewEducatorModal = () => {
        setShowViewModal(false);
        setSelectedEducator(null);
    };

    const closeUnregisterEducatorModal = () => {
        setShowUnregisterModal(false);
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

    const selectedEducatorsList = educators.filter(edu => selectedEducators.has(edu.user_id));

    return (
        <div className="max-w-full mx-auto rounded-lg sm:p-7 bg-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">Unregistered Educator List ( {totalElements} )</h1>
            </div>

            {/* Search Box UI */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 px-1">
                <form className="flex w-full md:max-w-md gap-2" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Enter keyword to search"
                        className="p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder focus:outline-none focus:border-primary"
                        disabled={isLoading}
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                    <button
                        type="submit"
                        className={`bg-primary hover:bg-hover text-white px-6 py-3 font-bold rounded-lg flex items-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        disabled={isLoading}
                    >
                        <Search className="h-5 w-5" />
                        <span className="hidden md:inline font-bold">Search</span>
                    </button>
                </form>
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

            {/* Bulk Action Toolbar */}
            {selectedEducators.size > 0 && (
                <BulkActionToolbar
                    selectedCount={selectedEducators.size}
                    onBulkUnregister={handleBulkUnregister}
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
                                    const isSelected = selectedEducators.has(educator.user_id);
                                    return (
                                        <tr
                                            key={educator.user_id}
                                            className={`${index % 2 === 1 ? "bg-third" : "bg-white"} ${isSelected ? "!font-bold" : ""}`}
                                        >
                                            <td className="px-8 py-4">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        onClick={() => handleSelectEducator(educator.user_id)}
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
                                            <td className="px-8 py-4 break-words">
                                                <div className="text-textColor">{educator.user_name}</div>
                                            </td>
                                            <td className="px-8 py-4 break-words">
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
                                                        onClick={() => openUnregisterEducatorModal(educator)}
                                                        className="bg-white border border-primary cursor-pointer text-textColor hover:bg-gray/10 px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                        disabled={isLoading}
                                                    >
                                                        <X className="h-4 w-4" />
                                                        <span className="hidden md:inline font-bold">Unregister</span>
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
                <ViewUnregisteredModal onClose={closeViewEducatorModal} educator={selectedEducator} />
            )}
            {showUnregisterModal && selectedEducator && (
                <UnregisterEducatorModal
                    onClose={closeUnregisterEducatorModal}
                    educator={selectedEducator}
                    onConfirm={handleUnregisterEducator}
                    isLoading={unregisterLoading}
                />
            )}
            {showBulkUnregisterModal && (
                <BulkUnregisterModal
                    onClose={() => setShowBulkUnregisterModal(false)}
                    educators={selectedEducatorsList}
                    onConfirm={handleBulkUnregisterComplete}
                    isLoading={bulkUnregisterLoading}
                />
            )}
        </div>
    );
};

export default UnregisteredEducatorList;