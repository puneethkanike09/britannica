import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AddEducatorModal from './modals/AddEducatorModal';
import EditEducatorModal from './modals/EditEducatorModal';
import ViewEducatorModal from './modals/ViewEducatorModal';
import ViewIcon from '../../../assets/dashboard/Admin/educator-management/view.svg';
import EditIcon from '../../../assets/dashboard/Admin/educator-management/edit.svg';
import DeleteIcon from '../../../assets/dashboard/Admin/educator-management/delete.svg';
import DeleteEducatorModal from './modals/DeleteEducatorModal';
import AddEducatorIcon from '../../../assets/dashboard/Admin/educator-management/add-educator.svg';
import { Educator } from '../../../types/admin';
import Loader from '../components/common/Loader';

// Mock schools data
const schools = [
    { id: 1, name: "Britanica School" },
    { id: 2, name: "St. Mary's School" },
    { id: 3, name: "Delhi Public School" },
    { id: 4, name: "Kendriya Vidyalaya" },
];

// Mock data for educators with schoolId
const educators: Educator[] = [
    {
        id: 1,
        firstName: "Kristin",
        lastName: "Watson",
        email: "michelle.rivera@example.com",
        phone: "+92857324517",
        loginId: "kristin.w",
        schoolId: 1,
    },
    {
        id: 2,
        firstName: "Marvin",
        lastName: "McKinney",
        email: "debbie.baker@example.com",
        phone: "+19857324517",
        loginId: "marvin.m",
        schoolId: 2,
    },
    {
        id: 3,
        firstName: "Jane",
        lastName: "Cooper",
        email: "kenzi.lawson@example.com",
        phone: "+19362632376",
        loginId: "jane.c",
        schoolId: 3,
    },
    {
        id: 4,
        firstName: "Cody",
        lastName: "Fisher",
        email: "nathan.roberts@example.com",
        phone: "+18434436274",
        loginId: "cody.f",
        schoolId: 4,
    },
    {
        id: 5,
        firstName: "Bessie",
        lastName: "Cooper",
        email: "felicia.reid@example.com",
        phone: "+17823456901",
        loginId: "bessie.c",
        schoolId: 1,
    },
    {
        id: 6,
        firstName: "Leslie",
        lastName: "Alexander",
        email: "tim.jennings@example.com",
        phone: "+17823456901",
        loginId: "leslie.a",
        schoolId: 2,
    },
    {
        id: 7,
        firstName: "Guy",
        lastName: "Hawkins",
        email: "alma.lawson@example.com",
        phone: "+18434436274",
        loginId: "guy.h",
        schoolId: 3,
    },
    {
        id: 8,
        firstName: "Theresa",
        lastName: "Webb",
        email: "debra.holt@example.com",
        phone: "+19362632376",
        loginId: "theresa.w",
        schoolId: 4,
    },
    {
        id: 9,
        firstName: "Theresa",
        lastName: "Webb",
        email: "debra.holt@example.com",
        phone: "+19362632376",
        loginId: "theresa.w2",
        schoolId: 1,
    },
    {
        id: 10,
        firstName: "Theresa",
        lastName: "Webb",
        email: "debra.holt@example.com",
        phone: "+19362632376",
        loginId: "theresa.w3",
        schoolId: 2,
    },
    {
        id: 11,
        firstName: "Theresa",
        lastName: "Webb",
        email: "debra.holt@example.com",
        phone: "+19362632376",
        loginId: "theresa.w4",
        schoolId: 3,
    },
    {
        id: 12,
        firstName: "Theresa",
        lastName: "Webb",
        email: "debra.holt@example.com",
        phone: "+19362632376",
        loginId: "theresa.w5",
        schoolId: 4,
    },
];

