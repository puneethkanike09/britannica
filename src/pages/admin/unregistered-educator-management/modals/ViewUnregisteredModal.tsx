import React, { useState, useCallback } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import { UnregisteredEducator } from "../../../../types/admin/unregistered-educator-management";

interface ViewUnregisteredModalProps {
    onClose: () => void;
    educator: UnregisteredEducator;
}

const ViewUnregisteredModal: React.FC<ViewUnregisteredModalProps> = ({
    onClose,
    educator,
}) => {
    const [isVisible, setIsVisible] = useState(true);

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
                        className="bg-white rounded-lg w-full max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col sm:px-10 py-4"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Sticky Header */}
                        <div className="bg-white px-8 py-6 flex justify-between items-center flex-shrink-0">
                            <h2 className="text-3xl font-bold text-secondary">View Educator</h2>
                            <button
                                onClick={handleClose}
                                className="text-textColor hover:text-hover cursor-pointer"
                            >
                                <X className="h-7 w-7" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-textColor mb-2">Name</label>
                                    <div className="p-3 bg-inputBg border border-inputBorder rounded-lg text-textColor">
                                        {educator.user_name}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-textColor mb-2">School</label>
                                    <div className="p-3 bg-inputBg border border-inputBorder rounded-lg text-textColor">
                                        {educator.school_name}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-textColor mb-2">Login ID</label>
                                    <div className="p-3 bg-inputBg border border-inputBorder rounded-lg text-textColor">
                                        {educator.login_id}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ViewUnregisteredModal;