import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AddSchoolModal from './modals/AddSchoolModal';
import EditSchoolModal from './modals/EditSchoolModal';
import ViewSchoolModal from './modals/ViewSchoolModal';
import DeleteSchoolModal from './modals/DeleteSchoolModal';

// Import custom SVG icons
import ViewIcon from '../../../assets/dashboard/Admin/school-management/view.svg';
import EditIcon from '../../../assets/dashboard/Admin/school-management/edit.svg';
import DeleteIcon from '../../../assets/dashboard/Admin/school-management/delete.svg';
import AddSchoolIcon from '../../../assets/dashboard/Admin/school-management/add-school.svg';
import { School } from '../../../types/admin';

// Mock data for schools
const schools = [
    {
        id: 1,
        name: "Britanica School",
        email: "michelle.rivera@example.com",
        phone: "+91857324517",
        address: "123 Main St, Anytown, USA",
    },
    {
        id: 2,
        name: "St. Mary's School",
        email: "debbie.baker@example.com",
        phone: "+19857324517",
        address: "456 Oak Ave, Anytown, USA",
    },
    {
        id: 3,
        name: "Delhi Public School",
        email: "kenzi.lawson@example.com",
        phone: "+19362632376",
        address: "789 Pine Rd, Anytown, USA",
    },
    {
        id: 4,
        name: "Kendriya Vidyalaya",
        email: "nathan.roberts@example.com",
        phone: "+18434436274",
        address: "101 Elm St, Anytown, USA",
    },
    {
        id: 5,
        name: "Springfield Academy",
        email: "felicia.reid@example.com",
        phone: "+17823456901",
    },
    {
        id: 6,
        name: "Greenwood High",
        email: "tim.jennings@example.com",
        phone: "+17823456901",
    },
    {
        id: 7,
        name: "Riverside School",
        email: "alma.lawson@example.com",
        phone: "+18434436274",
        address: "202 Maple Dr, Anytown, USA",
    },
    {
        id: 8,
        name: "Hilltop Institute",
        email: "debra.holt@example.com",
        phone: "+19362632376",
    },
    // Additional mock data updated with school names and phone numbers in E.164 format
    {
        id: 9,
        name: "Sunshine Academy",
        email: "nathan.roberts@example.com",
        phone: "+18434436274",
    },
    {
        id: 10,
        name: "Bright Future School",
        email: "felicia.reid@example.com",
        phone: "+17823456901",
    },
    {
        id: 11,
        name: "Evergreen High",
        email: "tim.jennings@example.com",
        phone: "+17823456901",
    },
    {
        id: 12,
        name: "Lakeside Academy",
        email: "alma.lawson@example.com",
        phone: "+18434436274",
    },
    {
        id: 13,
        name: "Horizon School",
        email: "debra.holt@example.com",
        phone: "+19362632376",
    },
    {
        id: 14,
        name: "Pinnacle Institute",
        email: "michelle.rivera@example.com",
        phone: "+91857324517",
        address: "303 Cedar Ln, Anytown, USA",
    },
    {
        id: 15,
        name: "Summit Academy",
        email: "debbie.baker@example.com",
        phone: "+19857324517",
    },
    {
        id: 16,
        name: "Starlight School",
        email: "kenzi.lawson@example.com",
        phone: "+19362632376",
    },
    {
        id: 17,
        name: "Crestview High",
        email: "nathan.roberts@example.com",
        phone: "+18434436274",
    },
    {
        id: 18,
        name: "Oakwood Academy",
        email: "felicia.reid@example.com",
        phone: "+17823456901",
    },
    {
        id: 19,
        name: "Maple Grove School",
        email: "tim.jennings@example.com",
        phone: "+17823456901",
    },
    {
        id: 20,
        name: "Riverdale Institute",
        email: "alma.lawson@example.com",
        phone: "+18434436274",
    },
    {
        id: 21,
        name: "Sunny Hills School",
        email: "debra.holt@example.com",
        phone: "+19362632376",
    },
    {
        id: 22,
        name: "Westview Academy",
        email: "nathan.roberts@example.com",
        phone: "+18434436274",
    },
    {
        id: 23,
        name: "Eastside High",
        email: "felicia.reid@example.com",
        phone: "+17823456901",
    },
    {
        id: 24,
        name: "Northpoint School",
        email: "tim.jennings@example.com",
        phone: "+17823456901",
    },
    {
        id: 25,
        name: "Southview Academy",
        email: "alma.lawson@example.com",
        phone: "+18434436274",
    },
    {
        id: 26,
        name: "Central High",
        email: "debra.holt@example.com",
        phone: "+19362632376",
    },
];