const EducatorManagement: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedEducator, setSelectedEducator] = useState<Educator | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const itemsPerPage = 6;

    // Simulate loading for 2 seconds on component mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Calculate total pages
    const totalPages = Math.ceil(educators.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = educators.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Open Add Educator Modal
    const openAddEducatorModal = () => {
        setShowAddModal(true);
    };

    // Open Edit Educator Modal
    const openEditEducatorModal = (educator: Educator) => {
        setSelectedEducator(educator);
        setShowEditModal(true);
    };

    // Open View Educator Modal
    const openViewEducatorModal = (educator: Educator) => {
        setSelectedEducator(educator);
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

    const openDeleteEducatorModal = (educator: Educator) => {
        setSelectedEducator(educator);
        setShowDeleteModal(true);
    };

    const closeDeleteEducatorModal = () => {
        setShowDeleteModal(false);
        setSelectedEducator(null);
    };

    return (
        <div className="max-w-full mx-auto rounded-lg sm:p-7 bg-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">Educator List</h1>
                <button
                    onClick={openAddEducatorModal}
                    disabled={isLoading}
                    className={`bg-primary hover:bg-hover text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                >
                    <img src={AddEducatorIcon} alt="Add Educator" className="h-5 w-5" />
                    <span className="hidden md:inline font-bold">Add Educator</span>
                </button>
            </div>

            <div className="flex flex-col">
                <div className="overflow-x-auto w-full rounded-lg">
                    <table className="w-full table-fixed min-w-[800px]">
                        <colgroup>
                            <col className="w-48" />
                            <col className="w-48" />
                            <col className="w-72" />
                            <col className="w-48" />
                            <col className="w-80" />
                        </colgroup>
                        <thead>
                            <tr className="bg-secondary text-white">
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">Educator Name</th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">School Name</th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">Email Address</th>
                                <th className="px-8 py-4 text-left border-r-1 border-white font-black">Phone Number</th>
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
                            ) : (
                                currentItems.map((educator, index) => {
                                    // Find school name or display 'Not assigned'
                                    const schoolName = educator.schoolId
                                        ? schools.find((school) => school.id === educator.schoolId)?.name || "Not assigned"
                                        : "Not assigned";

                                    return (
                                        <tr key={educator.id} className={index % 2 === 1 ? "bg-sky-50" : "bg-white"}>
                                            <td className="px-8 py-4 break-all">
                                                <div className="text-textColor">
                                                    {`${educator.firstName} ${educator.lastName}`}
                                                </div>
                                            </td>
                                            <td className="px-8 py-4 break-all">
                                                <div className="text-textColor">
                                                    {schoolName}
                                                </div>
                                            </td>
                                            <td className="px-8 py-4 break-all">
                                                <div className="text-textColor">
                                                    {educator.email}
                                                </div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className="text-textColor">
                                                    {educator.phone}
                                                </div>
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
                                                        onClick={() => openEditEducatorModal(educator)}
                                                        className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                        disabled={isLoading}
                                                    >
                                                        <img src={EditIcon} alt="Edit" className="h-4 w-4" />
                                                        <span className="hidden md:inline font-bold">Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteEducatorModal(educator)}
                                                        className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1 min-w-[80px] justify-center"
                                                        disabled={isLoading}
                                                    >
                                                        <img src={DeleteIcon} alt="Delete" className="h-4 w-4" />
                                                        <span className="hidden md:inline font-bold">Delete</span>
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
                                className={`p-2 rounded ${currentPage === 1 || isLoading ? 'text-gray cursor-not-allowed' : 'text-textColor cursor-pointer hover:bg-third'}`}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            {getPageNumbers().map((number, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof number === 'number' && paginate(number)}
                                    className={`px-[10px] py-1 rounded cursor-pointer ${number === currentPage ? 'bg-secondary text-white' : typeof number === 'number' ? 'text-textColor hover:bg-third' : 'text-darkGray'}`}
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

            {showAddModal && <AddEducatorModal onClose={closeAddEducatorModal} />}
            {showEditModal && selectedEducator && (
                <EditEducatorModal onClose={closeEditEducatorModal} educator={selectedEducator} />
            )}
            {showViewModal && selectedEducator && (
                <ViewEducatorModal onClose={closeViewEducatorModal} educator={selectedEducator} />
            )}
            {showDeleteModal && selectedEducator && (
                <DeleteEducatorModal onClose={closeDeleteEducatorModal} educator={selectedEducator} />
            )}
        </div>
    );
};

export default EducatorManagement;