import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AddThemeModal from "./modals/AddThemeModal";
import EditThemeModal from "./modals/EditThemeModal";
import ViewThemeModal from "./modals/ViewThemeModal";
import DeleteThemeModal from "./modals/DeleteThemeModal";
import ViewIcon from "../../../assets/dashboard/Admin/theme-management/view.svg";
import EditIcon from "../../../assets/dashboard/Admin/theme-management/edit.svg";
import DeleteIcon from "../../../assets/dashboard/Admin/theme-management/delete.svg";
import AddThemeIcon from "../../../assets/dashboard/Admin/theme-management/add-theme.svg";
import Loader from "../../../components/common/Loader";
import toast from "react-hot-toast";

interface Theme {
    theme_id: string;
    name: string;
    description: string;
}

const ThemeManagement: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [themes, setThemes] = useState<Theme[]>([]);

    const itemsPerPage = 6;

    // Dummy data for themes
    const dummyThemes: Theme[] = Array.from({ length: 12 }, (_, i) => ({
        theme_id: `theme-${i + 1}`,
        name: `Theme ${i + 1}`,
        description: `Description for Theme ${i + 1} content and structure.`,
    }));

    // Load dummy themes on mount
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setThemes(dummyThemes);
            setIsLoading(false);
        }, 1000); // Simulate loading
    }, []);

    // Calculate total pages
    const totalPages = Math.ceil(themes.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = themes.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Open Add Theme Modal
    const openAddThemeModal = () => {
        setShowAddModal(true);
    };

    // Open Edit Theme Modal
    const openEditThemeModal = (theme: Theme) => {
        setSelectedTheme(theme);
        setShowEditModal(true);
    };

    // Open View Theme Modal
    const openViewThemeModal = (theme: Theme) => {
        setSelectedTheme(theme);
        setShowViewModal(true);
    };

    // Open Delete Theme Modal
    const openDeleteThemeModal = (theme: Theme) => {
        setSelectedTheme(theme);
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

    // Close Add Theme Modal
    const closeAddThemeModal = () => {
        setShowAddModal(false);
    };

    // Close Edit Theme Modal
    const closeEditThemeModal = () => {
        setShowEditModal(false);
        setSelectedTheme(null);
    };

    // Close View Theme Modal
    const closeViewThemeModal = () => {
        setShowViewModal(false);
        setSelectedTheme(null);
    };

    // Close Delete Theme Modal
    const closeDeleteThemeModal = () => {
        setShowDeleteModal(false);
        setSelectedTheme(null);
    };

    // Callback for after theme is added
    const handleThemeAdded = (newTheme: { name: string; description: string }) => {
        const themeWithId = { ...newTheme, theme_id: `theme-${themes.length + 1}` };
        setThemes([...themes, themeWithId]);
        toast.success("Theme added successfully");
        closeAddThemeModal();
    };

    // Callback for after theme is updated
    const handleThemeUpdated = (updatedTheme: Theme) => {
        setThemes(themes.map((theme) => (theme.theme_id === updatedTheme.theme_id ? updatedTheme : theme)));
        toast.success("Theme updated successfully");
        closeEditThemeModal();
    };

    // Callback for after theme is deleted
    const handleThemeDeleted = (theme_id: string) => {
        setThemes(themes.filter((theme) => theme.theme_id !== theme_id));
        toast.success("Theme deleted successfully");
        closeDeleteThemeModal();
    };

    return (
        <div className="max-w-full mx-auto rounded-lg sm:p-7 bg-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">Theme List</h1>
                <button
                    onClick={openAddThemeModal}
                    disabled={isLoading}
                    className={`bg-primary hover:bg-hover text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                    <img src={AddThemeIcon} alt="Add Theme" className="h-6 w-6" />
                    <span className="hidden md:inline font-bold">Add Theme</span>
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
                                        <Loader message="Loading theme data..." />
                                    </td>
                                </tr>
                            ) : themes.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-8 py-16 text-center text-textColor">
                                        No themes found.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((theme, index) => (
                                    <tr key={theme.theme_id} className={index % 2 === 1 ? "bg-third" : "bg-white"}>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{theme.name}</div>
                                        </td>
                                        <td className="px-8 py-4 break-all">
                                            <div className="text-textColor">{theme.description}</div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-nowrap gap-2">
                                                <button
                                                    onClick={() => openViewThemeModal(theme)}
                                                    className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                >
                                                    <img src={ViewIcon} alt="View" className="h-4 w-4" />
                                                    <span className="hidden md:inline font-bold">View</span>
                                                </button>
                                                <button
                                                    onClick={() => openEditThemeModal(theme)}
                                                    className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                >
                                                    <img src={EditIcon} alt="Edit" className="h-4 w-4" />
                                                    <span className="hidden md:inline font-bold">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => openDeleteThemeModal(theme)}
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

            {showAddModal && <AddThemeModal onClose={closeAddThemeModal} onThemeAdded={handleThemeAdded} />}
            {showEditModal && selectedTheme && (
                <EditThemeModal onClose={closeEditThemeModal} theme={selectedTheme} onThemeUpdated={handleThemeUpdated} />
            )}
            {showViewModal && selectedTheme && <ViewThemeModal onClose={closeViewThemeModal} theme={selectedTheme} />}
            {showDeleteModal && selectedTheme && (
                <DeleteThemeModal onClose={closeDeleteThemeModal} theme={selectedTheme} onThemeDeleted={handleThemeDeleted} />
            )}
        </div>
    );
};

export default ThemeManagement;