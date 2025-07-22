import { X, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../../../config/constants/Animations/modalAnimation";
import { EducatorRegistrationService } from "../../../../../../services/educator/educatorRegistrationService";
import { EducatorAuthService } from "../../../../../../services/educator/educatorAuthService";


interface UnregisterReasonModalProps {
    onClose: () => void;
    onUnregister: (reason: string) => void;
}

export default function UnregisterReasonModal({ onClose, onUnregister }: UnregisterReasonModalProps) {
    const navigate = useNavigate();
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = useCallback(() => {
        if (isSubmitting) return;
        setIsVisible(false);
    }, [isSubmitting]);

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isSubmitting) return;
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value.slice(0, 200);
        setReason(value);
        if (error) {
            setError("");
        }
    };

    const validateForm = () => {
        if (!reason.trim()) {
            setError("Reason for unregistration is required");
            return false;
        }
        if (reason.length < 10) {
            setError("Reason must be at least 10 characters long");
            return false;
        }
        if (reason.length > 200) {
            setError("Reason must be 200 characters or less");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                const response = await EducatorRegistrationService.unregisterEducator(reason.trim());
                if (response.error === false || response.error === "false") {
                    toast.success(response.message || "Unregistration request submitted successfully!");
                    // Call logout after successful unregistration
                    const logoutResponse = await EducatorAuthService.logout();
                    if (logoutResponse.error === false || logoutResponse.error === "false") {
                        toast.success(logoutResponse.message || "Logout successful");
                        onUnregister(reason.trim());
                        // Redirect to educator login page using React Router
                        navigate('/educator-login');
                    } else {
                        toast.error(logoutResponse.message || "Logout failed");
                    }
                } else {
                    toast.error(response.message || "Failed to submit unregistration request");
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to submit unregistration request");
            } finally {
                setIsSubmitting(false);
            }
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
                            <h2 className="text-3xl font-bold text-secondary">Unregister Account</h2>
                            <button
                                onClick={handleClose}
                                className={`text-textColor hover:text-hover ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                disabled={isSubmitting}
                                aria-label="close"
                            >
                                <X className="h-7 w-7" />
                            </button>
                        </div>

                        {/* Scrollable Form Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            <div className="space-y-6">
                                <div className="mb-3 relative">
                                    <label className="block text-textColor text-base mb-2">
                                        Reason for Unregistration<span className="text-red">*</span>
                                    </label>
                                    <textarea
                                        name="reason"
                                        value={reason}
                                        onChange={handleInputChange}
                                        placeholder="Please provide the reason for unregistering your account"
                                        maxLength={200}
                                        rows={4}
                                        className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${error ? "border-red" : "border-inputPlaceholder"} ${isSubmitting ? "cursor-not-allowed opacity-50" : ""} focus:outline-none focus:border-primary`}
                                        disabled={isSubmitting}
                                    />
                                    {error && <p className="text-red text-sm mt-1">{error}</p>}
                                </div>

                                <div className="mt-12">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className={`bg-primary text-white px-8 py-3 font-bold rounded-lg hover:bg-hover flex items-center gap-2 ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
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