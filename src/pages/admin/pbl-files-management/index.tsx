import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ViewIcon from "../../../assets/dashboard/Admin/pbl-file-management/view.svg";
import EditIcon from "../../../assets/dashboard/Admin/pbl-file-management/edit.svg";
import DeleteIcon from "../../../assets/dashboard/Admin/pbl-file-management/delete.svg";
import AddPblFileIcon from "../../../assets/dashboard/Admin/pbl-file-management/add-pbl-file.svg";
import Loader from "../../../components/common/Loader";
import toast from "react-hot-toast";
import AddPblFileModal from "./modals/AddPblFileModal";
import EditPblFileModal from "./modals/EditPblFileModal";
import ViewPblFileModal from "./modals/ViewPblFileModal";
import DeletePblFileModal from "./modals/DeletePblFileModal";

interface PblFile {
    file_id: string;
    name: string;
    description: string;
    grade: string;
    theme: string;
    type: string;
    file: File | null;
}

const PblFileManagement: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<PblFile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [files, setFiles] = useState<PblFile[]>([]);

    const itemsPerPage = 6;

    const dummyFiles: PblFile[] = Array.from({ length: 12 }, (_, i) => ({
        file_id: `file-${i + 1}`,
        name: `File ${i + 1}.pdf`,
        description: `Description for File ${i + 1} details.`,
        grade: `Grade ${i % 3 + 1}`,
        theme: `Theme ${i % 4 + 1}`,
        type: `Type ${i % 2 + 1}`,
        file: null,
    }));

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setFiles(dummyFiles);
            setIsLoading(false);
        }, 1000);
    }, []);

    const totalPages = Math.ceil(files.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = files.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const openAddPblFileModal = () => setShowAddModal(true);
    const openEditPblFileModal = (file: PblFile) => {
        setSelectedFile(file);
        setShowEditModal(true);
    };
    const openViewPblFileModal = (file: PblFile) => {
        setSelectedFile(file);
        setShowViewModal(true);
    };
    const openDeletePblFileModal = (file: PblFile) => {
        setSelectedFile(file);
        setShowDeleteModal(true);
    };

    const getPageNumbers = () => {
        const pageNumbers: (number | string)[] = [];
        if (totalPages <= 4) {
            for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
        } else {
            pageNumbers.push(1);
            if (currentPage <= 2) pageNumbers.push(2, 3, "...");
            else if (currentPage >= totalPages - 1) pageNumbers.push("...", totalPages - 2, totalPages - 1);
            else pageNumbers.push("...", currentPage - 1, currentPage, currentPage + 1, "...");
            pageNumbers.push(totalPages);
        }
        return pageNumbers;
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

    const handleFileAdded = (newFile: { name: string; description: string; grade: string; theme: string; type: string; file: File }) => {
        const fileWithId = { ...newFile, file_id: `file-${files.length + 1}` };
        setFiles([...files, fileWithId]);
        toast.success("File added successfully");
        closeAddPblFileModal();
    };

    const handleFileUpdated = (updatedFile: PblFile) => {
        setFiles(files.map((file) => (file.file_id === updatedFile.file_id ? updatedFile : file)));
        toast.success("File updated successfully");
        closeEditPblFileModal();
    };

    const handleFileDeleted = (file_id: string) => {
        setFiles(files.filter((file) => file.file_id !== file_id));
        toast.success("File deleted successfully");
        closeDeletePblFileModal();
    };

    return (
        <div className="max-w-full mx-auto rounded-lg sm:p-7 bg-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">PBL File List</h1>
                <button
                    onClick={openAddPblFileModal}
                    disabled={isLoading}
                    className={`bg-primary hover:bg-hover text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                    <img src={AddPblFileIcon} alt="Add PBL File" className="h-6 w-6" />
                    <span className="hidden md:inline font-bold">Add PBL File</span>
                </button>
            </div>

            <div className="flex flex-col">
                <div className="overflow-x-auto w-full rounded-lg">
                    <table className="w-full min-w-[800px]">
                        <colgroup>
                            <col className="w-[20%] min-w-[160px]" />
                            <col className="w-[50%] min-w-[300px]" />
                            <col className="w-[30%] min-w-[240px]" />
                        </colgroup>
                        <thead>
                            <tr className="bg-secondary text-white">
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">Name</th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">Description</th>
                                <th className="px-8 py-4 text-left font-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={3} className="px-8 py-16">
                                        <Loader message="Loading file data..." />
                                    </td>
                                </tr>
                            ) : files.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-8 py-16 text-center text-textColor">
                                        No files found.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((file, index) => (
                                    <tr key={file.file_id} className={index % 2 === 1 ? "bg-third" : "bg-white"}>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{file.name}</div>
                                        </td>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{file.description}</div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-nowrap gap-2">
                                                <button
                                                    onClick={() => openViewPblFileModal(file)}
                                                    className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                >
                                                    <img src={ViewIcon} alt="View" className="h-4 w-4" />
                                                    <span className="hidden md:inline font-bold">View</span>
                                                </button>
                                                <button
                                                    onClick={() => openEditPblFileModal(file)}
                                                    className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                >
                                                    <img src={EditIcon} alt="Edit" className="h-4 w-4" />
                                                    <span className="hidden md:inline font-bold">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => openDeletePblFileModal(file)}
                                                    className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
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
                                disabled={currentPage === 1}
                                className={`p-2 rounded ${currentPage === 1 ? "text-gray cursor-not-allowed" : "text-textColor cursor-pointer hover:bg-third"}`}
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
                                    disabled={typeof number !== "number"}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded ${currentPage === totalPages ? "text-gray cursor-not-allowed" : "text-textColor cursor-pointer hover:bg-third"}`}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                )}
            </div>

            {showAddModal && <AddPblFileModal onClose={closeAddPblFileModal} onFileAdded={handleFileAdded} />}
            {showEditModal && selectedFile && <EditPblFileModal onClose={closeEditPblFileModal} file={selectedFile} onFileUpdated={handleFileUpdated} />}
            {showViewModal && selectedFile && <ViewPblFileModal onClose={closeViewPblFileModal} file={selectedFile} />}
            {showDeleteModal && selectedFile && <DeletePblFileModal onClose={closeDeletePblFileModal} file={selectedFile} onFileDeleted={handleFileDeleted} />}
        </div>
    );
};

export default PblFileManagement;