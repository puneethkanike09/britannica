import React, { useState, useCallback } from "react";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";

interface Educator {
    educator_id: string;
    name: string;
    school_name: string;
    login_id: string;
}

interface BulkUnregisterModalProps {
    onClose: () => void;
    educators: Educator[];
    onBulkUnregister: (unregisteredIds: string[]) => void;
}

const BulkUnregisterModal: React.FC<BulkUnregisterModalProps> = ({
    onClose,
    educators,
    onBulkUnregister,
}) => {
    const [isUnregistering, setIsUnregistering] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = useCallback(() => {
        if (isUnregistering) return;
        setIsVisible(false);
    }, [isUnregistering]);

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isUnregistering) return;
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleUnregister = () => {
        setIsUnregistering(true);
        setTimeout(() => {
            try {
                const unregisteredIds = educators.map((edu) => edu.educator_id);
                onBulkUnregister(unregisteredIds);
                toast.success(`Unregistered ${educators.length} educator${educators.length !== 1 ? "s" : ""} successfully!`);
                setIsUnregistering(false);
                handleClose();
            } catch (error) {
                console.error(error);
                toast.error("Failed to unregister educators");
                setIsUnregistering(false);
            }
        }, 1000);
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
                        className="bg-white rounded-lg w-full max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col sm:px-10 py-4"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Sticky Header */}
                        <div className="bg-white px-8 py-6 flex justify-between items-center flex-shrink-0">
                            <h2 className="text-3xl font-bold text-secondary">Unregister Educators</h2>
                            <button
                                onClick={handleClose}
                                className={`text-textColor hover:text-hover ${isUnregistering ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                disabled={isUnregistering}
                            >
                                <X className="h-7 w-7" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            <p className="text-textColor text-base mb-6">
                                Are you sure you want to unregister the following{" "}
                                <span className="font-bold">{educators.length}</span> educator{educators.length !== 1 ? "s" : ""}?
                            </p>

                            <div className="rounded-lg p-2 max-h-60 overflow-y-auto bg-inputBg border border-inputBorder">
                                <div className="flex flex-wrap gap-2">
                                    {educators.map((educator) => (
                                        <div
                                            key={educator.educator_id}
                                            className="px-4 py-2 bg-white border border-primary text-textColor rounded-lg text-sm font-medium whitespace-nowrap hover:bg-primary/10"
                                        >
                                            {educator.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-start gap-4 mt-12">
                                <button
                                    onClick={handleClose}
                                    className={`px-8 py-3 font-bold rounded-lg border border-primary text-textColor hover:bg-primary/10 ${isUnregistering ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                    disabled={isUnregistering}
                                >
                                    No, Cancel
                                </button>
                                <button
                                    onClick={handleUnregister}
                                    className={`bg-red text-white px-8 py-3 font-bold rounded-lg hover:bg-red/80 flex items-center gap-2 ${isUnregistering ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                    disabled={isUnregistering}
                                >
                                    {isUnregistering ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <span className="font-bold">Yes, Unregister All</span>
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

export default BulkUnregisterModal;