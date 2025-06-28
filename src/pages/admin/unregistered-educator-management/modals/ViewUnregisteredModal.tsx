import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import Loader from "../../../../components/common/Loader";

interface Educator {
    educator_id: string;
    name: string;
    school_name: string;
    login_id: string;
    email?: string;
    phone?: string;
    address_line_1?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
}

interface ViewUnregisteredModalProps {
    onClose: () => void;
    educator: Educator;
}

const ViewUnregisteredModal: React.FC<ViewUnregisteredModalProps> = ({ onClose, educator }) => {
    const [formData, setFormData] = useState({
        educator_id: educator.educator_id,
        firstName: educator.name.split(" ")[0] || "",
        lastName: educator.name.split(" ").slice(1).join(" ") || "",
        email: educator.email || educator.login_id || "",
        phone: educator.phone || "",
        loginId: educator.login_id || "",
        schoolName: educator.school_name || "",
        addressLine1: educator.address_line_1 || "",
        city: educator.city || "",
        state: educator.state || "",
        country: educator.country || "",
        pincode: educator.pincode || "",
    });
    const [isVisible, setIsVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error] = useState<string | null>(null);

    // Handle modal close
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

    // Handle ESC key press
    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
        };
        document.addEventListener("keydown", handleEscKey);
        return () => document.removeEventListener("keydown", handleEscKey);
    }, [handleClose]);

    // Simulate fetching educator details
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setFormData({
                educator_id: educator.educator_id,
                firstName: educator.name.split(" ")[0] || "",
                lastName: educator.name.split(" ").slice(1).join(" ") || "",
                email: educator.email || educator.login_id || "",
                phone: educator.phone || "",
                loginId: educator.login_id || "",
                schoolName: educator.school_name || "",
                addressLine1: educator.address_line_1 || "",
                city: educator.city || "",
                state: educator.state || "",
                country: educator.country || "",
                pincode: educator.pincode || "",
            });
            setIsLoading(false);
        }, 1000);
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
                            <h2 className="text-3xl font-bold text-secondary">Unregistered Educator Details</h2>
                            <button
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
                                <div className="border border-inputBorder rounded-lg overflow-hidden mb-6">
                                    {/* First Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3">
                                        <div className="p-6 border-b border-inputBorder md:border-b-0 md:border-r md:border-inputBorder">
                                            <div className="text-textColor text-base mb-2">First Name</div>
                                            <div className="text-primary font-medium break-all">{formData.firstName || "-"}</div>
                                        </div>
                                        <div className="p-6 border-b border-inputBorder md:border-b-0 md:border-r md:border-inputBorder">
                                            <div className="text-textColor text-base mb-2">Last Name</div>
                                            <div className="text-primary font-medium break-all">{formData.lastName || "-"}</div>
                                        </div>
                                        <div className="p-6 border-b border-inputBorder md:border-b-0">
                                            <div className="text-textColor text-base mb-2">Email Address</div>
                                            <div className="text-primary font-medium break-all">{formData.email || "-"}</div>
                                        </div>
                                    </div>
                                    {/* Second Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 md:border-t md:border-inputBorder">
                                        <div className="p-6 border-b border-inputBorder md:border-b-0 md:border-r md:border-inputBorder">
                                            <div className="text-textColor text-base mb-2">Phone Number</div>
                                            <div className="text-primary font-medium break-all">{formData.phone || "-"}</div>
                                        </div>
                                        <div className="p-6 border-b border-inputBorder md:border-b-0 md:border-r md:border-inputBorder">
                                            <div className="text-textColor text-base mb-2">Login ID</div>
                                            <div className="text-primary font-medium break-all">{formData.loginId || "-"}</div>
                                        </div>
                                        <div className="p-6 border-b border-inputBorder md:border-b-0">
                                            <div className="text-textColor text-base mb-2">School</div>
                                            <div className="text-primary font-medium break-all">{formData.schoolName || "-"}</div>
                                        </div>
                                    </div>
                                    {/* Third Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 md:border-t md:border-inputBorder">
                                        <div className="p-6 border-b border-inputBorder md:border-b-0 md:border-r md:border-inputBorder">
                                            <div className="text-textColor text-base mb-2">Address Line 1</div>
                                            <div className="text-primary font-medium break-all">{formData.addressLine1 || "-"}</div>
                                        </div>
                                        <div className="p-6 border-b border-inputBorder md:border-b-0 md:border-r md:border-inputBorder">
                                            <div className="text-textColor text-base mb-2">City</div>
                                            <div className="text-primary font-medium break-all">{formData.city || "-"}</div>
                                        </div>
                                        <div className="p-6 border-b border-inputBorder md:border-b-0">
                                            <div className="text-textColor text-base mb-2">State</div>
                                            <div className="text-primary font-medium break-all">{formData.state || "-"}</div>
                                        </div>
                                    </div>
                                    {/* Fourth Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 md:border-t md:border-inputBorder">
                                        <div className="p-6 border-b border-inputBorder md:border-b-0 md:border-r md:border-inputBorder">
                                            <div className="text-textColor text-base mb-2">Country</div>
                                            <div className="text-primary font-medium break-all">{formData.country || "-"}</div>
                                        </div>
                                        <div className="p-6 border-b border-inputBorder md:border-b-0 md:border-r md:border-inputBorder">
                                            <div className="text-textColor text-base mb-2">Pincode</div>
                                            <div className="text-primary font-medium break-all">{formData.pincode || "-"}</div>
                                        </div>
                                        <div className="p-6 border-b border-inputBorder md:border-b-0"></div>
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