import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AddSchoolModal from "./modals/AddSchoolModal";
import EditSchoolModal from "./modals/EditSchoolModal";
import ViewSchoolModal from "./modals/ViewSchoolModal";
// import DeleteSchoolModal from "./modals/DeleteSchoolModal";
import ViewIcon from "../../../assets/dashboard/Admin/school-management/view.svg";
import EditIcon from "../../../assets/dashboard/Admin/school-management/edit.svg";
// import DeleteIcon from "../../../assets/dashboard/Admin/school-management/delete.svg";
import AddSchoolIcon from "../../../assets/dashboard/Admin/school-management/add-school.svg";
import { School } from "../../../types/admin";
import Loader from "../components/common/Loader";
import { SchoolService } from "../../../services/schoolService";
import toast from "react-hot-toast";

const SchoolManagement: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
    // const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [schools, setSchools] = useState<School[]>([]);

    const itemsPerPage = 6;

    // Fetch schools on mount and when needed
    const loadSchools = async () => {
        setIsLoading(true);
        try {
            const response = await SchoolService.fetchSchools();
            console.log("Fetched schools:", response);
            if (response.error === false || response.error === "false") {
                setSchools(response.schools || []);
            } else {
                toast.error(response.message || "Failed to load schools");
            }
        } catch (error) {
            console.error("Error fetching schools:", error);
            toast.error("Error loading schools");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadSchools();
    }, []);

    // Calculate total pages
    const totalPages = Math.ceil(schools.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = schools.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Open Add School Modal
    const openAddSchoolModal = () => {
        setShowAddModal(true);
    };

    // Open Edit School Modal
    const openEditSchoolModal = (school: School) => {
        setSelectedSchool(school);
        setShowEditModal(true);
    };

    // Open View School Modal
    const openViewSchoolModal = (school: School) => {
        setSelectedSchool(school);
        setShowViewModal(true);
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

    const closeAddSchoolModal = () => {
        setShowAddModal(false);
    };

    // Callback for after school is added or updated
    const handleSchoolAdded = () => {
        loadSchools();
    };
    const handleSchoolUpdated = () => {
        loadSchools();
    };

    const closeEditSchoolModal = () => {
        setShowEditModal(false);
        setSelectedSchool(null);
    };

    const closeViewSchoolModal = () => {
        setShowViewModal(false);
        setSelectedSchool(null);
    };

    // const openDeleteSchoolModal = (school: School) => {
    //     setSelectedSchool(school);
    //     // setShowDeleteModal(true);
    // };

    // const closeDeleteSchoolModal = () => {
    //     setShowDeleteModal(false);
    //     setSelectedSchool(null);
    // };

    return (
        <div className="max-w-full mx-auto rounded-lg sm:p-7 bg-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">School List</h1>
                <button
                    onClick={openAddSchoolModal}
                    disabled={isLoading}
                    className={`bg-primary hover:bg-hover text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                        }`}
                >
                    <img src={AddSchoolIcon} alt="Add School" className="h-6 w-6" />
                    <span className="hidden md:inline font-bold">Add School</span>
                </button>
            </div>

            <div className="flex flex-col">
                <div className="overflow-x-auto w-full rounded-lg">
                    <table className="w-full table-fixed min-w-[800px]">
                        <colgroup>
                            <col className="w-48" />
                            <col className="w-64" />
                            <col className="w-48" />
                            <col className="w-80" />
                        </colgroup>
                        <thead>
                            <tr className="bg-secondary text-white">
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">School Name</th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">Email Address</th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">Phone Number</th>
                                <th className="px-8 py-4 text-left font-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-16">
                                        <Loader message="Loading school data..." />
                                    </td>
                                </tr>
                            ) : schools.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-16 text-center text-textColor">
                                        No schools found.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((school, index) => (
                                    <tr key={school.school_id} className={index % 2 === 1 ? "bg-third" : "bg-white"}>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{school.school_name}</div>
                                        </td>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{school.school_email}</div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="text-textColor">{school.school_mobile_no}</div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-nowrap gap-2">
                                                <button
                                                    onClick={() => openViewSchoolModal(school)}
                                                    className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                >
                                                    <img src={ViewIcon} alt="View" className="h-4 w-4" />
                                                    <span className="hidden md:inline font-bold">View</span>
                                                </button>
                                                <button
                                                    onClick={() => openEditSchoolModal(school)}
                                                    className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                >
                                                    <img src={EditIcon} alt="Edit" className="h-4 w-4" />
                                                    <span className="hidden md:inline font-bold">Edit</span>
                                                </button>
                                                {/* <button
                                                    onClick={() => openDeleteSchoolModal(school)}
                                                    className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                >
                                                    <img src={DeleteIcon} alt="Delete" className="h-4 w-4" />
                                                    <span className="hidden md:inline font-bold">Delete</span>
                                                </button> */}
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
                                className={`p-2 rounded ${currentPage === 1 ? "text-gray cursor-not-allowed" : "text-textColor cursor-pointer hover:bg-third"
                                    }`}
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
                                className={`p-2 rounded ${currentPage === totalPages
                                    ? "text-gray cursor-not-allowed"
                                    : "text-textColor cursor-pointer hover:bg-third"
                                    }`}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                )}
            </div>

            {showAddModal && <AddSchoolModal onClose={closeAddSchoolModal} onSchoolAdded={handleSchoolAdded} />}
            {showEditModal && selectedSchool && (
                <EditSchoolModal onClose={closeEditSchoolModal} school={selectedSchool} onSchoolUpdated={handleSchoolUpdated} />
            )}
            {showViewModal && selectedSchool && (
                <ViewSchoolModal onClose={closeViewSchoolModal} school={selectedSchool} />
            )}
            {/* {showDeleteModal && selectedSchool && (
                <DeleteSchoolModal onClose={closeDeleteSchoolModal} school={selectedSchool} />
            )} */}
        </div>
    );
};

export default SchoolManagement;