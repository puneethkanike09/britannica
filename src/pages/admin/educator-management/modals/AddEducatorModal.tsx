import { X, Loader2 } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useState, useEffect, useCallback } from 'react';
import toast from "react-hot-toast";
import { AddTeacherModalProps } from "../../../../types/admin/educator-management";
import { School } from "../../../../types/admin/school-management";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import { EducatorService } from '../../../../services/admin/educatorService';
import { SchoolService } from '../../../../services/admin/schoolService';
import { parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js';

export default function AddEducatorModal({ onClose, onTeacherAdded }: AddTeacherModalProps) {
    const [formData, setFormData] = useState<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        loginId: string;
        schoolId?: number;
    }>({
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
    const [schools, setSchools] = useState<Pick<School, 'school_id' | 'school_name'>[]>([]);
    const [isSchoolsLoading, setIsSchoolsLoading] = useState(true);

    // Wrap handleClose in useCallback for stable reference
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

    // Fix useEffect dependency
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
            case 'firstName':
            case 'lastName':
                // Only allow letters, spaces, min 2, max 50
                return value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
            case 'email':
                // Allow only valid email characters, max 100, and convert to lowercase
                return value.replace(/[^a-zA-Z0-9._%+-@]/g, '').slice(0, 100).toLowerCase();
            case 'loginId':
                // Allow any characters, max 100
                return value.slice(0, 100);
            case 'phone':
                // Only allow digits and +, max 15
                return value.replace(/[^0-9+]/g, '').slice(0, 15);
            default:
                return value;
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let newValue = restrictInput(name, value);
        // For email, always convert to lowercase
        if (name === 'email') {
            newValue = newValue.toLowerCase();
        }
        setFormData(prev => ({
            ...prev,
            [name]: name === 'schoolId' ? (value ? Number(value) : undefined) : newValue,
        }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Phone input: reset country code if international is selected
    const handlePhoneNumberChange = (value: string | undefined) => {
        const phone = value || '';
        setFormData(prev => ({ ...prev, phone }));
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

        // First name: min 2, max 50, only letters/spaces
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
            isValid = false;
        } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.firstName.trim())) {
            newErrors.firstName = 'First name must be 2-50 letters only';
            isValid = false;
        }

        // Email: stricter regex
        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required';
            isValid = false;
        } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.(com|net|org|io|in)$/.test(formData.email)) {
    newErrors.email = 'Please enter a valid lowercase email address with a proper domain';
    isValid = false;
}


        // Mobile: optional, but validate if provided using libphonenumber-js
        if (formData.phone.trim()) {
            try {
                const phoneNumber = parsePhoneNumberFromString(formData.phone);
                if (!phoneNumber || !isValidPhoneNumber(formData.phone, phoneNumber.country || undefined)) {
                    newErrors.phone = 'Enter a valid phone number for the selected country';
                    isValid = false;
                }
            } catch {
                newErrors.phone = 'Enter a valid phone number';
                isValid = false;
            }
        }

        // Login ID: required, min 3, max 100 characters
        if (!formData.loginId.trim()) {
            newErrors.loginId = 'Login ID is required';
            isValid = false;
        } else if (formData.loginId.length < 3 || formData.loginId.length > 100) {
            newErrors.loginId = 'Login ID must be 3-100 characters';
            isValid = false;
        }

        if (formData.schoolId === undefined) {
            newErrors.schoolId = 'School is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                const response = await EducatorService.addTeacher({
                    school_id: formData.schoolId!,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    mobile_no: formData.phone,
                    email_id: formData.email,
                    login_id: formData.loginId,
                });
                if (response.error === false || response.error === "false") {
                    toast.success(response.message ?? 'Educator added successfully!');
                    if (onTeacherAdded) onTeacherAdded();
                    handleClose();
                } else {
                    toast.error(response.message ?? 'Failed to add educator');
                }
            } catch (error) {
                const errMsg = (error as { message?: string })?.message || 'Failed to add educator';
                toast.error(errMsg);
                console.error('Add educator error:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    useEffect(() => {
        let mounted = true;
        setIsSchoolsLoading(true);

        SchoolService.fetchSchoolsForDropdown().then((res) => {
            if (mounted) {
                if (res && !res.error) {
                    setSchools(res.school || []);
                } else {
                    setSchools([]);
                    toast.error(res.message ?? 'Failed to load schools');
                }
                setIsSchoolsLoading(false);
            }
        }).catch(() => {
            if (mounted) {
                setSchools([]);
                setIsSchoolsLoading(false);
                toast.error('Failed to load schools');
            }
        });

        return () => { mounted = false; };
    }, []);

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
                            <h2 className="text-3xl font-bold text-secondary">Add Educator</h2>
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
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.firstName ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
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
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'border-inputPlaceholder'} focus:outline-none focus:border-primary`}
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
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.email ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
                                            disabled={isSubmitting}
                                        />
                                        {errors.email && <p className="text-red text-sm mt-1">{errors.email}</p>}
                                    </div>
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            Phone Number
                                        </label>
                                        <PhoneInput
                                            international
                                            defaultCountry="IN"
                                            value={formData.phone}
                                            onChange={handlePhoneNumberChange}
                                            placeholder="Enter Phone Number"
                                            className={`phone-input-container ${errors.phone ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
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
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.loginId ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
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
                                            value={formData.schoolId ? String(formData.schoolId) : ''}
                                            onChange={handleInputChange}
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder appearance-none ${errors.schoolId ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting || isSchoolsLoading ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
                                            disabled={isSubmitting || isSchoolsLoading}
                                        >
                                            <option value="">{isSchoolsLoading ? 'Loading schools...' : 'Select School'}</option>
                                            {schools.map(school => (
                                                <option key={school.school_id} value={school.school_id}>
                                                    {school.school_name}
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
                                        className={`bg-primary text-white px-8 py-3 font-bold rounded-lg font-medium hover:bg-hover flex items-center gap-2 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            <span className="font-bold">Add Educator</span>
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