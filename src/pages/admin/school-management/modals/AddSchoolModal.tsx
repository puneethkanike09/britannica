import { X, Loader2 } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useState, useEffect, useCallback } from 'react';
import toast from "react-hot-toast";
import { AddSchoolModalProps } from "../../../../types/admin";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";

export default function AddSchoolModal({ onClose, onSchoolAdded }: AddSchoolModalProps) {
    const [formData, setFormData] = useState<{
        school_name: string;
        school_email: string;
        school_mobile_no: string;
        address_line1: string;
        address_line2: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
    }>({
        school_name: '',
        school_email: '',
        school_mobile_no: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
    });

    const [errors, setErrors] = useState({
        school_name: '',
        school_email: '',
        school_mobile_no: '',
        address_line1: '',
        city: '',
        state: '',
        country: '',
        pincode: ''
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePhoneNumberChange = (value: string | undefined) => {
        setFormData(prev => ({ ...prev, school_mobile_no: value || '' }));
        if (errors.school_mobile_no) {
            setErrors(prev => ({ ...prev, school_mobile_no: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            school_name: '',
            school_email: '',
            school_mobile_no: '',
            address_line1: '',
            city: '',
            state: '',
            country: '',
            pincode: ''
        };
        let isValid = true;

        if (!formData.school_name.trim()) {
            newErrors.school_name = 'School name is required';
            isValid = false;
        }

        if (!formData.school_email.trim()) {
            newErrors.school_email = 'Email address is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.school_email)) {
            newErrors.school_email = 'Please enter a valid email address';
            isValid = false;
        }

        if (!formData.school_mobile_no.trim()) {
            newErrors.school_mobile_no = 'Phone number is required';
            isValid = false;
        }

        if (!formData.address_line1.trim()) {
            newErrors.address_line1 = 'Address line 1 is required';
            isValid = false;
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
            isValid = false;
        }

        if (!formData.state.trim()) {
            newErrors.state = 'State is required';
            isValid = false;
        }

        if (!formData.country.trim()) {
            newErrors.country = 'Country is required';
            isValid = false;
        }

        if (!formData.pincode.trim()) {
            newErrors.pincode = 'Pincode is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleAddSchool = async () => {
        if (validateForm()) {
            setIsSubmitting(true);
            toast.promise(
                (async () => {
                    const response = await import('../../../../services/schoolService').then(m => m.SchoolService.addSchool(formData));
                    if (response.error === false || response.error === "false") {
                        setIsSubmitting(false);
                        if (onSchoolAdded) onSchoolAdded();
                        handleClose();
                        return response.message || 'School added successfully!';
                    } else {
                        setIsSubmitting(false);
                        throw new Error(response.message || 'Failed to add school');
                    }
                })(),
                {
                    loading: 'Adding school...',
                    success: (msg) => msg,
                    error: (err) => err.message || 'Failed to add school',
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
                            <h2 className="text-3xl font-bold text-secondary">Add School</h2>
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
                                            Email address<span className="text-red">*</span>
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
                                            Address Line 1<span className="text-red">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="address_line1"
                                            value={formData.address_line1}
                                            onChange={handleInputChange}
                                            placeholder="Enter Address Line 1"
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.address_line1 ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                            disabled={isSubmitting}
                                        />
                                        {errors.address_line1 && <p className="text-red text-sm mt-1">{errors.address_line1}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">Address Line 2</label>
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
                                            City<span className="text-red">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="Enter City"
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.city ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                            disabled={isSubmitting}
                                        />
                                        {errors.city && <p className="text-red text-sm mt-1">{errors.city}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            State<span className="text-red">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            placeholder="Enter State"
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.state ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                            disabled={isSubmitting}
                                        />

                                        {errors.state && <p className="text-red text-sm mt-1">{errors.state}</p>}
                                    </div>
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            Country<span className="text-red">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            placeholder="Enter Country"
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.country ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                            disabled={isSubmitting}
                                        />
                                        {errors.country && <p className="text-red text-sm mt-1">{errors.country}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            Pincode<span className="text-red">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            placeholder="Enter Pincode"
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.pincode ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                            disabled={isSubmitting}
                                        />
                                        {errors.pincode && <p className="text-red text-sm mt-1">{errors.pincode}</p>}
                                    </div>
                                </div>

                                <div className="mt-12">
                                    <button
                                        type="button"
                                        onClick={handleAddSchool}
                                        className={`bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-hover flex items-center gap-2 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            <span className="font-bold">Add School</span>
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