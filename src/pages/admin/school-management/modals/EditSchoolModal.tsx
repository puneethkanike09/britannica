import { useState, useEffect, useCallback } from 'react';
import toast from "react-hot-toast";
import { SchoolActionModalProps } from "../../../../types/admin";
import PhoneInput from 'react-phone-number-input';
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import { X, Loader2 } from "lucide-react";

export default function EditSchoolModal({ onClose, school, onSchoolUpdated }: SchoolActionModalProps) {
    const [formData, setFormData] = useState({
        school_id: school.school_id,
        school_name: school.school_name,
        school_email: school.school_email,
        school_mobile_no: school.school_mobile_no,
        address_line1: school.address_line1,
        address_line2: school.address_line2 || '',
        city: school.city || '',
        state: school.state || '',
        country: school.country || '',
        pincode: school.pincode || '',
    });
    const [errors, setErrors] = useState({
        school_name: '',
        school_email: '',
        school_mobile_no: ''
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

    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isSubmitting) {
                handleClose();
            }
        };
        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [isSubmitting, handleClose]);

    // Helper for restricting input
    const restrictInput = (name: string, value: string) => {
        switch (name) {
            case 'school_name':
            case 'city':
            case 'state':
                // Only allow letters, spaces, min 2, max 50
                return value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
            case 'country':
                // Only allow letters, spaces, min 2, max 50
                return value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
            case 'address_line1':
            case 'address_line2':
                // Allow letters, numbers, spaces, comma, dot, min 5, max 100
                return value.replace(/[^a-zA-Z0-9\s,.-]/g, '').slice(0, 100);
            case 'pincode':
                // Only allow digits, max 10
                return value.replace(/[^0-9]/g, '').slice(0, 10);
            default:
                return value;
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newValue = restrictInput(name, value);
        setFormData(prev => ({ ...prev, [name]: newValue }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Phone input: reset country code if international is selected
    const handlePhoneNumberChange = (value: string | undefined) => {
        const phone = value || '';
        setFormData(prev => ({ ...prev, school_mobile_no: phone }));
        if (errors.school_mobile_no) {
            setErrors(prev => ({ ...prev, school_mobile_no: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            school_name: '',
            school_email: '',
            school_mobile_no: ''
        };
        let isValid = true;

        // School name: min 2, max 50, only letters/spaces
        if (!formData.school_name.trim()) {
            newErrors.school_name = 'School name is required';
            isValid = false;
        } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.school_name.trim())) {
            newErrors.school_name = 'Name must be 2-50 letters only';
            isValid = false;
        }

        // Email: stricter regex
        if (!formData.school_email.trim()) {
            newErrors.school_email = 'Email address is required';
            isValid = false;
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.school_email)) {
            newErrors.school_email = 'Please enter a valid email address';
            isValid = false;
        }

        // Mobile: min 8, max 15 digits, allow +
        if (!formData.school_mobile_no.trim()) {
            newErrors.school_mobile_no = 'Phone number is required';
            isValid = false;
        } else if (!/^\+?[0-9]{8,15}$/.test(formData.school_mobile_no)) {
            newErrors.school_mobile_no = 'Enter a valid phone number (8-15 digits)';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);
            toast.promise(
                (async () => {
                    const { SchoolService } = await import('../../../../services/schoolService');
                    const response = await SchoolService.updateSchool(formData);
                    if (response.error === false || response.error === "false") {
                        setIsSubmitting(false);
                        if (onSchoolUpdated) onSchoolUpdated();
                        handleClose();
                        return response.message || 'School updated successfully!';
                    } else {
                        setIsSubmitting(false);
                        throw new Error(response.message || 'Failed to update school');
                    }
                })(),
                {
                    loading: 'Updating school...',
                    success: (msg) => msg,
                    error: (err) => err.message || 'Failed to update school',
                }
            );
        }
    };

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
                            <h2 className="text-3xl font-bold text-secondary">Edit School</h2>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            School Name<span className="text-red">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="school_name"
                                            value={formData.school_name}
                                            onChange={handleInputChange}
                                            placeholder="Enter School Name"
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.school_name ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                            disabled={isSubmitting}
                                        />
                                        {errors.school_name && <p className="text-red text-sm mt-1">{errors.school_name}</p>}
                                    </div>
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            Email Address<span className="text-red">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="school_email"
                                            value={formData.school_email}
                                            onChange={handleInputChange}
                                            placeholder="Enter Email Address"
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.school_email ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                            disabled={isSubmitting}
                                        />
                                        {errors.school_email && <p className="text-red text-sm mt-1">{errors.school_email}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            Phone Number<span className="text-red">*</span>
                                        </label>
                                        <PhoneInput
                                            international
                                            defaultCountry="IN"
                                            value={formData.school_mobile_no}
                                            onChange={handlePhoneNumberChange}
                                            placeholder="Enter Phone Number"
                                            className={`phone-input-container ${errors.school_mobile_no ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                            disabled={isSubmitting}
                                        />
                                        {errors.school_mobile_no && <p className="text-red text-sm mt-1">{errors.school_mobile_no}</p>}
                                    </div>
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            Address Line 1
                                        </label>
                                        <input
                                            type="text"
                                            name="address_line1"
                                            value={formData.address_line1}
                                            onChange={handleInputChange}
                                            placeholder="Enter Address Line 1"
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'border-inputPlaceholder'}`}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            Address Line 2
                                        </label>
                                        <input
                                            type="text"
                                            name="address_line2"
                                            value={formData.address_line2}
                                            onChange={handleInputChange}
                                            placeholder="Enter Address Line 2"
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'border-inputPlaceholder'}`}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="Enter City"
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'border-inputPlaceholder'}`}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            State
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            placeholder="Enter State"
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'border-inputPlaceholder'}`}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            placeholder="Enter Country"
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'border-inputPlaceholder'}`}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            Pincode
                                        </label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            placeholder="Enter Pincode"
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'border-inputPlaceholder'}`}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                                <div className="mt-12">
                                    <button
                                        type="submit"
                                        className={`bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-hover flex items-center gap-2 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                        disabled={isSubmitting}
                                        onClick={handleSubmit}
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            'Save'
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