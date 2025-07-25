import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import loginImage from "../assets/loginImage.png";
import { Loader2, X, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { backdropVariants, modalVariants } from "../config/constants/Animations/modalAnimation";
import { useAuth } from "../hooks/useAuth";
import { EducatorAuthService } from "../services/educator/educatorAuthService";

const EducatorLogin = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        loginId: "",
        password: "",
    });
    const [forgotPasswordErrors, setForgotPasswordErrors] = useState({
        email: "",
    });
    const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false);
    const [isSuccessVisible, setIsSuccessVisible] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/educator/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const validateForm = () => {
        const newErrors = { loginId: "", password: "" };
        let isValid = true;
        if (!loginId.trim()) {
            newErrors.loginId = "Login ID is required";
            isValid = false;
        }
        if (!password.trim()) {
            newErrors.password = "Password is required";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const validateForgotPasswordForm = () => {
        const newErrors = { email: "" };
        let isValid = true;
        if (!forgotPasswordEmail.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordEmail)) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        }
        setForgotPasswordErrors(newErrors);
        return isValid;
    };

    // Helper for restricting email input
    const restrictEmailInput = (value: string) => {
        return value.replace(/[^a-zA-Z0-9._%+-@]/g, '').slice(0, 100).toLowerCase();
    };


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            await login(loginId, password, "/auth/teacher-login");
            toast.success("Login successful!");
            navigate("/educator/dashboard");
        } catch (error) {
            const errMsg = (error as { message?: string })?.message || "Login failed";
            toast.error(errMsg);
            console.error('Login error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPasswordSubmit = async () => {
        if (!validateForgotPasswordForm()) return;
        setIsSubmitting(true);
        
        try {
            const response = await EducatorAuthService.forgotPassword({
                email_id: forgotPasswordEmail
            });
            
            if (!response.error) {
                toast.success(response.message || "Password reset link sent successfully!");
                handleCloseForgotPassword();
                setShowSuccessModal(true);
                setIsSuccessVisible(true);
            } else {
                toast.error(response.message || "Failed to send password reset link");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to send password reset link";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseForgotPassword = () => {
        setIsForgotPasswordVisible(false);
    };

    const handleForgotPasswordAnimationComplete = () => {
        if (!isForgotPasswordVisible) {
            setShowForgotPasswordModal(false);
        }
    };

    const handleCloseSuccess = () => {
        setIsSuccessVisible(false);
    };

    const handleSuccessAnimationComplete = () => {
        if (!isSuccessVisible) {
            setShowSuccessModal(false);
            // Stay on the same page (educator login)
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isSubmitting) return;
        if (e.target === e.currentTarget) {
            if (showForgotPasswordModal) {
                handleCloseForgotPassword();
            }
            if (showSuccessModal) {
                handleCloseSuccess();
            }
        }
    };

    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (showForgotPasswordModal && !isSubmitting) {
                    handleCloseForgotPassword();
                }
                if (showSuccessModal) {
                    handleCloseSuccess();
                }
            }
        };

        if (showForgotPasswordModal || showSuccessModal) {
            document.addEventListener("keydown", handleEscKey);
            return () => document.removeEventListener("keydown", handleEscKey);
        }
    }, [showForgotPasswordModal, showSuccessModal, isSubmitting]);

    return (
        <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[5.4fr_4.6fr]">
            {/* Left side - Login Form */}
            <div className="flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-8 bg-white">
                <div className="max-w-lg w-full">
                    <h1 className="text-textColor text-4xl font-bold mb-1 text-center sm:text-left">
                        Access to 
                    </h1>
                    <h2 className="text-textColor text-4xl font-bold mb-8 text-center sm:text-left">
                         Britannica Build
                    </h2>

                    <form onSubmit={handleLogin}>
                        <div className="mb-5">
                            <label
                                htmlFor="loginId"
                                className="block text-textColor text-base mb-2"
                            >
                                Login ID<span className="text-red">*</span>
                            </label>
                            <input
                                type="text"
                                id="loginId"
                                placeholder="Enter Your Login ID"
                                value={loginId}
                                onChange={(e) => {
                                    setLoginId(e.target.value);
                                    if (errors.loginId)
                                        setErrors((prev) => ({ ...prev, loginId: "" }));
                                }}
                                className={`p-4 py-3 w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder focus:outline-none focus:border-primary ${errors.loginId ? "border-red" : "border-inputPlaceholder"} ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                                disabled={isSubmitting}
                            />
                            {errors.loginId && (
                                <p className="text-red text-sm mt-1">{errors.loginId}</p>
                            )}
                        </div>

                        <div className="mb-3 relative">
                            <label
                                htmlFor="password"
                                className="block text-textColor text-base mb-2"
                            >
                                Password<span className="text-red">*</span>
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Enter Your Password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password)
                                        setErrors((prev) => ({ ...prev, password: "" }));
                                }}
                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder focus:outline-none focus:border-primary ${errors.password ? "border-red" : "border-inputPlaceholder"} ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
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

                         <div className="text-right mb-5">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForgotPasswordModal(true);
                                    setIsForgotPasswordVisible(true);
                                }}
                                className="text-textColor hover:underline cursor-pointer"
                                disabled={isSubmitting}
                            >
                                Forgot Password?
                            </button>
                        </div>


                        <div className="flex justify-start mt-10 w-full">
                            <button
                                type="submit"
                                className="bg-primary hover:bg-hover text-white px-6 py-3 rounded-lg font-bold cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <>
                                        <LogIn className="font-black" size={18} />
                                        <span className="font-bold">Educator Login</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="text-left mt-5">
                            Don't have an account? Please{' '}
                            <Link to="/educator-register" className="text-primary hover:underline cursor-pointer font-bold">
                                Register here
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right side - Image (hidden below lg) */}
            <div
                className="hidden lg:block bg-cover bg-center"
                style={{ backgroundImage: `url(${loginImage})` }}
            />

            {/* Forgot Password Modal */}
            <AnimatePresence onExitComplete={handleForgotPasswordAnimationComplete}>
                {showForgotPasswordModal && isForgotPasswordVisible && (
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
                            <div className="bg-white px-8 py-6 flex justify-between items-center flex-shrink-0">
                                <h2 className="text-3xl font-bold text-textColor">
                                    Forgot Password
                                </h2>
                                <button
                                    onClick={handleCloseForgotPassword}
                                    className={`text-textColor hover:text-hover ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                                        }`}
                                    disabled={isSubmitting}
                                >
                                    <X className="h-7 w-7" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-8 py-6">
                                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                    <div>
                                        <label className="block text-textColor mb-2">
                                            Email address<span className="text-red">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={forgotPasswordEmail}
                                            onChange={(e) => {
                                                const newValue = restrictEmailInput(e.target.value);
                                                setForgotPasswordEmail(newValue);
                                                if (forgotPasswordErrors.email)
                                                    setForgotPasswordErrors((prev) => ({ ...prev, email: "" }));
                                            }}
                                            className={`w-full p-3 border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder focus:outline-none focus:border-primary ${forgotPasswordErrors.email ? "border-red" : "border-inputPlaceholder"} ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                                            placeholder="Enter your registered email"
                                            disabled={isSubmitting}
                                        />
                                        {forgotPasswordErrors.email && (
                                            <p className="text-red text-sm mt-1">
                                                {forgotPasswordErrors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-8">
                                        <button
                                            type="button"
                                            onClick={handleForgotPasswordSubmit}
                                            className={`bg-primary text-white px-8 py-3 font-bold rounded-lg hover:bg-hover flex items-center gap-2 ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                                                }`}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="animate-spin" />
                                            ) : (
                                                'Submit'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                                    A password reset link sent to your registered email address.
                                    Please check your inbox to proceed
                                </p>
                                <button
                                    type="button"
                                    onClick={handleCloseSuccess}
                                    className="bg-primary hover:bg-hover text-white px-8 py-3 font-bold rounded-lg cursor-pointer"
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

export default EducatorLogin;