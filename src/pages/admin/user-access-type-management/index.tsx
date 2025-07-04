import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import ViewIcon from "../../../assets/dashboard/Admin/types-management/view.svg";
import EditIcon from "../../../assets/dashboard/Admin/types-management/edit.svg";
import DeleteIcon from "../../../assets/dashboard/Admin/types-management/delete.svg";
import AddTypeIcon from "../../../assets/dashboard/Admin/types-management/add-type.svg";
import Loader from "../../../components/common/Loader";
import toast from "react-hot-toast";
import { UserAccessType } from "../../../types/admin/user-access-type-management";
import { UserAccessTypeService } from "../../../services/admin/userAccessTypeService";
import AddUserAccessTypeModal from "./modals/AddUserAccessTypeModal";
import EditUserAccessTypeModal from "./modals/EditUserAccessTypeModal";
import ViewUserAccessTypeModal from "./modals/ViewUserAccessTypeModal";
import DeleteUserAccessTypeModal from "./modals/DeleteUserAccessTypeModal";

const UserAccessTypeManagement: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUserAccessType, setSelectedUserAccessType] = useState<UserAccessType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userAccessTypes, setUserAccessTypes] = useState<UserAccessType[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [searchText, setSearchText] = useState("");
    const [appliedSearchText, setAppliedSearchText] = useState("");

    // Fetch user access types on mount and when needed
    const fetchUserAccessTypes = async (page = currentPage, size = pageSize, search = searchText) => {
        setIsLoading(true);
        try {
            const response = await UserAccessTypeService.fetchUserAccessTypes({ page, size, search });
            if (response.error === false || response.error === "false") {
                setUserAccessTypes(response.user_access_type || []);
                setTotalPages(response.totalPages || 1);
                setTotalElements(response.totalElements || 0);
                setPageSize(response.pageSize || size);
            } else {
                toast.error(response.message || 'Failed to fetch user access types');
            }
        } catch (error) {
            toast.error('Failed to fetch user access types');
            console.error('Fetch user access types error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserAccessTypes(currentPage, pageSize, appliedSearchText);
    }, [currentPage, pageSize, appliedSearchText]);

    const currentItems = userAccessTypes;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        setAppliedSearchText(searchText);
    };
    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    const openAddUserAccessTypeModal = () => {
        setShowAddModal(true);
    };
    const openEditUserAccessTypeModal = (userAccessType: UserAccessType) => {
        setSelectedUserAccessType(userAccessType);
        setShowEditModal(true);
    };
    const openViewUserAccessTypeModal = (userAccessType: UserAccessType) => {
        setSelectedUserAccessType(userAccessType);
        setShowViewModal(true);
    };
    const openDeleteUserAccessTypeModal = (userAccessType: UserAccessType) => {
        setSelectedUserAccessType(userAccessType);
        setShowDeleteModal(true);
    };

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

    const closeAddUserAccessTypeModal = () => {
        setShowAddModal(false);
    };
    const closeEditUserAccessTypeModal = () => {
        setShowEditModal(false);
        setSelectedUserAccessType(null);
    };
    const closeViewUserAccessTypeModal = () => {
        setShowViewModal(false);
        setSelectedUserAccessType(null);
    };
    const closeDeleteUserAccessTypeModal = () => {
        setShowDeleteModal(false);
        setSelectedUserAccessType(null);
    };

    const handleUserAccessTypeAdded = () => {
        fetchUserAccessTypes();
        closeAddUserAccessTypeModal();
    };
    const handleUserAccessTypeUpdated = () => {
        fetchUserAccessTypes();
        closeEditUserAccessTypeModal();
    };
    const handleUserAccessTypeDeleted = () => {
        fetchUserAccessTypes();
        closeDeleteUserAccessTypeModal();
    };

    return (
        <div className="max-w-full mx-auto rounded-lg sm:p-7 bg-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">User Access Type List ( {totalElements} )</h1>
                <button
                    onClick={openAddUserAccessTypeModal}
                    disabled={isLoading}
                    className={`bg-primary hover:bg-hover text-white px-8 py-3 font-bold rounded-lg flex items-center gap-2 ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                    <img src={AddTypeIcon} alt="Add User Access Type" className="h-6 w-6" />
                    <span className="hidden md:inline font-bold">Add User Access Type</span>
                </button>
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

            <div className="flex flex-col">
                <div className="overflow-x-auto w-full rounded-lg">
                    <table className="w-full min-w-[800px]">
                        <colgroup>
                            <col className="w-[40%] min-w-[200px]" />
                            <col className="w-[40%] min-w-[200px]" />
                            <col className="w-[20%] min-w-[200px]" />
                        </colgroup>
                        <thead>
                            <tr className="bg-secondary text-white">
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">User Access Type Name</th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">Description</th>
                                <th className="px-8 py-4 text-left font-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={3} className="px-8 py-16">
                                        <Loader message="Loading user access type data..." />
                                    </td>
                                </tr>
                            ) : currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-8 py-16 text-center text-textColor">
                                        No user access types found.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((userAccessType, index) => (
                                    <tr key={userAccessType.user_access_type_id} className={index % 2 === 1 ? "bg-third" : "bg-white"}>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{userAccessType.user_access_type_name}</div>
                                        </td>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{userAccessType.description}</div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-nowrap gap-2">
                                                <button
                                                    onClick={() => openViewUserAccessTypeModal(userAccessType)}
                                                    className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                    disabled={isLoading}
                                                >
                                                    <img src={ViewIcon} alt="View" className="h-4 w-4" />
                                                    <span className="hidden md:inline font-bold">View</span>
                                                </button>
                                                <button
                                                    onClick={() => openEditUserAccessTypeModal(userAccessType)}
                                                    className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                    disabled={isLoading}
                                                >
                                                    <img src={EditIcon} alt="Edit" className="h-4 w-4" />
                                                    <span className="hidden md:inline font-bold">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => openDeleteUserAccessTypeModal(userAccessType)}
                                                    className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                    disabled={isLoading}
                                                >
                                                    <img src={DeleteIcon} alt="Delete" className="h-4 w-4" />
                                                    <span className="hidden md:inline font-bold">Delete</span>
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

            {showAddModal && (
                <AddUserAccessTypeModal
                    onClose={closeAddUserAccessTypeModal}
                    onUserAccessTypeAdded={handleUserAccessTypeAdded}
                />
            )}
            {showEditModal && selectedUserAccessType && (
                <EditUserAccessTypeModal
                    onClose={closeEditUserAccessTypeModal}
                    userAccessType={selectedUserAccessType}
                    onUserAccessTypeUpdated={handleUserAccessTypeUpdated}
                />
            )}
            {showViewModal && selectedUserAccessType && (
                <ViewUserAccessTypeModal
                    onClose={closeViewUserAccessTypeModal}
                    userAccessType={selectedUserAccessType}
                />
            )}
            {showDeleteModal && selectedUserAccessType && (
                <DeleteUserAccessTypeModal
                    onClose={closeDeleteUserAccessTypeModal}
                    userAccessType={selectedUserAccessType}
                    onUserAccessTypeDeleted={handleUserAccessTypeDeleted}
                />
            )}
        </div>
    );
};

export default UserAccessTypeManagement;