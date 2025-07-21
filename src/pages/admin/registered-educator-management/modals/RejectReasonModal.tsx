import { X, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import { RegisteredEducator } from "../../../../types/admin/registered-educator-management";

interface RejectReasonModalProps {
    onClose: () => void;
    educator: RegisteredEducator;
    onConfirm: (remarks: string) => void;
    isLoading?: boolean;
}

export default function RejectReasonModal({ onClose, educator, onConfirm, isLoading }: RejectReasonModalProps) {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = useCallback(() => {
        if (isLoading) return;
        setIsVisible(false);
    }, [isLoading]);

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isLoading) return;
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value.slice(0, 200); // Only limit length, no character filtering
        setReason(value);
        if (error) {
            setError("");
        }
    };

    const validateForm = () => {
        if (reason.length > 200) {
            setError("Reason must be 200 characters or less");
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onConfirm(reason.trim());
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
                        className="bg-white rounded-lg w-full max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col sm:px-10 py-4"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Sticky Header */}
                        <div className="bg-white px-8 py-6 flex justify-between items-center flex-shrink-0">
                            <h2 className="text-3xl font-bold text-secondary">Reject Educator</h2>
                            <button
                                onClick={handleClose}
                                className={`text-textColor hover:text-hover ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                disabled={isLoading}
                            >
                                <X className="h-7 w-7" />
                            </button>
                        </div>

                        {/* Scrollable Form Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            <p className="text-textColor mb-6">
                                Are you sure you want to reject the registration of <span className="font-bold">{educator.user_name}</span>?
                            </p>
                            <div className="space-y-6">
                                <div className="mb-3 relative">
                                    <label className="block text-textColor text-base mb-2">
                                        Reason for Rejection (Optional)
                                    </label>
                                    <textarea
                                        name="reason"
                                        value={reason}
                                        onChange={handleInputChange}
                                        placeholder="Provide a reason for rejecting the educator's registration"
                                        maxLength={200}
                                        rows={4}
                                        className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${error ? "border-red" : "border-inputPlaceholder"} ${isLoading ? "cursor-not-allowed opacity-50" : ""} focus:outline-none focus:border-primary`}
                                        disabled={isLoading}
                                    />
                                    {error && <p className="text-red text-sm mt-1">{error}</p>}
                                </div>

                                <div className="mt-12 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className={`px-8 py-3 font-bold rounded-lg border border-primary text-textColor hover:bg-primary/10 ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className={`bg-red text-white px-8 py-3 font-bold rounded-lg  hover:bg-red/80 flex items-center gap-2 ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            <span className="font-bold">Submit</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}