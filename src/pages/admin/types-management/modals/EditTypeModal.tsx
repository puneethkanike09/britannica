import { X, Loader2 } from "lucide-react";
import { useState, useCallback } from 'react';
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";

interface EditTypeModalProps {
    onClose: () => void;
    type: { type_id: string; title: string; description: string };
    onTypeUpdated: (type: { type_id: string; title: string; description: string }) => void;
}

export default function EditTypeModal({ onClose, type, onTypeUpdated }: EditTypeModalProps) {
    const [formData, setFormData] = useState({
        type_id: type.type_id,
        title: type.title,
        description: type.description || '',
    });

    const [errors, setErrors] = useState({
        title: '',
        description: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newValue = restrictInput(name, value);
        setFormData(prev => ({ ...prev, [name]: newValue }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Helper for restricting input
    const restrictInput = (name: string, value: string) => {
        switch (name) {
            case 'title':
                // Only allow letters, numbers, spaces, max 50
                return value.replace(/[^a-zA-Z0-9\s]/g, '').slice(0, 50);
            case 'description':
                // Allow letters, numbers, spaces, comma, dot, hyphen, max 200
                return value.replace(/[^a-zA-Z0-9\s,.-]/g, '').slice(0, 200);
            default:
                return value;
        }
    };

    const validateForm = () => {
        const newErrors = {
            title: '',
            description: ''
        };
        let isValid = true;

        // Title: mandatory, min 2, max 50
        if (!formData.title.trim()) {
            newErrors.title = 'Type title is required';
            isValid = false;
        } else if (formData.title.length < 2 || formData.title.length > 50) {
            newErrors.title = 'Title must be 2-50 characters';
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

    const handleSubmit = () => {
        if (validateForm()) {
            setIsSubmitting(true);
            // Simulate async operation without API
            setTimeout(() => {
                try {
                    onTypeUpdated({
                        type_id: formData.type_id,
                        title: formData.title.trim(),
                        description: formData.description.trim()
                    });
                    toast.success('Type updated successfully!');
                    setIsSubmitting(false);
                    handleClose();
                } catch (error) {
                    console.log(error);
                    toast.error('Failed to update type');
                    setIsSubmitting(false);
                }
            }, 1000); // Simulate delay
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
                            <h2 className="text-3xl font-bold text-secondary">Edit Type</h2>
                            <button
                                onClick={handleClose}
                                className={`text-textColor hover:text-hover ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                disabled={isSubmitting}
                            >
                                <X className="h-7 w-7" />
                            </button>
                        </div>

                        {/* Scrollable Form Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            <div className="space-y-6">
                                <div className="mb-3 relative">
                                    <label className="block text-textColor text-base mb-2">
                                        Type Title<span className="text-red">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter Type Title"
                                        maxLength={50}
                                        className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.title ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.title && <p className="text-red text-sm mt-1">{errors.title}</p>}
                                </div>

                                <div className="mb-3 relative">
                                    <label className="block text-textColor text-base mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Enter Type Description"
                                        maxLength={200}
                                        rows={4}
                                        className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.description ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.description && <p className="text-red text-sm mt-1">{errors.description}</p>}
                                </div>

                                <div className="mt-12">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className={`bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-hover flex items-center gap-2 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            <span className="font-bold">Save</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}