import React, { useState, useCallback } from "react";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import { UnregisteredEducator } from "../../../../types/admin/unregistered-educator-management";

interface UnregisterEducatorModalProps {
    onClose: () => void;
    educator: UnregisteredEducator;
    onConfirm: (user_id: number) => void;
    isLoading?: boolean;
}

const UnregisterEducatorModal: React.FC<UnregisterEducatorModalProps> = ({
    onClose,
    educator,
    onConfirm,
    isLoading,
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

    const handleUnregister = () => {
        if (!isLoading) {
            onConfirm(educator.user_id);
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
                            <h2 className="text-3xl font-bold text-secondary">Unregister Educator</h2>
                            <button
                                onClick={handleClose}
                                className={`text-textColor hover:text-hover ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                disabled={isLoading}
                            >
                                <X className="h-7 w-7" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            <p className="text-textColor text-base mb-6">
                                Are you sure you want to unregister <span className="font-bold">{educator.user_name}</span>?
                            </p>

                            <div className="flex justify-start gap-4">
                                <button
                                    onClick={handleClose}
                                    className={`px-8 py-3 font-bold rounded-lg border border-primary text-textColor hover:bg-primary/10 ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUnregister}
                                    className={`bg-primary text-white px-8 py-3 font-bold rounded-lg hover:bg-hover flex items-center gap-2 ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <span className="font-bold">Unregister</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UnregisterEducatorModal;