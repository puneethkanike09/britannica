import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import loginImage from "../assets/loginImage.png";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { backdropVariants, modalVariants } from "../config/constants/Animations/modalAnimation";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [forgotPasswordErrors, setForgotPasswordErrors] = useState({
    email: "",
  });

  // Animation state for modals
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
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

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email && password) {
            resolve("Login successful!");
            navigate("/admin");
          } else {
            reject(new Error("Please enter email and password"));
          }
        }, 2000);
      }),
      {
        loading: "Logging in...",
        success: () => {
          setIsSubmitting(false);
          return "Login successful!";
        },
        error: (err) => {
          setIsSubmitting(false);
          return `Error: ${err.message}`;
        },
      }
    );
  };

  const handleEducatorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email && password) {
            resolve("Login successful!");
            navigate("/educator");
          } else {
            reject(new Error("Please enter email and password"));
          }
        }, 2000);
      }),
      {
        loading: "Logging in...",
        success: () => {
          setIsSubmitting(false);
          return "Login successful!";
        },
        error: (err) => {
          setIsSubmitting(false);
          return `Error: ${err.message}`;
        },
      }
    );
  };

  const handleForgotPasswordSubmit = () => {
    if (!validateForgotPasswordForm()) return;
    setIsSubmitting(true);
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (forgotPasswordEmail) {
            resolve("Password reset email sent!");
            handleCloseForgotPassword();
            setShowSuccessModal(true);
            setIsSuccessVisible(true);
          } else {
            reject(new Error("Failed to send password reset email"));
          }
        }, 2000);
      }),
      {
        loading: "Sending reset link...",
        success: () => {
          setIsSubmitting(false);
          return "Password reset link sent successfully!";
        },
        error: (err) => {
          setIsSubmitting(false);
          return `Error: ${err.message}`;
        },
      }
    );
  };

  // Handle opening/closing forgot password modal
  const handleOpenForgotPassword = () => {
    setShowForgotPasswordModal(true);
    setIsForgotPasswordVisible(true);
  };

  const handleCloseForgotPassword = () => {
    setIsForgotPasswordVisible(false);
  };

  const handleForgotPasswordAnimationComplete = () => {
    if (!isForgotPasswordVisible) {
      setShowForgotPasswordModal(false);
    }
  };

  // Handle opening/closing success modal
  const handleCloseSuccess = () => {
    setIsSuccessVisible(false);
  };

  const handleSuccessAnimationComplete = () => {
    if (!isSuccessVisible) {
      setShowSuccessModal(false);
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

  // Handle ESC key for modals
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showForgotPasswordModal && !isSubmitting) {
          handleCloseForgotPassword();
        }
        if (showSuccessModal) {
          handleCloseSuccess();
        }
      }
    };

    if (showForgotPasswordModal || showSuccessModal) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [showForgotPasswordModal, showSuccessModal, isSubmitting]);

  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[5.4fr_4.6fr]">
      {/* Left side - Login Form */}
      <div className="flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-8 bg-white">
        <div className="max-w-lg w-full">
          <h1 className="text-textColor text-4xl font-bold mb-1 text-center sm:text-left">
            Access to Britannica
          </h1>
          <h2 className="text-textColor text-4xl font-bold mb-8 text-center sm:text-left">
            Education Sites
          </h2>

          <form>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-textColor text-base mb-2"
              >
                Email<span className="text-red">*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: "" }));
                }}
                className={`p-4 py-3 w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.email ? "border-red" : "border-inputPlaceholder"
                  } ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red text-sm mt-1">{errors.email}</p>
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

            <div className="text-right mb-5">
              <button
                type="button"
                onClick={handleOpenForgotPassword}
                className="text-textColor hover:underline cursor-pointer"
                disabled={isSubmitting}
              >
                Forgot Password?
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center sm:justify-start w-full">
              <button
                type="button"
                onClick={handleAdminLogin}
                className="bg-primary hover:bg-hover text-white px-6 py-3 rounded-lg font-bold cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                Admin Login
              </button>
              <button
                type="button"
                onClick={handleEducatorLogin}
                className="bg-primary hover:bg-hover text-white px-6 py-3 rounded-lg font-bold cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                Educator Login
              </button>
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
            className="fixed inset-0 bg-black/40  backdrop-blur-xs z-90 flex items-center justify-center px-4"
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
                        setForgotPasswordEmail(e.target.value);
                        if (forgotPasswordErrors.email)
                          setForgotPasswordErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      className={`w-full p-3 border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${forgotPasswordErrors.email ? "border-red" : "border-inputPlaceholder"
                        } ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
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
                      className={`bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-hover ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                        }`}
                      disabled={isSubmitting}
                    >
                      Submit
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
            className="fixed inset-0 bg-black/40  backdrop-blur-xs z-90 flex items-center justify-center px-4"
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

export default Login;