const SchoolManagement: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const itemsPerPage = 6;

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

    const closeAddSchoolModal = () => {
        setShowAddModal(false);
    };

    const closeEditSchoolModal = () => {
        setShowEditModal(false);
        setSelectedSchool(null);
    };

    const closeViewSchoolModal = () => {
        setShowViewModal(false);
        setSelectedSchool(null);
    };

    const openDeleteSchoolModal = (school: School) => {
        setSelectedSchool(school);
        setShowDeleteModal(true);
    };

    const closeDeleteSchoolModal = () => {
        setShowDeleteModal(false);
        setSelectedSchool(null);
    };

    return (

        <div className="max-w-full mx-auto rounded-lg sm:p-7 bg-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">School List</h1>
                <button
                    onClick={openAddSchoolModal}
                    className="bg-primary hover:bg-hover text-white px-8 py-3 rounded-lg font-medium cursor-pointer flex items-center gap-2"
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
                            {currentItems.map((school, index) => (
                                <tr key={school.id} className={index % 2 === 1 ? "bg-third" : "bg-white"}>
                                    <td className="px-8  py-4 break-all">
                                        <div className="text-textColor">{school.name}</div>
                                    </td>
                                    <td className="px-8  py-4 break-all">
                                        <div className="text-textColor">{school.email}</div>
                                    </td>
                                    <td className="px-8  py-4 ">
                                        <div className="text-textColor">{school.phone}</div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex flex-nowrap gap-2">
                                            <button
                                                onClick={() => openViewSchoolModal(school)}
                                                className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1   min-w-[80px] justify-center"
                                            >
                                                <img src={ViewIcon} alt="View" className="h-4 w-4" />
                                                <span className="hidden md:inline font-bold">View</span>
                                            </button>
                                            <button
                                                onClick={() => openEditSchoolModal(school)}
                                                className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1   min-w-[80px] justify-center"
                                            >
                                                <img src={EditIcon} alt="Edit" className="h-4 w-4" />
                                                <span className="hidden md:inline font-bold">Edit</span>
                                            </button>
                                            <button
                                                onClick={() => openDeleteSchoolModal(school)}
                                                className="bg-primary cursor-pointer hover:bg-hover text-white px-3 py-2 rounded text-sm flex items-center gap-1   min-w-[80px] justify-center"
                                            >
                                                <img src={DeleteIcon} alt="Delete" className="h-4 w-4" />
                                                <span className="hidden md:inline font-bold">Delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6 w-full">
                        <nav className="flex items-center space-x-1">
                            <button
                                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded ${currentPage === 1 ? 'text-gray cursor-not-allowed' : 'text-textColor cursor-pointer hover:bg-third'}`}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            {getPageNumbers().map((number, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof number === 'number' && paginate(number)}
                                    className={`px-[10px] py-1 rounded cursor-pointer ${number === currentPage ? 'bg-secondary text-white' : typeof number === 'number' ? 'text-textColor hover:bg-third' : 'text-darkGray'}`}
                                    disabled={typeof number !== 'number'}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded ${currentPage === totalPages ? 'text-gray cursor-not-allowed' : 'text-textColor cursor-pointer hover:bg-third'}`}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                )}
            </div>

            {showAddModal && <AddSchoolModal onClose={closeAddSchoolModal} />}
            {showEditModal && selectedSchool && (
                <EditSchoolModal onClose={closeEditSchoolModal} school={selectedSchool} />
            )}
            {showViewModal && selectedSchool && (
                <ViewSchoolModal onClose={closeViewSchoolModal} school={selectedSchool} />
            )}
            {showDeleteModal && selectedSchool && (
                <DeleteSchoolModal onClose={closeDeleteSchoolModal} school={selectedSchool} />
            )}
        </div>
    );
};

export default SchoolManagement;