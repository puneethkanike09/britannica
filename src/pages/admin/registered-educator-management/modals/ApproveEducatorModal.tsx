import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";

interface ApproveEducatorModalProps {
    onClose: () => void;
    educator: { educator_id: string; name: string };
    onEducatorApproved: (educator_id: string) => void;
}

export default function ApproveEducatorModal({ onClose, educator, onEducatorApproved }: ApproveEducatorModalProps) {
    const [isApproving, setIsApproving] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        if (isApproving) return;
        setIsVisible(false);
    };

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isApproving) return;
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleApprove = () => {
        setIsApproving(true);
        setTimeout(() => {
            try {
                onEducatorApproved(educator.educator_id);
                toast.success(`${educator.name} has been approved successfully!`);
                setIsApproving(false);
                handleClose();
            } catch (error) {
                console.error(error);
                toast.error("Failed to approve educator");
                setIsApproving(false);
            }
        }, 1000); // Simulate async operation
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
                            <h2 className="text-3xl font-bold text-textColor">Approve Educator</h2>
                            <button
                                onClick={handleClose}
                                className={`text-textColor hover:text-hover ${isApproving ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                disabled={isApproving}
                            >
                                <X className="h-7 w-7" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-8 py-6">
                            <p className="text-textColor mb-6">
                                Are you sure you want to approve <span className="font-bold">{educator.name}</span>?
                            </p>

                            <div className="flex justify-start gap-4">
                                <button
                                    onClick={handleClose}
                                    className={`px-8 py-3 font-bold rounded-lg border border-primary text-textColor hover:bg-gray/10 ${isApproving ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                    disabled={isApproving}
                                >
                                    No, Cancel
                                </button>
                                <button
                                    onClick={handleApprove}
                                    className={`px-8 py-3 font-bold rounded-lg bg-primary text-white hover:bg-hover flex items-center justify-center gap-2 ${isApproving ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                    disabled={isApproving}
                                >
                                    {isApproving ? <Loader2 className="animate-spin" /> : "Yes, Approve"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}