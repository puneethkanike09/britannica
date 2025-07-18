import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import ViewIcon from "../../../assets/dashboard/Admin/pbl-file-management/view.svg";
import EditIcon from "../../../assets/dashboard/Admin/pbl-file-management/edit.svg";
import DeleteIcon from "../../../assets/dashboard/Admin/pbl-file-management/delete.svg";
import AddPblFileIcon from "../../../assets/dashboard/Admin/pbl-file-management/add-pbl-file.svg";
import Loader from "../../../components/common/Loader";
import toast from "react-hot-toast";
import { PblFile } from "../../../types/admin/pbl-files-management";
import { PblFileServices } from "../../../services/admin/pblFileServices";
import AddPblFileModal from "./modals/AddPblFileModal";
import DeletePblFileModal from "./modals/DeletePblFileModal";
import ViewPblFileModal from "./modals/ViewPblFileModal";
import EditPblFileModal from "./modals/EditPblFileModal";
// import ViewPblFileModal from "./modals/ViewPblFileModal";


const PblFileManagement: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    // const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<PblFile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [files, setFiles] = useState<PblFile[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [searchText, setSearchText] = useState("");
    const [appliedSearchText, setAppliedSearchText] = useState("");
    const [showViewModal, setShowViewModal] = useState(false);

    // Fetch PBL files on mount and when needed
    const fetchPblFiles = async (page = currentPage, size = pageSize, search = searchText) => {
        setIsLoading(true);
        try {
            const response = await PblFileServices.fetchPblFiles({ page, size, search });
            if (response.error === false || response.error === "false") {
                setFiles(response.pbl_files || []);
                setTotalPages(response.totalPages || 1);
                setTotalElements(response.totalItems || 0);
                setPageSize(response.pageSize || size);
            } else {
                setFiles([]); // Clear previous results
                setTotalPages(1);
                setTotalElements(0);
                toast.error(response.message || 'Failed to fetch PBL files');
            }
        } catch (error) {
            setFiles([]); // Clear previous results
            setTotalPages(1);
            setTotalElements(0);
            toast.error('Failed to fetch PBL files');
            console.error('Fetch PBL files error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPblFiles(currentPage, pageSize, appliedSearchText);
    }, [currentPage, pageSize, appliedSearchText]);

    const currentItems = files;

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

    const openAddPblFileModal = () => setShowAddModal(true);
    const openEditPblFileModal = (file: PblFile) => {
        setSelectedFile(file);
        setShowEditModal(true);
    };
    const openViewPblFileModal = (file: PblFile) => {
        setSelectedFile(file);
        setShowViewModal(true);
    };
    // const openViewPblFileModal = (file: PblFile) => {
    //     setSelectedFile(file);
    //     setShowViewModal(true);
    // };
    const openDeletePblFileModal = (file: PblFile) => {
        setSelectedFile(file);
        setShowDeleteModal(true);
    };

    const closeAddPblFileModal = () => setShowAddModal(false);
    const closeEditPblFileModal = () => {
        setShowEditModal(false);
        setSelectedFile(null);
    };
    const closeViewPblFileModal = () => {
        setShowViewModal(false);
        setSelectedFile(null);
    };
    const closeDeletePblFileModal = () => {
        setShowDeleteModal(false);
        setSelectedFile(null);
    };

    const handleFileAdded = () => {
        setSearchText("");
        setAppliedSearchText("");
        setCurrentPage(1);
        fetchPblFiles(1, pageSize, ""); // Always reload with empty search
        closeAddPblFileModal();
    };
    const handleFileUpdated = () => {
        setSearchText("");
        setAppliedSearchText("");
        setCurrentPage(1);
        fetchPblFiles(1, pageSize, ""); // Always reload with empty search
        closeEditPblFileModal();
    };
    const handlePblFileDeleted = () => {
        setSearchText("");
        setAppliedSearchText("");
        setCurrentPage(1);
        fetchPblFiles(1, pageSize, ""); // Always reload with empty search
        closeDeletePblFileModal();
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

    return (
        <div className="max-w-full mx-auto rounded-lg sm:p-7 bg-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">PBL File List ( {totalElements} )</h1>
                <button
                    onClick={openAddPblFileModal}
                    disabled={isLoading}
                    className={`bg-primary hover:bg-hover text-white px-8 py-3 font-bold rounded-lg flex items-center gap-2 ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                    <img src={AddPblFileIcon} alt="Add PBL File" className="h-6 w-6" />
                    <span className="hidden md:inline font-bold">Add PBL File</span>
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
                            <col className="w-[20%] min-w-[160px]" />
                            <col className="w-[15%] min-w-[120px]" />
                            <col className="w-[20%] min-w-[160px]" />
                            <col className="w-[25%] min-w-[200px]" />
                            <col className="w-[20%] min-w-[160px]" />
                        </colgroup>
                        <thead>
                            <tr className="bg-secondary text-white">
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">Name</th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">Grade</th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">Theme</th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">Type</th>
                                <th className="px-8 py-4 text-left font-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16">
                                        <Loader message="Loading PBL file data..." />
                                    </td>
                                </tr>
                            ) : files.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center text-textColor">
                                        No PBL files found.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((file, index) => (
                                    <tr key={file.pbl_id} className={index % 2 === 1 ? "bg-third" : "bg-white"}>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{file.pbl_name}</div>
                                        </td>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{file.grade_name}</div>
                                        </td>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{file.theme_name}</div>
                                        </td>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{file.user_access_type_name}</div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-nowrap gap-2">
                                                <button
                                                    onClick={() => openViewPblFileModal(file)}
                                                    className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                    disabled={isLoading}
                                                >
                                                    <img src={ViewIcon} alt="View" className="h-4 w-4" />
                                                    <span className="hidden md:inline font-bold">View</span>
                                                </button>
                                                <button
                                                    onClick={() => openEditPblFileModal(file)}
                                                    className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                    disabled={isLoading}
                                                >
                                                    <img src={EditIcon} alt="Edit" className="h-4 w-4" />
                                                    <span className="hidden md:inline font-bold">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => openDeletePblFileModal(file)}
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

            {showAddModal && <AddPblFileModal onClose={closeAddPblFileModal} onFileAdded={handleFileAdded} />}
            {showDeleteModal && selectedFile && (
                <DeletePblFileModal onClose={closeDeletePblFileModal} file={{
                    file_id: selectedFile.pbl_id,
                    name: selectedFile.pbl_name,
                    description: '',
                    grade: selectedFile.grade_name,
                    theme: selectedFile.theme_name,
                    type: selectedFile.user_access_type_name,
                    file: null
                }} onDeleted={handlePblFileDeleted} />
            )}
            {showViewModal && selectedFile && (
                <ViewPblFileModal onClose={closeViewPblFileModal} file={{ file_id: String(selectedFile.pbl_id) }} />
            )}
            {showEditModal && selectedFile && (
                <EditPblFileModal onClose={closeEditPblFileModal} file={{ file_id: String(selectedFile.pbl_id) }} onFileUpdated={handleFileUpdated} />
            )}
            {/* {showViewModal && selectedFile && <ViewPblFileModal onClose={closeViewPblFileModal} file={selectedFile} />} */}
        </div>
    );
};

export default PblFileManagement;