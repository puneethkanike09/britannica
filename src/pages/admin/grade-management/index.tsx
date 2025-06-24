import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AddGradeModal from "./modals/AddGradeModal";
import EditGradeModal from "./modals/EditGradeModal";
import ViewGradeModal from "./modals/ViewGradeModal";
import DeleteGradeModal from "./modals/DeleteGradeModal";
import ViewIcon from "../../../assets/dashboard/Admin/grade-management/view.svg";
import EditIcon from "../../../assets/dashboard/Admin/grade-management/edit.svg";
import DeleteIcon from "../../../assets/dashboard/Admin/grade-management/delete.svg";
import AddGradeIcon from "../../../assets/dashboard/Admin/grade-management/add-grade.svg";
import Loader from "../../../components/common/Loader";
import toast from "react-hot-toast";

interface Grade {
    grade_id: string;
    title: string;
    description: string;
}

const GradeManagement: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [grades, setGrades] = useState<Grade[]>([]);

    const itemsPerPage = 6;

    // Dummy data for grades
    const dummyGrades: Grade[] = Array.from({ length: 12 }, (_, i) => ({
        grade_id: `grade-${i + 1}`,
        title: `Grade ${i + 1}`,
        description: `Description for Grade ${i + 1} curriculum and subjects.`,
    }));

    // Load dummy grades on mount
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setGrades(dummyGrades);
            setIsLoading(false);
        }, 1000); // Simulate loading
    }, []);

    // Calculate total pages
    const totalPages = Math.ceil(grades.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = grades.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Open Add Grade Modal
    const openAddGradeModal = () => {
        setShowAddModal(true);
    };

    // Open Edit Grade Modal
    const openEditGradeModal = (grade: Grade) => {
        setSelectedGrade(grade);
        setShowEditModal(true);
    };

    // Open View Grade Modal
    const openViewGradeModal = (grade: Grade) => {
        setSelectedGrade(grade);
        setShowViewModal(true);
    };

    // Open Delete Grade Modal
    const openDeleteGradeModal = (grade: Grade) => {
        setSelectedGrade(grade);
        setShowDeleteModal(true);
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

    // Close Add Grade Modal
    const closeAddGradeModal = () => {
        setShowAddModal(false);
    };

    // Close Edit Grade Modal
    const closeEditGradeModal = () => {
        setShowEditModal(false);
        setSelectedGrade(null);
    };

    // Close View Grade Modal
    const closeViewGradeModal = () => {
        setShowViewModal(false);
        setSelectedGrade(null);
    };

    // Close Delete Grade Modal
    const closeDeleteGradeModal = () => {
        setShowDeleteModal(false);
        setSelectedGrade(null);
    };

    // Callback for after grade is added
    const handleGradeAdded = (newGrade: { title: string; description: string }) => {
        const gradeWithId = { ...newGrade, grade_id: `grade-${grades.length + 1}` };
        setGrades([...grades, gradeWithId]);
        toast.success("Grade added successfully");
        closeAddGradeModal();
    };

    // Callback for after grade is updated
    const handleGradeUpdated = (updatedGrade: Grade) => {
        setGrades(grades.map((grade) => (grade.grade_id === updatedGrade.grade_id ? updatedGrade : grade)));
        toast.success("Grade updated successfully");
        closeEditGradeModal();
    };

    // Callback for after grade is deleted
    const handleGradeDeleted = (grade_id: string) => {
        setGrades(grades.filter((grade) => grade.grade_id !== grade_id));
        toast.success("Grade deleted successfully");
        closeDeleteGradeModal();
    };

    return (
        <div className="max-w-full mx-auto rounded-lg sm:p-7 bg-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">Grade List</h1>
                <button
                    onClick={openAddGradeModal}
                    disabled={isLoading}
                    className={`bg-primary hover:bg-hover text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                    <img src={AddGradeIcon} alt="Add Grade" className="h-6 w-6" />
                    <span className="hidden md:inline font-bold">Add Grade</span>
                </button>
            </div>

            <div className="flex flex-col">
                <div className="overflow-x-auto w-full rounded-lg">
                    <table className="w-full table-fixed min-w-[800px]">
                        <colgroup>
                            <col className="w-48" />
                            <col className="w-80" />
                            <col className="w-48" />
                        </colgroup>
                        <thead>
                            <tr className="bg-secondary text-white">
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">Title</th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">Description</th>
                                <th className="px-8 py-4 text-left font-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={3} className="px-8 py-16">
                                        <Loader message="Loading grade data..." />
                                    </td>
                                </tr>
                            ) : grades.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-8 py-16 text-center text-textColor">
                                        No grades found.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((grade, index) => (
                                    <tr key={grade.grade_id} className={index % 2 === 1 ? "bg-third" : "bg-white"}>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{grade.title}</div>
                                        </td>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{grade.description}</div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-nowrap gap-2">
                                                <button
                                                    onClick={() => openViewGradeModal(grade)}
                                                    className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                >
                                                    <img src={ViewIcon} alt="View" className="h-4 w-4" />
                                                    <span className="hidden md:inline font-bold">View</span>
                                                </button>
                                                <button
                                                    onClick={() => openEditGradeModal(grade)}
                                                    className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                >
                                                    <img src={EditIcon} alt="Edit" className="h-4 w-4" />
                                                    <span className="hidden md:inline font-bold">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => openDeleteGradeModal(grade)}
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

            {showAddModal && <AddGradeModal onClose={closeAddGradeModal} onGradeAdded={handleGradeAdded} />}
            {showEditModal && selectedGrade && (
                <EditGradeModal onClose={closeEditGradeModal} grade={selectedGrade} onGradeUpdated={handleGradeUpdated} />
            )}
            {showViewModal && selectedGrade && <ViewGradeModal onClose={closeViewGradeModal} grade={selectedGrade} />}
            {showDeleteModal && selectedGrade && (
                <DeleteGradeModal onClose={closeDeleteGradeModal} grade={selectedGrade} onGradeDeleted={handleGradeDeleted} />
            )}
        </div>
    );
};

export default GradeManagement;