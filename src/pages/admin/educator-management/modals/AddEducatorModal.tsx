import { X } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import { AddEducatorModalProps, School, Educator } from "../../../../types/admin";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";

// Mock data for schools dropdown
const schools: Pick<School, 'id' | 'name'>[] = [
    { id: 1, name: "Britanica School" },
    { id: 2, name: "St. Mary's School" },
    { id: 3, name: "Delhi Public School" },
    { id: 4, name: "Kendriya Vidyalaya" },
];

export default function AddEducatorModal({ onClose }: AddEducatorModalProps) {
    const [formData, setFormData] = useState<Omit<Educator, 'id'>>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        loginId: '',
        schoolId: undefined,
    });
    const [errors, setErrors] = useState({
        firstName: '',
        email: '',
        phone: '',
        loginId: '',
        schoolId: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        if (isSubmitting) return;
        setIsVisible(false);
    };

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
    }, [isSubmitting]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'schoolId' ? (value ? Number(value) : undefined) : value,
        }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePhoneNumberChange = (value: string | undefined) => {
        setFormData(prev => ({ ...prev, phone: value || '' }));
        if (errors.phone) {
            setErrors(prev => ({ ...prev, phone: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            firstName: '',
            email: '',
            phone: '',
            loginId: '',
            schoolId: ''
        };
        let isValid = true;

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
            isValid = false;
        }

        if (!formData.loginId.trim()) {
            newErrors.loginId = 'Login ID is required';
            isValid = false;
        }

        if (formData.schoolId === undefined) {
            newErrors.schoolId = 'School is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            setIsSubmitting(true);
            toast.promise(
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve('Educator added successfully!');
                    }, 2000);
                }),
                {
                    loading: 'Adding educator...',
                    success: () => {
                        setIsSubmitting(false);
                        handleClose();
                        return 'Educator added successfully!';
                    },
                    error: (err) => {
                        setIsSubmitting(false);
                        return `Error: ${err.message}`;
                    }
                }
            );
        }
    };

    return (
        <AnimatePresence onExitComplete={handleAnimationComplete}>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 bg-black/40 bg-opacity-50 backdrop-blur-sm z-90 flex items-center justify-center px-4"
                    onClick={handleBackdropClick}
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeOut" }}
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
                            <h2 className="text-3xl font-bold text-secondary">Add Educator</h2>
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
                                            First Name<span className="text-red">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="Enter First Name"
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.firstName ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                            disabled={isSubmitting}
                                        />
                                        {errors.firstName && <p className="text-red text-sm mt-1">{errors.firstName}</p>}
                                    </div>
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Enter Last Name"
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'border-inputPlaceholder'}`}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            Email Address<span className="text-red">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter Email Address"
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.email ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                            disabled={isSubmitting}
                                        />
                                        {errors.email && <p className="text-red text-sm mt-1">{errors.email}</p>}
                                    </div>
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            Phone Number<span className="text-red">*</span>
                                        </label>
                                        <PhoneInput
                                            international
                                            defaultCountry="IN"
                                            value={formData.phone}
                                            onChange={handlePhoneNumberChange}
                                            placeholder="Enter Phone Number"
                                            className={`phone-input-container ${errors.phone ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                            disabled={isSubmitting}
                                        />
                                        {errors.phone && <p className="text-red text-sm mt-1">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            Login ID<span className="text-red">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="loginId"
                                            value={formData.loginId}
                                            onChange={handleInputChange}
                                            placeholder="Enter Login ID"
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.loginId ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                            disabled={isSubmitting}
                                        />
                                        {errors.loginId && <p className="text-red text-sm mt-1">{errors.loginId}</p>}
                                    </div>
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            School<span className="text-red">*</span>
                                        </label>
                                        <select
                                            name="schoolId"
                                            value={formData.schoolId ?? ''}
                                            onChange={handleInputChange}
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder appearance-none ${errors.schoolId ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Select School</option>
                                            {schools.map(school => (
                                                <option key={school.id} value={school.id}>
                                                    {school.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.schoolId && <p className="text-red text-sm mt-1">{errors.schoolId}</p>}
                                    </div>
                                </div>

                                <div className="mt-12">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className={`bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-hover flex items-center gap-2 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                        disabled={isSubmitting}
                                    >
                                        <span className="font-bold">Add Educator</span>
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