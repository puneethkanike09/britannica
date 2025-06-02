import { X } from "lucide-react";
import { School, EducatorActionModalProps } from "../../../../types/admin";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";

// Mock schools data (same as in EditEducatorModal)
const schools: Pick<School, 'id' | 'name'>[] = [
    { id: 1, name: "Britanica School" },
    { id: 2, name: "St. Mary's School" },
    { id: 3, name: "Delhi Public School" },
    { id: 4, name: "Kendriya Vidyalaya" },
];

export default function ViewEducatorModal({ onClose, educator }: EducatorActionModalProps) {
    const [isVisible, setIsVisible] = useState(true);

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

    // Find the school name if schoolId is provided
    const schoolName = educator.schoolId
        ? schools.find((school) => school.id === educator.schoolId)?.name || "Not assigned"
        : "Not assigned";

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
                            <div className="border border-lightGray rounded-lg overflow-hidden mb-6">
                                {/* First Row */}
                                <div className="grid grid-cols-1 md:grid-cols-3">
                                    <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                        <div className="text-textColor mb-2">Full Name</div>
                                        <div className="text-primary font-medium break-words">
                                            {`${educator.firstName} ${educator.lastName}`}
                                        </div>
                                    </div>
                                    <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                        <div className="text-textColor mb-2">Email Address</div>
                                        <div className="text-primary font-medium break-words">{educator.email}</div>
                                    </div>
                                    <div className="p-6 border-b border-lightGray md:border-b-0">
                                        <div className="text-textColor mb-2">Phone Number</div>
                                        <div className="text-primary font-medium break-words">{educator.phone}</div>
                                    </div>
                                </div>

                                {/* Second Row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 md:border-t md:border-lightGray">
                                    <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                        <div className="text-textColor mb-2">Login ID</div>
                                        <div className="text-primary font-medium break-words">
                                            {educator.loginId}
                                        </div>
                                    </div>
                                    <div className="p-6 md:border-r md:border-lightGray">
                                        <div className="text-textColor mb-2">School</div>
                                        <div className="text-primary font-medium break-words">{schoolName}</div>
                                    </div>
                                    <div className="hidden md:block"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}