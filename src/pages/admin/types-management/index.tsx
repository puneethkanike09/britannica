import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ViewIcon from "../../../assets/dashboard/Admin/types-management/view.svg";
import EditIcon from "../../../assets/dashboard/Admin/types-management/edit.svg";
import DeleteIcon from "../../../assets/dashboard/Admin/types-management/delete.svg";
import AddTypeIcon from "../../../assets/dashboard/Admin/types-management/add-type.svg";
import Loader from "../../../components/common/Loader";
import toast from "react-hot-toast";
import AddTypeModal from "./modals/AddTypeModal";
import EditTypeModal from "./modals/EditTypeModal";
import ViewTypeModal from "./modals/ViewTypeModal";
import DeleteTypeModal from "./modals/DeleteTypeModal";

interface Type {
    user_access_type_id: string;
    name: string;
    description: string;
}

const TypesManagement: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedType, setSelectedType] = useState<Type | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [types, setTypes] = useState<Type[]>([]);

    const itemsPerPage = 6;

    // Dummy data for types
    const dummyTypes: Type[] = Array.from({ length: 12 }, (_, i) => ({
        user_access_type_id: `type-${i + 1}`,
        name: `Type ${i + 1}`,
        description: `Description for Type ${i + 1} characteristics and details.`,
    }));

    // Load dummy types on mount
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setTypes(dummyTypes);
            setIsLoading(false);
        }, 1000); // Simulate loading
    }, []);

    // Calculate total pages
    const totalPages = Math.ceil(types.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = types.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Open Add Type Modal
    const openAddTypeModal = () => {
        setShowAddModal(true);
    };

    // Open Edit Type Modal
    const openEditTypeModal = (type: Type) => {
        setSelectedType(type);
        setShowEditModal(true);
    };

    // Open View Type Modal
    const openViewTypeModal = (type: Type) => {
        setSelectedType(type);
        setShowViewModal(true);
    };

    // Open Delete Type Modal
    const openDeleteTypeModal = (type: Type) => {
        setSelectedType(type);
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

    // Close Add Type Modal
    const closeAddTypeModal = () => {
        setShowAddModal(false);
    };

    // Close Edit Type Modal
    const closeEditTypeModal = () => {
        setShowEditModal(false);
        setSelectedType(null);
    };

    // Close View Type Modal
    const closeViewTypeModal = () => {
        setShowViewModal(false);
        setSelectedType(null);
    };

    // Close Delete Type Modal
    const closeDeleteTypeModal = () => {
        setShowDeleteModal(false);
        setSelectedType(null);
    };

    // Callback for after type is added
    const handleTypeAdded = (newType: { name: string; description: string }) => {
        const typeWithId = { ...newType, user_access_type_id: `type-${types.length + 1}` };
        setTypes([...types, typeWithId]);
        toast.success("Type added successfully");
        closeAddTypeModal();
    };

    // Callback for after type is updated
    const handleTypeUpdated = (updatedType: Type) => {
        setTypes(types.map((type) => (type.user_access_type_id === updatedType.user_access_type_id ? updatedType : type)));
        toast.success("Type updated successfully");
        closeEditTypeModal();
    };

    // Callback for after type is deleted
    const handleTypeDeleted = (user_access_type_id: string) => {
        setTypes(types.filter((type) => type.user_access_type_id !== user_access_type_id));
        toast.success("Type deleted successfully");
        closeDeleteTypeModal();
    };

    return (
        <div className="max-w-full mx-auto rounded-lg sm:p-7 bg-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">Type List</h1>
                <button
                    onClick={openAddTypeModal}
                    disabled={isLoading}
                    className={`bg-primary hover:bg-hover text-white px-8 py-3 font-bold rounded-lg font-medium flex items-center gap-2 ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                    <img src={AddTypeIcon} alt="Add Type" className="h-6 w-6" />
                    <span className="hidden md:inline font-bold">Add Type</span>
                </button>
            </div>

            {/* Search Box UI */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 px-1">
                <div className="flex w-full md:max-w-md gap-2">
                    <input
                        type="text"
                        placeholder="Search here"
                        className="p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder focus:outline-none focus:border-primary"
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        className="bg-primary hover:bg-hover text-white px-6 py-3 font-bold rounded-lg flex items-center gap-2"
                        disabled={isLoading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
                        <span className="hidden md:inline font-bold">Search</span>
                    </button>
                </div>
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
                                        <Loader message="Loading type data..." />
                                    </td>
                                </tr>
                            ) : types.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-8 py-16 text-center text-textColor">
                                        No types found.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((type, index) => (
                                    <tr key={type.user_access_type_id} className={index % 2 === 1 ? "bg-third" : "bg-white"}>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{type.name}</div>
                                        </td>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{type.description}</div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-nowrap gap-2">
                                                <button
                                                    onClick={() => openViewTypeModal(type)}
                                                    className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                >
                                                    <img src={ViewIcon} alt="View" className="h-4 w-4" />
                                                    <span className="hidden md:inline font-bold">View</span>
                                                </button>
                                                <button
                                                    onClick={() => openEditTypeModal(type)}
                                                    className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                >
                                                    <img src={EditIcon} alt="Edit" className="h-4 w-4" />
                                                    <span className="hidden md:inline font-bold">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => openDeleteTypeModal(type)}
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

            {showAddModal && <AddTypeModal onClose={closeAddTypeModal} onTypeAdded={handleTypeAdded} />}
            {showEditModal && selectedType && (
                <EditTypeModal onClose={closeEditTypeModal} type={selectedType} onTypeUpdated={handleTypeUpdated} />
            )}
            {showViewModal && selectedType && <ViewTypeModal onClose={closeViewTypeModal} type={selectedType} />}
            {showDeleteModal && selectedType && (
                <DeleteTypeModal onClose={closeDeleteTypeModal} type={selectedType} onTypeDeleted={handleTypeDeleted} />
            )}
        </div>
    );
};

export default TypesManagement;