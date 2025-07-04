import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import { TeacherDeleteModalProps } from "../../../../types/admin/educator-management";
import { EducatorService } from "../../../../services/admin/educatorService";

export default function DeleteEducatorModal({ onClose, teacher, onTeacherDeleted }: TeacherDeleteModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        if (isDeleting) return;
        setIsVisible(false);
    };

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isDeleting) return;
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await EducatorService.deleteTeacher(teacher.teacher_id);
            if (response.error === false || response.error === "false") {
                toast.success(response.message || 'Educator deleted successfully');
                if (onTeacherDeleted) onTeacherDeleted();
                handleClose();
            } else {
                toast.error(response.message || 'Failed to delete educator');
            }
        } catch (error) {
            toast.error('Failed to delete educator');
        } finally {
            setIsDeleting(false);
        }
    };

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
                        className="bg-white rounded-lg w-full max-w-[500px] overflow-hidden flex flex-col sm:px-10 py-4"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Sticky Header */}
                        <div className="bg-white px-8 py-6 flex justify-between items-center flex-shrink-0">
                            <h2 className="text-3xl font-bold text-textColor">Delete Educator</h2>
                            <button
                                aria-label="Close"
                                onClick={handleClose}
                                className={`text-textColor hover:text-hover ${isDeleting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                disabled={isDeleting}
                            >
                                <X className="h-7 w-7" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-8 py-6">
                            <p className="text-textColor mb-6">
                                Are you sure you want to delete the educator <span className="font-bold">{teacher.teacher_name}</span>?
                            </p>

                            <div className="flex justify-start gap-4">
                                <button
                                    onClick={handleClose}
                                    className={`px-8 py-3 font-bold rounded-lg border border-lightGray text-gray hover:bg-primary/10 ${isDeleting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                    disabled={isDeleting}
                                >
                                    No, Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className={`px-8 py-3 font-bold rounded-lg bg-red text-white hover:bg-red/80 flex items-center justify-center gap-2 ${isDeleting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        'Yes, Delete'
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
} 