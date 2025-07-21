import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import { UnregisteredEducator } from "../../../../types/admin/unregistered-educator-management";
import { UnregisteredEducatorService } from "../../../../services/admin/unregisteredEducatorService";
import Loader from "../../../../components/common/Loader";

interface ViewUnregisteredModalProps {
    onClose: () => void;
    educator: UnregisteredEducator;
}

const ViewUnregisteredModal: React.FC<ViewUnregisteredModalProps> = ({
    onClose,
    educator,
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [formData, setFormData] = useState({
        user_id: educator.user_id,
        firstName: educator.user_name.split(' ')[0] || '',
        lastName: educator.user_name.split(' ').slice(1).join(' ') || '',
        email: '',
        phone: '',
        loginId: educator.login_id || '',
        schoolName: educator.school_name || '',
        reason: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClose = useCallback(() => {
        setIsVisible(false);
    }, []);

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
        setIsLoading(true);
        setError(null);
        UnregisteredEducatorService.fetchUnregisteredEducatorCompleteDetails(educator.user_id)
            .then((res) => {
                if (res.error === false || res.error === "false") {
                    setFormData({
                        user_id: Number(res.teacher?.teacher_id ?? educator.user_id),
                        firstName: res.teacher?.first_name ?? '',
                        lastName: res.teacher?.last_name ?? '',
                        email: res.teacher?.email_id ?? '',
                        phone: res.teacher?.mobile_no ?? '',
                        loginId: res.teacher?.login_id ?? '',
                        schoolName: res.teacher?.school_name ?? '',
                        reason: (res.teacher && 'reason' in res.teacher ? (res.teacher as any).reason : '') ?? '',
                    });
                } else {
                    setError(res.message || 'Failed to fetch educator details');
                }
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.message || 'Failed to fetch educator details');
                setIsLoading(false);
            });
    }, [educator]);

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
                        className="bg-white rounded-lg w-full max-w-[835px] max-h-[90vh] overflow-hidden flex flex-col sm:px-10 py-4"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Sticky Header */}
                        <div className="bg-white px-8 py-6 flex justify-between items-center flex-shrink-0">
                            <h2 className="text-3xl font-bold text-secondary">Educator Details</h2>
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
                            {isLoading ? (
                                <Loader message="Loading Educator Details..." />
                            ) : error ? (
                                <div className="py-12 text-center text-red">{error}</div>
                            ) : (
                                <div className="border border-lightGray rounded-lg overflow-hidden mb-6">
                                    {/* First Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3">
                                        <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                            <div className="text-textColor mb-2">First Name</div>
                                            <div className="text-primary font-medium break-all">{formData.firstName || '-'}</div>
                                        </div>
                                        <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                            <div className="text-textColor mb-2">Last Name</div>
                                            <div className="text-primary font-medium break-all">{formData.lastName || '-'}</div>
                                        </div>
                                        <div className="p-6 border-b border-lightGray md:border-b-0">
                                            <div className="text-textColor mb-2">Login ID</div>
                                            <div className="text-primary font-medium break-all">{formData.loginId || '-'}</div>
                                        </div>
                                    </div>
                                    {/* Second Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 md:border-t md:border-lightGray">
                                        <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                            <div className="text-textColor mb-2">School</div>
                                            <div className="text-primary font-medium break-words">{formData.schoolName || '-'}</div>
                                        </div>
                                        {formData.reason !== undefined && (
                                            <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                                <div className="text-textColor mb-2">Reason</div>
                                                <div className="text-primary font-medium break-words">{formData.reason || '-'}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ViewUnregisteredModal;