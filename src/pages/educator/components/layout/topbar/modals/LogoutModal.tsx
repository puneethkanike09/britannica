import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../../../config/constants/Animations/modalAnimation";
import { useAuthStore } from "../../../../../../store/authStore";
import { LogoutModalProps } from "../../../../../../types/global";

export default function LogoutModal({ onClose }: LogoutModalProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const handleClose = () => {
        if (isLoggingOut) return;
        setIsVisible(false);
    };

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isLoggingOut) return;
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isLoggingOut) {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [isLoggingOut]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const response = await logout();
            toast.success(response.message || 'Logged out successfully!');
            handleClose();
            navigate('/educator-login', { replace: true });
        } catch (error) {
            const errMsg = (error as { message?: string })?.message || 'Logout failed';
            toast.error(errMsg);
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <AnimatePresence onExitComplete={handleAnimationComplete}>
            {isVisible && (
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
                        className="bg-white rounded-lg w-full max-w-[500px] overflow-hidden flex flex-col sm:px-10 py-4"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Sticky Header */}
                        <div className="bg-white px-8 py-6 flex justify-between items-center flex-shrink-0">
                            <h2 className="text-3xl font-bold text-textColor">Logout</h2>
                            <button
                                onClick={handleClose}
                                className={`text-textColor hover:text-hover ${isLoggingOut ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                disabled={isLoggingOut}
                                aria-label="close"
                            >
                                <X className="h-7 w-7" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            <p className="text-textColor mb-6">
                                Are you sure you want to logout?
                            </p>

                            <div className="flex justify-start gap-4">
                                <button
                                    onClick={handleClose}
                                    className={`px-8 py-3 font-bold rounded-lg border border-primary text-textColor hover:bg-primary/10 ${isLoggingOut ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                    disabled={isLoggingOut}
                                >
                                    No, Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className={`px-8 py-3 font-bold rounded-lg bg-red text-white hover:bg-red/80 flex items-center justify-center gap-2 ${isLoggingOut ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                    disabled={isLoggingOut}
                                >
                                    {isLoggingOut ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        'Yes, Logout'
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}