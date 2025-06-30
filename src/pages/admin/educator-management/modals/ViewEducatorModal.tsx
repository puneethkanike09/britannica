import { X } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from 'react';
import toast from "react-hot-toast";
import { TeacherActionModalProps } from "../../../../types/admin/educator-management";
import { School } from "../../../../types/admin/school-management";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import { EducatorService } from '../../../../services/educatorService';
import Loader from "../../../../components/common/Loader";
import { SchoolService } from "../../../../services/schoolService";

export default function ViewEducatorModal({ onClose, teacher }: TeacherActionModalProps) {
    const [formData, setFormData] = useState({
        teacher_id: teacher.teacher_id,
        firstName: teacher.teacher_name.split(' ')[0] || '',
        lastName: teacher.teacher_name.split(' ').slice(1).join(' ') || '',
        email: teacher.email || '',
        phone: teacher.phone || '',
        loginId: teacher.teacher_login || '',
        schoolId: teacher.schoolId || undefined,
        schoolName: teacher.school_name || '',
    });
    const [isVisible, setIsVisible] = useState(true);
    const [schools, setSchools] = useState<Pick<School, 'school_id' | 'school_name'>[]>([]);
    const [isSchoolsLoading, setIsSchoolsLoading] = useState(true);
    const [teacherLoading, setTeacherLoading] = useState(true);
    const [teacherError, setTeacherError] = useState<string | null>(null);
    const hasFetchedTeacher = useRef(false);

    // Handle modal close
    const handleClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    // Handle ESC key press
    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [handleClose]);

    // Fetch schools for dropdown
    useEffect(() => {
        let mounted = true;
        setIsSchoolsLoading(true);

        SchoolService.fetchSchoolsForDropdown().then((res) => {
            if (mounted) {
                if (res && !res.error) {
                    setSchools(res.schools || []);
                } else {
                    setSchools([]);
                    toast.error('Failed to load schools');
                }
                setIsSchoolsLoading(false);
            }
        }).catch(() => {
            if (mounted) {
                setSchools([]);
                setIsSchoolsLoading(false);
                toast.error('Failed to load schools');
            }
        });

        return () => { mounted = false; };
    }, []);

    // Fetch teacher details after schools are loaded
    const schoolsLoaded = !isSchoolsLoading;
    useEffect(() => {
        if (!schoolsLoaded || hasFetchedTeacher.current) return;
        hasFetchedTeacher.current = true;
        let mounted = true;
        setTeacherLoading(true);
        setTeacherError(null);
        EducatorService.fetchTeacherCompleteDetails(teacher.teacher_id).then((res) => {
            if (!mounted) return;
            if (res.error === false || res.error === "false") {
                setFormData(prev => {
                    let matchedSchoolId = prev.schoolId;
                    let matchedSchoolName = prev.schoolName;
                    if (res.teacher?.school_name && schools.length > 0) {
                        const match = schools.find(s => s.school_name === res.teacher?.school_name);
                        if (match) {
                            matchedSchoolId = Number(match.school_id);
                            matchedSchoolName = match.school_name;
                        }
                    }
                    return {
                        ...prev,
                        teacher_id: String(res.teacher?.teacher_id ?? prev.teacher_id),
                        firstName: res.teacher?.first_name ?? '',
                        lastName: res.teacher?.last_name ?? '',
                        email: res.teacher?.email_id ?? '',
                        phone: res.teacher?.mobile_no ?? '',
                        loginId: res.teacher?.login_id ?? '',
                        schoolId: matchedSchoolId,
                        schoolName: matchedSchoolName,
                    };
                });
            } else {
                setTeacherError(res.message || 'Failed to fetch educator details');
            }
            setTeacherLoading(false);
        }).catch((err) => {
            if (!mounted) return;
            setTeacherError(err.message || 'Failed to fetch educator details');
            setTeacherLoading(false);
        });
        return () => { mounted = false; };
    }, [schools, schoolsLoaded, teacher.teacher_id]);

    return (
        <AnimatePresence onExitComplete={handleAnimationComplete}>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 bg-black/40 backdrop-blur-xs z-90 flex items-center justify-center px-4"
                    onClick={handleBackdropClick}
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.1, ease: "easeOut" }}
                >
                    <motion.div
                        className="bg-white rounded-lg w-full max-w-[835px] max-h-[90vh] overflow-hidden flex flex-col sm:px-10 py-4"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Sticky Header */}
                        <div className="bg-white px-8 py-6 flex justify-between items-center flex-shrink-0">
                            <h2 className="text-3xl font-bold text-secondary">Educator Details</h2>
                            <button
                                onClick={handleClose}
                                className="text-textColor hover:text-hover cursor-pointer"
                            >
                                <X className="h-7 w-7" />
                            </button>
                        </div>
                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            {teacherLoading ? (
                                <Loader message="Loading Educator Details..." />
                            ) : teacherError ? (
                                <div className="py-12 text-center text-red">{teacherError}</div>
                            ) : (
                                <div className="border border-lightGray rounded-lg overflow-hidden mb-6">
                                    {/* First Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3">
                                        <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                            <div className="text-textColor mb-2">First Name</div>
                                            <div className="text-primary font-medium break-all">{formData.firstName || '-'}</div>
                                        </div>
                                        <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                            <div className="text-textColor mb-2">Last Name</div>
                                            <div className="text-primary font-medium break-all">{formData.lastName || '-'}</div>
                                        </div>
                                        <div className="p-6 border-b border-lightGray md:border-b-0">
                                            <div className="text-textColor mb-2">Email Address</div>
                                            <div className="text-primary font-medium break-all">{formData.email || '-'}</div>
                                        </div>
                                    </div>
                                    {/* Second Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 md:border-t md:border-lightGray">
                                        <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                            <div className="text-textColor mb-2">Phone Number</div>
                                            <div className="text-primary font-medium break-all">{formData.phone || '-'}</div>
                                        </div>
                                        <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                            <div className="text-textColor mb-2">Login ID</div>
                                            <div className="text-primary font-medium break-all">{formData.loginId || '-'}</div>
                                        </div>
                                        <div className="p-6 border-b border-lightGray md:border-b-0">
                                            <div className="text-textColor mb-2">School</div>
                                            <div className="text-primary font-medium break-all">{formData.schoolName || '-'}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}