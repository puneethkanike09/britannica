import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { apiClient } from "../utils/apiClient";
import { backdropVariants, modalVariants } from "../config/constants/Animations/modalAnimation";

const CreatePassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSuccessVisible, setIsSuccessVisible] = useState(false);
    const [errors, setErrors] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    // Extract token from URL
    const searchParams = new URLSearchParams(location.search);
    const urlToken = searchParams.get("token") || "";

    const validateForm = () => {
        const newErrors = { newPassword: "", confirmPassword: "" };
        let isValid = true;

        if (!newPassword.trim()) {
            newErrors.newPassword = "New Password is required";
            isValid = false;
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "New Password must be at least 8 characters";
            isValid = false;
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Confirm Password is required";
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleCreatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (!urlToken) {
            toast.error("Invalid or missing token.");
            return;
        }
        setIsSubmitting(true);
        toast.promise(
            apiClient.postWithCustomToken<{ error: string | boolean; message: string }>(
                "/auth/password",
                {
                    password: newPassword,
                    confirm_password: confirmPassword,
                },
                urlToken
            ).then((res) => {
                if (res.success) {
                    setShowSuccessModal(true);
                    setIsSuccessVisible(true);
                } else {
                    throw new Error(res.message || "Failed to create password");
                }
            }),
            {
                loading: "Creating password...",
                success: () => {
                    setIsSubmitting(false);
                    return "Password created successfully!";
                },
                error: (err: unknown) => {
                    setIsSubmitting(false);
                    if (err instanceof Error) {
                        return `Error: ${err.message}`;
                    }
                    return "Error: Failed to create password";
                },
            }
        );
    };

    const handleCloseSuccess = () => {
        setIsSuccessVisible(false);
    };

    const handleSuccessAnimationComplete = () => {
        if (!isSuccessVisible) {
            setShowSuccessModal(false);
            navigate("/");
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isSubmitting) return;
        if (e.target === e.currentTarget && showSuccessModal) {
            handleCloseSuccess();
        }
    };

    useState(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showSuccessModal) {
                handleCloseSuccess();
            }
        };

        if (showSuccessModal) {
            document.addEventListener('keydown', handleEscKey);
            return () => document.removeEventListener('keydown', handleEscKey);
        }
    });

    return (
        <div className="grid min-h-screen w-full grid-cols-1">
            <div className="flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-8 bg-white">
                <div className="max-w-lg w-full">
                    <h1 className="text-textColor text-4xl font-bold mb-8 text-center sm:text-left">
                        Create New Password
                    </h1>

                    <form onSubmit={handleCreatePassword}>
                        <div className="mb-5 relative">
                            <label
                                htmlFor="newPassword"
                                className="block text-textColor text-base mb-2"
                            >
                                New Password<span className="text-red">*</span>
                            </label>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                placeholder="Enter New Password"
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    if (errors.newPassword)
                                        setErrors((prev) => ({ ...prev, newPassword: "" }));
                                }}
                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.newPassword ? "border-red" : "border-inputPlaceholder"
                                    } ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-11 text-primary text-base hover:underline cursor-pointer"
                            >
                                {showNewPassword ? "Hide" : "Show"}
                            </button>
                            {errors.newPassword && (
                                <p className="text-red text-sm mt-1">{errors.newPassword}</p>
                            )}
                        </div>

                        <div className="mb-5 relative">
                            <label
                                htmlFor="confirmPassword"
                                className="block text-textColor text-base mb-2"
                            >
                                Confirm Password<span className="text-red">*</span>
                            </label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (errors.confirmPassword)
                                        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                                }}
                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.confirmPassword ? "border-red" : "border-inputPlaceholder"
                                    } ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-11 text-primary text-base hover:underline cursor-pointer"
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                            {errors.confirmPassword && (
                                <p className="text-red text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center sm:justify-start w-full">
                            <button
                                type="submit"
                                className="bg-primary hover:bg-hover text-white px-6 py-3 rounded-lg font-bold cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                Create Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <AnimatePresence onExitComplete={handleSuccessAnimationComplete}>
                {showSuccessModal && isSuccessVisible && (
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
                            className="bg-white rounded-lg w-full max-w-[500px] overflow-hidden flex flex-col sm:px-10 py-8"
                            variants={modalVariants}
                            initial="exit"
                            animate="visible"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex-1 px-4 sm:px-8 py-6 text-center">
                                <p className="text-textColor text-lg mb-8">
                                    Your password has been created successfully.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleCloseSuccess}
                                    className="bg-primary hover:bg-hover text-white px-8 py-3 rounded-lg font-medium cursor-pointer"
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CreatePassword;