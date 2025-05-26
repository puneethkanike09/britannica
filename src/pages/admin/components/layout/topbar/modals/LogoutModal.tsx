import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoutModalProps {
    onClose: () => void;
}

export default function LogoutModal({ onClose }: LogoutModalProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isLoggingOut) return;
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleLogout = () => {
        setIsLoggingOut(true);
        toast.promise(
            new Promise((resolve) => {
                setTimeout(() => {
                    // Simulate a successful logout API call
                    resolve('Logged out successfully!');
                }, 2000); // Simulate 2-second API call
            }),
            {
                loading: 'Logging out...',
                success: () => {
                    setIsLoggingOut(false);
                    onClose();
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
        <div
            className="fixed inset-0 bg-black/40 bg-opacity-50 z-90 flex items-center justify-center px-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg w-full max-w-[500px] overflow-hidden flex flex-col sm:px-10 py-4">
                {/* Sticky Header */}
                <div className="bg-white px-8 py-6 flex justify-between items-center border-b border-gray-100 flex-shrink-0">
                    <h2 className="text-3xl font-bold text-textColor">Logout</h2>
                    <button
                        onClick={onClose}
                        className={`text-textColor hover:text-textColor/90 ${isLoggingOut ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        disabled={isLoggingOut}
                    >
                        <X className="h-7 w-7" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-8 py-6">
                    <p className="text-gray-700 mb-6">
                        Are you sure you want to logout?
                    </p>

                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className={`px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 ${isLoggingOut ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            disabled={isLoggingOut}
                        >
                            No, Cancel
                        </button>
                        <button
                            onClick={handleLogout}
                            className={`px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/80 ${isLoggingOut ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            disabled={isLoggingOut}
                        >
                            Yes, Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}