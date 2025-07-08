import { X, Loader2, Check } from "lucide-react";
import { useState, useCallback, useEffect } from 'react';
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import { ThemeService } from "../../../../services/admin/themeService";

interface AddThemeModalProps {
    onClose: () => void;
    onAdded?: () => void;
}

export default function AddThemeModal({ onClose, onAdded }: AddThemeModalProps) {
    const [formData, setFormData] = useState<{
        theme_name: string;
        description: string;
        theme_color: string;
    }>({
        theme_name: '',
        description: '',
        theme_color: '',
    });

    const [errors, setErrors] = useState({
        theme_name: '',
        description: '',
        theme_color: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isSubmitting) handleClose();
        };
        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [isSubmitting]);

    const handleClose = useCallback(() => {
        if (isSubmitting) return;
        setIsVisible(false);
    }, [isSubmitting]);

    const handleAnimationComplete = () => {
        if (!isVisible) onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isSubmitting) return;
        if (e.target === e.currentTarget) handleClose();
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
            case 'theme_name':
                // Only allow letters, numbers, spaces, max 50
                return value.replace(/[^a-zA-Z0-9\s]/g, '').slice(0, 50);
            case 'description':
                // Allow letters, numbers, spaces, comma, dot, hyphen, max 200
                return value.replace(/[^a-zA-Z0-9\s,.-]/g, '').slice(0, 200);
            case 'theme_color':
                // Only allow hex color format (#RRGGBB)
                let hexValue = value.replace(/[^#0-9a-fA-F]/g, '');
                if (hexValue.length > 0 && !hexValue.startsWith('#')) {
                    hexValue = '#' + hexValue;
                }
                return hexValue.slice(0, 7);
            default:
                return value;
        }
    };

    // Validate hex color format
    const isValidHexColor = (hex: string) => {
        const hexRegex = /^#[0-9a-fA-F]{6}$/;
        return hexRegex.test(hex);
    };

    const validateForm = () => {
        const newErrors = {
            theme_name: '',
            description: '',
            theme_color: '',
        };
        let isValid = true;

        // theme_name: mandatory, min 2, max 50
        if (!formData.theme_name.trim()) {
            newErrors.theme_name = 'Theme name is required';
            isValid = false;
        } else if (formData.theme_name.length < 2 || formData.theme_name.length > 50) {
            newErrors.theme_name = 'Theme name must be 2-50 characters';
            isValid = false;
        }

        // Description: optional, but validate if provided
        if (formData.description.trim() && formData.description.length > 200) {
            newErrors.description = 'Description must be 200 characters or less';
            isValid = false;
        }

        // theme_color: required and must be valid hex
        if (!formData.theme_color) {
            newErrors.theme_color = 'Theme color is required';
            isValid = false;
        } else if (!isValidHexColor(formData.theme_color)) {
            newErrors.theme_color = 'Please enter a valid hex color (e.g., #FF5733)';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleAddTheme = async () => {
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                const response = await ThemeService.createTheme({
                    theme_name: formData.theme_name.trim(),
                    description: formData.description.trim(),
                    theme_color: formData.theme_color,
                });
                if (response.error === false || response.error === "false") {
                    toast.success(response.message ?? 'Theme added successfully!');
                    if (onAdded) onAdded();
                    handleClose();
                } else {
                    toast.error(response.message ?? 'Failed to add theme');
                }
            } catch (error) {
                toast.error('Failed to add theme');
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
                            <h2 className="text-3xl font-bold text-secondary">Add Theme</h2>
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
                                        Theme Name<span className="text-red">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="theme_name"
                                        value={formData.theme_name}
                                        onChange={handleInputChange}
                                        placeholder="Enter Theme name"
                                        maxLength={50}
                                        className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.theme_name ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.theme_name && <p className="text-red text-sm mt-1">{errors.theme_name}</p>}
                                </div>

                                <div className="mb-3 relative">
                                    <label className="block text-textColor text-base mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Enter Theme Description"
                                        maxLength={200}
                                        rows={4}
                                        className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.description ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.description && <p className="text-red text-sm mt-1">{errors.description}</p>}
                                </div>

                                <div className="mb-3 relative">
                                    <label className="block text-textColor text-base mb-2">
                                        Theme Color<span className="text-red">*</span>
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            name="theme_color"
                                            value={formData.theme_color}
                                            onChange={handleInputChange}
                                            placeholder="#FF5733"
                                            maxLength={7}
                                            className={`p-4 py-3 text-textColor flex-1 border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.theme_color ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
                                            disabled={isSubmitting}
                                        />
                                        {/* Color Preview */}
                                        <div className="flex-shrink-0">
                                            <div 
                                                className="w-12 h-12 rounded-lg border-1 border-inputBorder    flex items-center justify-center"
                                                style={{ 
                                                    backgroundColor: isValidHexColor(formData.theme_color) 
                                                        ? formData.theme_color 
                                                        : '#f3f4f6' 
                                                }}
                                            >
                                                {isValidHexColor(formData.theme_color) && (
                                                    <Check className="w-5 h-5 text-white drop-shadow-lg" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {errors.theme_color && <p className="text-red text-sm mt-1">{errors.theme_color}</p>}
                                </div>

                                <div className="mt-12">
                                    <button
                                        type="button"
                                        onClick={handleAddTheme}
                                        className={`bg-primary text-white px-8 py-3 font-bold rounded-lg  hover:bg-hover flex items-center gap-2 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            <span className="font-bold">Add Theme</span>
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