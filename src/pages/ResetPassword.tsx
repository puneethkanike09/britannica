import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { backdropVariants, modalVariants } from "../config/constants/Animations/modalAnimation";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSuccessVisible, setIsSuccessVisible] = useState(false);
    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: "",
    });

    const validateForm = () => {
        const newErrors = { password: "", confirmPassword: "" };
        let isValid = true;

        if (!password.trim()) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
            isValid = false;
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Confirm password is required";
            isValid = false;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        toast.promise(
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("Password reset successful!");
                    setShowSuccessModal(true);
                    setIsSuccessVisible(true);
                }, 2000);
            }),
            {
                loading: "Resetting password...",
                success: () => {
                    setIsSubmitting(false);
                    return "Password reset successful!";
                },
                error: (err) => {
                    setIsSubmitting(false);
                    return `Error: ${err.message}`;
                },
            }
        );
    };

    // Handle opening/closing success modal
    const handleCloseSuccess = () => {
        setIsSuccessVisible(false);
        // After animation completes, handleSuccessAnimationComplete will be called
        // which will set showSuccessModal to false and then navigate to login
    };

    const handleSuccessAnimationComplete = () => {
        if (!isSuccessVisible) {
            setShowSuccessModal(false);
            // Redirect to login page after modal is closed
            navigate("/");
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isSubmitting) return;
        if (e.target === e.currentTarget && showSuccessModal) {
            handleCloseSuccess();
        }
    };

    // Handle ESC key for modals
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
            {/* Reset Password Form */}
            <div className="flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-8 bg-white">
                <div className="max-w-lg w-full">
                    <h1 className="text-textColor text-4xl font-bold mb-8 text-center sm:text-left">
                        Reset Your Password
                    </h1>


                    <form onSubmit={handleResetPassword}>
                        <div className="mb-5 relative">
                            <label
                                htmlFor="password"
                                className="block text-textColor text-base mb-2"
                            >
                                New Password<span className="text-red">*</span>
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Enter New Password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password)
                                        setErrors((prev) => ({ ...prev, password: "" }));
                                }}
                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.password ? "border-red" : "border-inputPlaceholder"
                                    } ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-11 text-primary text-base hover:underline cursor-pointer"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                            {errors.password && (
                                <p className="text-red text-sm mt-1">{errors.password}</p>
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
                                Reset Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Success Modal */}
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
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex-1 px-8 py-6 text-center">
                                <p className="text-textColor text-lg mb-8">
                                    Your password has been reset successfully.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleCloseSuccess}
                                    className="bg-primary hover:bg-hover text-white px-8 py-3 font-bold rounded-lg font-medium cursor-pointer"
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

export default ResetPassword;