import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import { UserAccessTypeService } from "../../../../services/admin/userAccessTypeService";
import { UserAccessTypeActionModalProps } from "../../../../types/admin/user-access-type-management";
import Loader from "../../../../components/common/Loader";

export default function ViewUserAccessTypeModal({ onClose, userAccessType }: UserAccessTypeActionModalProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [userAccessTypeDetails, setUserAccessTypeDetails] = useState<typeof userAccessType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        UserAccessTypeService.fetchUserAccessTypeById(userAccessType.user_access_type_id).then((res) => {
            if (mounted) {
                if ((res.error === false || res.error === "false") && res.user_access_type) {
                    setUserAccessTypeDetails(res.user_access_type || null);
                } else {
                    setError(res.message || 'Failed to load user access type details');
                }
                setLoading(false);
            }
        }).catch(() => {
            if (mounted) {
                setError('Failed to load user access type details');
                setLoading(false);
            }
        });
        return () => { mounted = false; };
    }, [userAccessType.user_access_type_id]);

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, []);

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
                            <h2 className="text-3xl font-bold text-secondary">User Access Type Details</h2>
                            <button
                                aria-label="Close"
                                onClick={handleClose}
                                className="text-textColor hover:text-hover cursor-pointer"
                            >
                                <X className="h-7 w-7" />
                            </button>
                        </div>
                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            {loading ? (
                                <Loader message="Loading User Access Type Details..." />
                            ) : error ? (
                                <div className="py-12 text-center text-red">{error}</div>
                            ) : userAccessTypeDetails ? (
                                <div className="border border-lightGray rounded-lg overflow-hidden mb-6">
                                    {/* First Row */}
                                    <div className="grid grid-cols-1">
                                        <div className="p-6 border-b border-lightGray">
                                            <div className="text-textColor mb-2">User Access Type Name</div>
                                            <div className="text-primary font-medium break-all">{userAccessTypeDetails.user_access_type_name || '-'}</div>
                                        </div>
                                    </div>
                                    {/* Second Row */}
                                    <div className="grid grid-cols-1">
                                        <div className="p-6">
                                            <div className="text-textColor mb-2">Description</div>
                                            <div className="text-primary font-medium break-all">{userAccessTypeDetails.description || '-'}</div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}