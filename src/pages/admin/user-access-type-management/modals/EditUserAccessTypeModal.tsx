import React, { useState, useCallback, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import { UserAccessTypeService } from "../../../../services/admin/userAccessTypeService";
import { UserAccessTypeActionModalProps } from "../../../../types/admin/user-access-type-management";
import toast from "react-hot-toast";

const EditUserAccessTypeModal: React.FC<UserAccessTypeActionModalProps> = ({ onClose, userAccessType, onUserAccessTypeUpdated }) => {
    const [formData, setFormData] = useState({
        user_access_type_id: userAccessType.user_access_type_id,
        user_access_type_name: userAccessType.user_access_type_name,
        description: userAccessType.description || '',
    });
    const [errors, setErrors] = useState({
        user_access_type_name: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleClose = useCallback(() => {
        if (isSubmitting) return;
        setIsVisible(false);
    }, [isSubmitting]);

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isSubmitting) return;
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        UserAccessTypeService.fetchUserAccessTypeById(userAccessType.user_access_type_id).then((res) => {
            if (!mounted) return;
            if ((res.error === false || res.error === "false") && res.user_access_type) {
                setFormData({
                    user_access_type_id: res.user_access_type.user_access_type_id,
                    user_access_type_name: res.user_access_type.user_access_type_name,
                    description: res.user_access_type.description || '',
                });
                setError(null);
            } else {
                setError(res.message || 'Failed to load user access type details');
            }
            setLoading(false);
        }).catch((err) => {
            if (!mounted) return;
            setError(err.message || 'Failed to load user access type details');
            setLoading(false);
        });
        return () => { mounted = false; };
    }, [userAccessType.user_access_type_id]);

    // Helper for restricting input
    const restrictInput = (name: string, value: string) => {
        switch (name) {
            case 'user_access_type_name':
                // Only allow letters, numbers, spaces, max 50
                return value.replace(/[^a-zA-Z0-9\s]/g, '').slice(0, 50);
            case 'description':
                // Allow letters, numbers, spaces, comma, dot, hyphen, max 200
                return value.replace(/[^a-zA-Z0-9\s,.-]/g, '').slice(0, 200);
            default:
                return value;
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newValue = restrictInput(name, value);
        setFormData(prev => ({ ...prev, [name]: newValue }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            user_access_type_name: '',
            description: ''
        };
        let isValid = true;

        // user_access_type_name: mandatory, min 2, max 50
        if (!formData.user_access_type_name.trim()) {
            newErrors.user_access_type_name = 'User access type name is required';
            isValid = false;
        } else if (formData.user_access_type_name.length < 2 || formData.user_access_type_name.length > 50) {
            newErrors.user_access_type_name = 'User access type name must be 2-50 characters';
            isValid = false;
        }

        // Description: optional, but validate if provided
        if (formData.description.trim() && formData.description.length > 200) {
            newErrors.description = 'Description must be 200 characters or less';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                const response = await UserAccessTypeService.updateUserAccessType({
                    user_access_type_id: formData.user_access_type_id,
                    user_access_type_name: formData.user_access_type_name.trim(),
                    description: formData.description.trim(),
                });
                if (response.error === false || response.error === "false") {
                    toast.success(response.message || 'User access type updated successfully');
                    if (onUserAccessTypeUpdated) {
                        onUserAccessTypeUpdated();
                    }
                    handleClose();
                } else {
                    toast.error(response.message || 'Failed to update user access type');
                }
            } catch (error) {
                const errMsg = (error as { message?: string })?.message || 'Failed to update user access type';
                toast.error(errMsg);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

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
                            <h2 className="text-3xl font-bold text-secondary">Edit User Access Type</h2>
                            <button
                                aria-label="Close"
                                onClick={handleClose}
                                className={`text-textColor hover:text-hover ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                disabled={isSubmitting}
                            >
                                <X className="h-7 w-7" />
                            </button>
                        </div>

                        {/* Scrollable Form Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            {loading ? (
                                <Loader2 className="animate-spin mx-auto" />
                            ) : error ? (
                                <div className="py-12 text-center text-red">{error}</div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            User Access Type Name<span className="text-red">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="user_access_type_name"
                                            value={formData.user_access_type_name}
                                            onChange={handleInputChange}
                                            placeholder="Enter User Access Type name"
                                            maxLength={50}
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.user_access_type_name ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
                                            disabled={isSubmitting}
                                        />
                                        {errors.user_access_type_name && <p className="text-red text-sm mt-1">{errors.user_access_type_name}</p>}
                                    </div>

                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Enter User Access Type Description"
                                            maxLength={200}
                                            rows={4}
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.description ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
                                            disabled={isSubmitting}
                                        />
                                        {errors.description && <p className="text-red text-sm mt-1">{errors.description}</p>}
                                    </div>

                                    <div className="mt-12">
                                        <button
                                            type="submit"
                                            className={`bg-primary text-white px-8 py-3 font-bold rounded-lg font-medium hover:bg-hover flex items-center gap-2 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                            disabled={isSubmitting}
                                            onClick={handleSubmit}
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="animate-spin" />
                                            ) : (
                                                <span className="font-bold">Save</span>
                                            )}
                                        </button>
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

export default EditUserAccessTypeModal;