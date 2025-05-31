import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../../../config/constants/Animations/modalAnimation";

interface LogoutModalProps {
    onClose: () => void;
}

export default function LogoutModal({ onClose }: LogoutModalProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const navigate = useNavigate();

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

    const handleLogout = () => {
        setIsLoggingOut(true);
        toast.promise(
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve('Logged out successfully!');
                }, 2000);
            }),
            {
                loading: 'Logging out...',
                success: () => {
                    setIsLoggingOut(false);
                    handleClose();
                    navigate('/');
                    return 'Logged out successfully!';
                },
                error: (err) => {
                    setIsLoggingOut(false);
                    return `Error: ${err.message}`;
                }
            }
        );
    };

    return (
        <AnimatePresence onExitComplete={handleAnimationComplete}>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 bg-black/40 bg-opacity-50 backdrop-blur-sm z-90 flex items-center justify-center px-4"
                    onClick={handleBackdropClick}
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeOut" }}
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
                            <h2 className="text-3xl font-bold text-secondary">Logout</h2>
                            <button
                                onClick={handleClose}
                                className={`text-textColor hover:text-hover ${isLoggingOut ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                disabled={isLoggingOut}
                            >
                                <X className="h-7 w-7" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-8 py-6">
                            <p className="text-textColor mb-6">
                                Are you sure you want to logout?
                            </p>

                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={handleClose}
                                    className={`px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 ${isLoggingOut ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                    disabled={isLoggingOut}
                                >
                                    No, Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className={`px-6 py-2 rounded-lg bg-red text-white hover:bg-red/80 ${isLoggingOut ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                    disabled={isLoggingOut}
                                >
                                    Yes, Logout
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}