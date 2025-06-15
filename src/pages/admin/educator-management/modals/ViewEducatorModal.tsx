import { X } from "lucide-react";
import { EducatorActionModalProps } from "../../../../types/admin";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import { EducatorService } from "../../../../services/educatorService";

export default function ViewEducatorModal({ onClose, educator }: EducatorActionModalProps) {
    const [isVisible, setIsVisible] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [educatorDetails, setEducatorDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        EducatorService.fetchTeacherById(educator.teacher_id)
            .then((res) => {
                if (res.error === false || res.error === "false") {
                    setEducatorDetails(res.teacher!);
                } else {
                    setError(res.message || "Failed to fetch educator details");
                }
            })
            .catch((err) => {
                setError(err.message || "Failed to fetch educator details");
            })
            .finally(() => setLoading(false));
    }, [educator.teacher_id]);

    const handleClose = () => {
        setIsVisible(false);
    };

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

    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, []);

    return (
        <AnimatePresence onExitComplete={handleAnimationComplete}>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 bg-black/40  backdrop-blur-xs z-90 flex items-center justify-center px-4"
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
                            {loading ? (
                                <div className="py-12 text-center text-lg text-gray">Loading educator details...</div>
                            ) : error ? (
                                <div className="py-12 text-center text-red">{error}</div>
                            ) : educatorDetails ? (
                                <div className="border border-lightGray rounded-lg overflow-hidden mb-6">
                                    {/* First Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3">
                                        <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                            <div className="text-textColor mb-2">Full Name</div>
                                            <div className="text-primary font-medium break-all">
                                                {educatorDetails.first_name} {educatorDetails.last_name}
                                            </div>
                                        </div>
                                        <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                            <div className="text-textColor mb-2">Login</div>
                                            <div className="text-primary font-medium break-all">{educatorDetails.login_id}</div>
                                        </div>
                                        <div className="p-6 border-b border-lightGray md:border-b-0">
                                            <div className="text-textColor mb-2">School</div>
                                            <div className="text-primary font-medium break-all">{educatorDetails.school_name}</div>
                                        </div>
                                    </div>
                                    {/* Second Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 md:border-t md:border-lightGray">
                                        <div className="p-6 md:border-r md:border-lightGray">
                                            <div className="text-textColor mb-2">Status</div>
                                            <div className="text-primary font-medium break-all">{educatorDetails.status || '-'}</div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}