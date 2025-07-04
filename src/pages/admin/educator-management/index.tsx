import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import AddEducatorModal from './modals/AddEducatorModal';
import EditEducatorModal from './modals/EditEducatorModal';
import ViewEducatorModal from './modals/ViewEducatorModal';
import ViewIcon from '../../../assets/dashboard/Admin/educator-management/view.svg';
import EditIcon from '../../../assets/dashboard/Admin/educator-management/edit.svg';
import DeleteIcon from '../../../assets/dashboard/Admin/educator-management/delete.svg';
import DeleteEducatorModal from './modals/DeleteEducatorModal';
import AddEducatorIcon from '../../../assets/dashboard/Admin/educator-management/add-educator.svg';
import { EducatorService } from '../../../services/admin/educatorService';
import { Teacher } from '../../../types/admin/educator-management';
import Loader from '../../../components/common/Loader';
import toast from 'react-hot-toast';

const EducatorManagement: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedEducator, setSelectedEducator] = useState<Teacher | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(5); // default to 5 for server-side
    const [searchText, setSearchText] = useState("");
    const [appliedSearchText, setAppliedSearchText] = useState("");


    // Fetch teachers from backend
    const loadTeachers = async (page = currentPage, size = pageSize, search = searchText) => {
        setIsLoading(true);
        try {
            const response = await EducatorService.fetchTeachers({ page, size, search });
            if (response.error === false || response.error === "false") {
                setTeachers(response.teacher || []);
                setTotalPages(response.totalPages || 1);
                setTotalElements(response.totalElements || 0);
                setPageSize(response.pageSize || size);
            } else {
                toast.error(response.message || "Failed to load educators");
            }
        } catch (error) {
            console.error("Error fetching educators:", error);
            toast.error("Error loading educators");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTeachers(currentPage, pageSize, appliedSearchText);
    }, [currentPage, pageSize, appliedSearchText]);

    // Get current items (now just use teachers as server returns paginated data)
    const currentItems = teachers;

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Open Add Educator Modal
    const openAddEducatorModal = () => {
        setShowAddModal(true);
    };

    // Open Edit Educator Modal
    const openEditEducatorModal = (educator: Teacher) => {
        setSelectedEducator(educator);
        setShowEditModal(true);
    };

    // Open View Educator Modal
    const openViewEducatorModal = (educator: Teacher) => {
        setSelectedEducator(educator);
        setShowViewModal(true);
    };

    // Open Delete Educator Modal
    const openDeleteEducatorModal = (educator: Teacher) => {
        setSelectedEducator(educator);
        setShowDeleteModal(true);
    };

    const closeDeleteEducatorModal = () => {
        setShowDeleteModal(false);
        setSelectedEducator(null);
    };

    // Callbacks for after educator is added/updated
    const handleEducatorAdded = () => {
        loadTeachers();
        closeAddEducatorModal();
    };

    const handleEducatorUpdated = () => {
        loadTeachers();
        closeEditEducatorModal();
    };

    const handleTeacherDeleted = () => {
        loadTeachers();
        closeDeleteEducatorModal();
    };

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

    const closeAddEducatorModal = () => {
        setShowAddModal(false);
    };

    const closeEditEducatorModal = () => {
        setShowEditModal(false);
        setSelectedEducator(null);
    };

    const closeViewEducatorModal = () => {
        setShowViewModal(false);
        setSelectedEducator(null);
    };

    return (
        <div className="max-w-full mx-auto rounded-lg sm:p-7 bg-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">Educator List ( {totalElements} )</h1>
                <button
                    onClick={openAddEducatorModal}
                    disabled={isLoading}
                    className={`bg-primary hover:bg-hover text-white px-8 py-3 font-bold rounded-lg  flex items-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <img src={AddEducatorIcon} alt="Add Educator" className="h-6 w-6" />
                    <span className="hidden md:inline font-bold">Add Educator</span>
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
                            <col className="w-[25%] min-w-[200px]" />
                            <col className="w-[25%] min-w-[200px]" />
                            <col className="w-[25%] min-w-[200px]" />
                            <col className="w-[25%] min-w-[200px]" />
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
                            ) : teachers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-16 text-center text-textColor">
                                        No educators found.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((teacher, index) => (
                                    <tr key={teacher.teacher_id} className={index % 2 === 1 ? "bg-third" : "bg-white"}>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{teacher.teacher_name}</div>
                                        </td>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{teacher.school_name}</div>
                                        </td>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{teacher.teacher_login}</div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-nowrap gap-2">
                                                <button
                                                    onClick={() => openViewEducatorModal(teacher)}
                                                    className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                    disabled={isLoading}
                                                >
                                                    <img src={ViewIcon} alt="View" className="h-4 w-4" />
                                                    <span className="hidden md:inline font-bold">View</span>
                                                </button>
                                                <button
                                                    onClick={() => openEditEducatorModal(teacher)}
                                                    className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                    disabled={isLoading}
                                                >
                                                    <img src={EditIcon} alt="Edit" className="h-4 w-4" />
                                                    <span className="hidden md:inline font-bold">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => openDeleteEducatorModal(teacher)}
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

            {showAddModal && <AddEducatorModal onClose={closeAddEducatorModal} onTeacherAdded={handleEducatorAdded} />}
            {showEditModal && selectedEducator && (
                <EditEducatorModal onClose={closeEditEducatorModal} teacher={selectedEducator} onTeacherUpdated={handleEducatorUpdated} />
            )}
            {showViewModal && selectedEducator && (
                <ViewEducatorModal onClose={closeViewEducatorModal} teacher={selectedEducator} />
            )}
            {showDeleteModal && selectedEducator && (
                <DeleteEducatorModal onClose={closeDeleteEducatorModal} teacher={selectedEducator} onDeleted={handleTeacherDeleted} />
            )}
        </div>
    );
};

export default EducatorManagement;