import { X, Loader2 } from "lucide-react";
import { useState, useCallback, useEffect } from 'react';
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import { GradeService } from "../../../../services/admin/gradeService";

interface AddGradeModalProps {
    onClose: () => void;
    onAdded?: () => void;
}

export default function AddGradeModal({ onClose, onAdded }: AddGradeModalProps) {
    const [formData, setFormData] = useState<{
        grade_name: string;
        description: string;
    }>({
        grade_name: '',
        description: '',
    });

    const [errors, setErrors] = useState({
        grade_name: '',
        description: ''
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
            case 'grade_name':
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
            grade_name: '',
            description: ''
        };
        let isValid = true;

        // grade_name: mandatory, min 2, max 50
        if (!formData.grade_name.trim()) {
            newErrors.grade_name = 'Grade name is required';
            isValid = false;
        } else if (formData.grade_name.length < 2 || formData.grade_name.length > 50) {
            newErrors.grade_name = 'Grade name must be 2-50 characters';
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

    const handleAddGrade = async () => {
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                const response = await GradeService.createGrade({
                    grade_name: formData.grade_name.trim(),
                    description: formData.description.trim(),
                });
                if (response.error === false || response.error === "false") {
                    toast.success(response.message ?? 'Grade added successfully!');
                    if (onAdded) onAdded();
                    handleClose();
                } else {
                    toast.error(response.message ?? 'Failed to add grade');
                }
            } catch (error) {
                toast.error('Failed to add grade');
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
                            <h2 className="text-3xl font-bold text-secondary">Add Grade</h2>
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
                                        Grade Name<span className="text-red">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="grade_name"
                                        value={formData.grade_name}
                                        onChange={handleInputChange}
                                        placeholder="Enter Grade name"
                                        maxLength={50}
                                        className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.grade_name ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.grade_name && <p className="text-red text-sm mt-1">{errors.grade_name}</p>}
                                </div>

                                <div className="mb-3 relative">
                                    <label className="block text-textColor text-base mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Enter Grade Description"
                                        maxLength={200}
                                        rows={4}
                                        className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.description ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.description && <p className="text-red text-sm mt-1">{errors.description}</p>}
                                </div>

                                <div className="mt-12">
                                    <button
                                        type="button"
                                        onClick={handleAddGrade}
                                        className={`bg-primary text-white px-8 py-3 font-bold rounded-lg  hover:bg-hover flex items-center gap-2 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            <span className="font-bold">Add Grade</span>
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