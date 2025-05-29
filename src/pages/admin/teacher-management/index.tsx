import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AddTeacherModal from './modals/AddTeacherModal';
import EditTeacherModal from './modals/EditTeacherModal';
import ViewTeacherModal from './modals/ViewTeacherModal';
import ViewIcon from '../../../assets/dashboard/Admin/teacher-management/view.svg';
import EditIcon from '../../../assets/dashboard/Admin/teacher-management/edit.svg';
import DeleteIcon from '../../../assets/dashboard/Admin/teacher-management/delete.svg';
import DeleteTeacherModal from './modals/DeleteTeacherModal';
import AddTeacherIcon from '../../../assets/dashboard/Admin/teacher-management/add-teacher.svg';

// Mock schools data
const schools = [
    { id: 1, name: "Britanica School" },
    { id: 2, name: "St. Mary's School" },
    { id: 3, name: "Delhi Public School" },
    { id: 4, name: "Kendriya Vidyalaya" },
];

interface Teacher {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    loginId: string;
    schoolId?: number; // Added schoolId to link to a school
}

// Mock data for teachers with schoolId
const teachers: Teacher[] = [
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

const TeacherManagement: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const itemsPerPage = 6;

    // Calculate total pages
    const totalPages = Math.ceil(teachers.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = teachers.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Open Add Teacher Modal
    const openAddTeacherModal = () => {
        setShowAddModal(true);
    };

    // Open Edit Teacher Modal
    const openEditTeacherModal = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setShowEditModal(true);
    };

    // Open View Teacher Modal
    const openViewTeacherModal = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
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

    const closeAddTeacherModal = () => {
        setShowAddModal(false);
    };

    const closeEditTeacherModal = () => {
        setShowEditModal(false);
        setSelectedTeacher(null);
    };

    const closeViewTeacherModal = () => {
        setShowViewModal(false);
        setSelectedTeacher(null);
    };

    const openDeleteTeacherModal = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setShowDeleteModal(true);
    };

    const closeDeleteTeacherModal = () => {
        setShowDeleteModal(false);
        setSelectedTeacher(null);
    };

    return (
        <div className="max-w-full mx-auto rounded-lg sm:p-10 bg-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">Teacher List</h1>
                <button
                    onClick={openAddTeacherModal}
                    className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-lg font-medium cursor-pointer flex items-center gap-2"
                >
                    <img src={AddTeacherIcon} alt="Add" className="w-5 h-5" />
                    <span className="hidden md:inline font-bold">Add Teacher</span>
                </button>
            </div>

            <div className="flex flex-col">
                <div className="overflow-x-auto w-full rounded-lg">
                    <table className="w-full table-fixed min-w-[800px]">
                        <colgroup><col className="w-48" /><col className="w-48" /><col className="w-64" /><col className="w-48" /><col className="w-80" /></colgroup>
                        <thead>
                            <tr className="bg-indigo-900 text-white">
                                <th className="px-8 py-4 text-left border-r-1 border-gray-200 font-black">Teacher Name</th>
                                <th className="px-8 py-4 text-left border-r-1 border-gray-200 font-black">School Name</th>
                                <th className="px-8 py-4 text-left border-r-1 border-gray-200 font-black">Email Address</th>
                                <th className="px-8 py-4 text-left border-r-1 border-gray-200 font-black">Phone Number</th>
                                <th className="px-8 py-4 text-left font-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((teacher, index) => {
                                // Find school name or display 'Not assigned'
                                const schoolName = teacher.schoolId
                                    ? schools.find((school) => school.id === teacher.schoolId)?.name || "Not assigned"
                                    : "Not assigned";

                                return (
                                    <tr key={teacher.id} className={index % 2 === 1 ? "bg-sky-50" : "bg-white"}>
                                        <td className="px-8 py-4 break-words">
                                            <div className="text-textColor">
                                                {`${teacher.firstName} ${teacher.lastName}`}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 break-words">
                                            <div className="text-textColor">
                                                {schoolName}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 break-words">
                                            <div className="text-textColor">
                                                {teacher.email}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="text-textColor">
                                                {teacher.phone}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-nowrap gap-2">
                                                <button
                                                    onClick={() => openViewTeacherModal(teacher)}
                                                    className="bg-primary cursor-pointer hover:bg-primary/80 text-white px-3 py-2 rounded text-sm flex items-center gap-1 transition-colors min-w-[80px] justify-center"
                                                >
                                                    <img src={ViewIcon} alt="View" className="h-4 w-4" />
                                                    <span className="hidden md:inline">View</span>
                                                </button>
                                                <button
                                                    onClick={() => openEditTeacherModal(teacher)}
                                                    className="bg-primary cursor-pointer hover:bg-primary/80 text-white px-3 py-2 rounded text-sm flex items-center gap-1 transition-colors min-w-[80px] justify-center"
                                                >
                                                    <img src={EditIcon} alt="Edit" className="h-4 w-4" />
                                                    <span className="hidden md:inline">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => openDeleteTeacherModal(teacher)}
                                                    className="bg-primary cursor-pointer hover:bg-primary/80 text-white px-3 py-2 rounded text-sm flex items-center gap-1 transition-colors min-w-[80px] justify-center"
                                                >
                                                    <img src={DeleteIcon} alt="Delete" className="h-4 w-4" />
                                                    <span className="hidden md:inline">Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6 w-full">
                        <nav className="flex items-center space-x-1">
                            <button
                                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-secondary cursor-pointer hover:bg-third'}`}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            {getPageNumbers().map((number, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof number === 'number' && paginate(number)}
                                    className={`px-[10px] py-1 rounded cursor-pointer ${number === currentPage ? 'bg-secondary text-white' : typeof number === 'number' ? 'text-secondary hover:bg-third' : 'text-gray-500'}`}
                                    disabled={typeof number !== 'number'}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-secondary cursor-pointer hover:bg-third'}`}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                )}
            </div>

            {showAddModal && <AddTeacherModal onClose={closeAddTeacherModal} />}
            {showEditModal && selectedTeacher && (
                <EditTeacherModal onClose={closeEditTeacherModal} teacher={selectedTeacher} />
            )}
            {showViewModal && selectedTeacher && (
                <ViewTeacherModal onClose={closeViewTeacherModal} teacher={selectedTeacher} />
            )}
            {showDeleteModal && selectedTeacher && (
                <DeleteTeacherModal onClose={closeDeleteTeacherModal} teacher={selectedTeacher} />
            )}
        </div>
    );
};

export default TeacherManagement;