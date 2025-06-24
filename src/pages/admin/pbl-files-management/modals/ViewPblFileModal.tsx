import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";

interface ViewPblFileModalProps {
    onClose: () => void;
    file: { file_id: string; name: string; description: string; grade: string; theme: string; type: string; file: File | null };
}

export default function ViewPblFileModal({ onClose, file }: ViewPblFileModalProps) {
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
                            <h2 className="text-3xl font-bold text-secondary">PBL File Details</h2>
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
                                        <div className="text-textColor mb-2">Grade</div>
                                        <div className="text-primary font-medium break-all">{file.grade || '-'}</div>
                                    </div>
                                    <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                        <div className="text-textColor mb-2">Theme</div>
                                        <div className="text-primary font-medium break-all">{file.theme || '-'}</div>
                                    </div>
                                    <div className="p-6 border-b border-lightGray md:border-b-0">
                                        <div className="text-textColor mb-2">Type</div>
                                        <div className="text-primary font-medium break-all">{file.type || '-'}</div>
                                    </div>
                                </div>
                                {/* Second Row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 md:border-t md:border-lightGray">
                                    <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                        <div className="text-textColor mb-2">Name</div>
                                        <div className="text-primary font-medium break-all">{file.name || '-'}</div>
                                    </div>
                                    <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                        <div className="text-textColor mb-2">Description</div>
                                        <div className="text-primary font-medium break-all">{file.description || '-'}</div>
                                    </div>
                                    <div className="p-6 border-b border-lightGray md:border-b-0">
                                        <div className="text-textColor mb-2">File ID</div>
                                        <div className="text-primary font-medium break-all">{file.file_id || '-'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}