import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SchoolActionModalProps } from "../../../../types/admin/school-management";
import { useState, useEffect } from "react";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import Loader from "../../../../components/common/Loader";
import { SchoolService } from "../../../../services/schoolService";

export default function ViewSchoolModal({ onClose, school }: SchoolActionModalProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [schoolDetails, setSchoolDetails] = useState<typeof school | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        SchoolService.fetchSchoolById(school.school_id).then((res) => {
            if (mounted) {
                if (res && !res.error) {
                    setSchoolDetails(res.school || null);
                } else {
                    setError(res.message || 'Failed to load school details');
                }
                setLoading(false);
            }
        }).catch(() => {
            if (mounted) {
                setError('Failed to load school details');
                setLoading(false);
            }
        });

        return () => { mounted = false; };
    }, [school.school_id]);

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
                    className="fixed inset-0 bg-black/40  backdrop-blur-xs z-90 flex items-center justify-center px-4"
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
                            <h2 className="text-3xl font-bold text-secondary">School Details</h2>
                            <button
                                onClick={handleClose}
                                className="text-textColor hover:text-hover cursor-pointer"
                            >
                                <X className="h-7 w-7" />
                            </button>
                        </div>
                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            {loading ? (
                                <Loader message="Loading School Details..." />
                            ) : error ? (
                                <div className="py-12 text-center text-red">{error}</div>
                            ) : schoolDetails ? (
                                <div className="border border-lightGray rounded-lg overflow-hidden mb-6">
                                    {/* First Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3">
                                        <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                            <div className="text-textColor mb-2">School Name</div>
                                            <div className="text-primary font-medium break-all">{schoolDetails.school_name || '-'}</div>
                                        </div>
                                        <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                            <div className="text-textColor mb-2">Email Address</div>
                                            <div className="text-primary font-medium break-all">{schoolDetails.school_email || '-'}</div>
                                        </div>
                                        <div className="p-6 border-b border-lightGray md:border-b-0">
                                            <div className="text-textColor mb-2">Phone Number</div>
                                            <div className="text-primary font-medium break-all">{schoolDetails.school_mobile_no || '-'}</div>
                                        </div>
                                    </div>
                                    {/* Second Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 md:border-t md:border-lightGray">
                                        <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                            <div className="text-textColor mb-2">Address Line 1</div>
                                            <div className="text-primary font-medium break-all">{schoolDetails.address_line1 || '-'}</div>
                                        </div>
                                        <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                            <div className="text-textColor mb-2">Address Line 2</div>
                                            <div className="text-primary font-medium break-all">{schoolDetails.address_line2 || '-'}</div>
                                        </div>
                                        <div className="p-6 border-b border-lightGray md:border-b-0">
                                            <div className="text-textColor mb-2">City</div>
                                            <div className="text-primary font-medium break-all">{schoolDetails.city || '-'}</div>
                                        </div>
                                    </div>
                                    {/* Third Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 md:border-t md:border-lightGray">
                                        <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                            <div className="text-textColor mb-2">State</div>
                                            <div className="text-primary font-medium break-all">{schoolDetails.state || '-'}</div>
                                        </div>
                                        <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                            <div className="text-textColor mb-2">Country</div>
                                            <div className="text-primary font-medium break-all">{schoolDetails.country || '-'}</div>
                                        </div>
                                        <div className="p-6 border-b border-lightGray md:border-b-0">
                                            <div className="text-textColor mb-2">Pincode</div>
                                            <div className="text-primary font-medium break-all">{schoolDetails.pincode || '-'}</div>
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