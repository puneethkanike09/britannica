import { useState, useEffect, useCallback } from 'react';
import toast from "react-hot-toast";
import { SchoolActionModalProps } from "../../../../types/admin/school-management";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import { X, Loader2 } from "lucide-react";
import { parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js';
import { SchoolService } from "../../../../services/admin/schoolService";
import Loader from "../../../../components/common/Loader";

export default function EditSchoolModal({ onClose, school, onSchoolUpdated }: SchoolActionModalProps) {
    const [formData, setFormData] = useState({
        school_id: school.school_id,
        school_code: school.school_code || '',
        school_name: school.school_name,
        school_email: school.school_email,
        school_mobile_no: school.school_mobile_no,
        address_line1: school.address_line1 || '',
        address_line2: school.address_line2 || '',
        city: school.city || '',
        state: school.state || '',
        country: school.country || '',
        pincode: school.pincode || '',
    });
    const [errors, setErrors] = useState({
        school_code: '',
        school_name: '',
        school_email: '',
        school_mobile_no: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        country: '',
        pincode: ''
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
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isSubmitting) {
                handleClose();
            }
        };
        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [isSubmitting, handleClose]);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        SchoolService.fetchSchoolById(school.school_id).then((res) => {
            if (!mounted) return;
            if (res && !res.error && res.school) {
                setFormData({
                    school_id: res.school.school_id,
                    school_code: res.school.school_code || '',
                    school_name: res.school.school_name,
                    school_email: res.school.school_email,
                    school_mobile_no: res.school.school_mobile_no,
                    address_line1: res.school.address_line1 || '',
                    address_line2: res.school.address_line2 || '',
                    city: res.school.city || '',
                    state: res.school.state || '',
                    country: res.school.country || '',
                    pincode: res.school.pincode || '',
                });
                setError(null);
            } else {
                setError(res.message || 'Failed to load school details');
            }
            setLoading(false);
        }).catch((err) => {
            if (!mounted) return;
            setError(err.message || 'Failed to load school details');
            setLoading(false);
        });
        return () => { mounted = false; };
    }, [school.school_id]);

    // Helper for restricting input
    const restrictInput = (name: string, value: string) => {
        switch (name) {
            case 'school_code':
                // Allow alphanumeric characters, 11-20
                return value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
            case 'school_name':
            case 'city':
            case 'state':
            case 'country':
                // Only allow letters, spaces, max 50
                return value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
            case 'school_email':
                // Allow valid email characters, max 100, and convert to lowercase
                return value.replace(/[^a-zA-Z0-9._%+-@]/g, '').slice(0, 100).toLowerCase();
            case 'address_line1':
            case 'address_line2':
                // Allow letters, numbers, spaces, comma, dot, hyphen, max 100
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
        let newValue = restrictInput(name, value);
        // For school_email, always convert to lowercase
        if (name === 'school_email') {
            newValue = newValue.toLowerCase();
        }
        setFormData(prev => ({ ...prev, [name]: newValue }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Phone input: handle phone number changes
    const handlePhoneNumberChange = (value: string | undefined) => {
        const phone = value || '';
        setFormData(prev => ({ ...prev, school_mobile_no: phone }));
        if (errors.school_mobile_no) {
            setErrors(prev => ({ ...prev, school_mobile_no: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            school_code: '',
            school_name: '',
            school_email: '',
            school_mobile_no: '',
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            country: '',
            pincode: ''
        };
        let isValid = true;

        // School code: mandatory, min 11, max 20, alphanumeric
        if (!formData.school_code.trim()) {
            newErrors.school_code = 'School code is required';
            isValid = false;
        } else if (!/^[a-zA-Z0-9]{11,20}$/.test(formData.school_code.trim())) {
            newErrors.school_code = 'School code must be 11-20 alphanumeric characters';
            isValid = false;
        }

        // School name: mandatory, min 2, max 50, only letters/spaces
        if (!formData.school_name.trim()) {
            newErrors.school_name = 'School name is required';
            isValid = false;
        } else if (!/^[a-zA-Z\s']{2,50}$/.test(formData.school_name.trim())) {
            newErrors.school_name = 'Name must be 2-50 letters only';
            isValid = false;
        }

        // Email: optional, but validate if provided
        if (formData.school_email.trim() && (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.school_email) || formData.school_email.length > 100)) {
            newErrors.school_email = 'Please enter a valid email address (max 100 characters)';
            isValid = false;
        }

        // Mobile: optional, but validate if provided using libphonenumber-js
        if (formData.school_mobile_no.trim()) {
            try {
                const phoneNumber = parsePhoneNumberFromString(formData.school_mobile_no);
                if (!phoneNumber || !isValidPhoneNumber(formData.school_mobile_no, phoneNumber.country || undefined)) {
                    newErrors.school_mobile_no = 'Please enter a valid phone number for the selected country';
                    isValid = false;
                }
            } catch {
                newErrors.school_mobile_no = 'Please enter a valid phone number';
                isValid = false;
            }
        }

        // Address line 1: mandatory, min 5, max 100
        if (!formData.address_line1.trim()) {
            newErrors.address_line1 = 'Address line 1 is required';
            isValid = false;
        } else if (formData.address_line1.length < 5 || formData.address_line1.length > 100) {
            newErrors.address_line1 = 'Address must be 5-100 characters';
            isValid = false;
        }

        // Address line 2: optional, max 100
        if (formData.address_line2.trim() && formData.address_line2.length > 100) {
            newErrors.address_line2 = 'Address must be up to 100 characters';
            isValid = false;
        }

        // City: mandatory, min 2, max 50, only letters/spaces
        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
            isValid = false;
        } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.city.trim())) {
            newErrors.city = 'City must be 2-50 letters only';
            isValid = false;
        }

        // State: mandatory, min 2, max 50, only letters/spaces
        if (!formData.state.trim()) {
            newErrors.state = 'State is required';
            isValid = false;
        } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.state.trim())) {
            newErrors.state = 'State must be 2-50 letters only';
            isValid = false;
        }

        // Country: mandatory, min 2, max 50, only letters/spaces
        if (!formData.country.trim()) {
            newErrors.country = 'Country is required';
            isValid = false;
        } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.country.trim())) {
            newErrors.country = 'Country must be 2-50 letters only';
            isValid = false;
        }

        // Pincode: optional, but validate if provided
        if (formData.pincode.trim() && !/^\d{4,10}$/.test(formData.pincode)) {
            newErrors.pincode = 'Pincode must be 4-10 digits';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                const response = await SchoolService.updateSchool(formData);
                if (response.error === false || response.error === "false") {
                    toast.success(response.message ?? 'School updated successfully!');
                    if (onSchoolUpdated) {
                        onSchoolUpdated();
                    }
                    handleClose();
                } else {
                    toast.error(response.message ?? 'Failed to update school');
                }
            } catch (error) {
                const errMsg = (error as { message?: string })?.message || 'Failed to update school';
                toast.error(errMsg);
                console.error('Update school error:', error);
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
                            {loading ? (
                                <Loader message="Loading School Details..." />
                            ) : error ? (
                                <div className="py-12 text-center text-red">{error}</div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="mb-3 relative">
                                            <label className="block text-textColor text-base mb-2">
                                                School Code<span className="text-red">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="school_code"
                                                value={formData.school_code}
                                                onChange={handleInputChange}
                                                placeholder="Enter School Code (11-20 alphanumeric characters)"
                                                maxLength={20}
                                                minLength={11}
                                                pattern="^[a-zA-Z0-9]{11,20}$"
                                                title="School code must be 11-20 alphanumeric characters"
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.school_code ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.school_code && <p className="text-red text-sm mt-1">{errors.school_code}</p>}
                                        </div>
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
                                                maxLength={50}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.school_name ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.school_name && <p className="text-red text-sm mt-1">{errors.school_name}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="mb-3 relative">
                                            <label className="block text-textColor text-base mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                name="school_email"
                                                value={formData.school_email}
                                                onChange={handleInputChange}
                                                placeholder="Enter Email Address"
                                                maxLength={100}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.school_email ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.school_email && <p className="text-red text-sm mt-1">{errors.school_email}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="mb-3 relative">
                                            <label className="block text-textColor text-base mb-2">
                                                Phone Number
                                            </label>
                                            <PhoneInput
                                                international
                                                defaultCountry="IN"
                                                value={formData.school_mobile_no}
                                                onChange={handlePhoneNumberChange}
                                                placeholder="Enter Phone Number"
                                                className={`phone-input-container ${errors.school_mobile_no ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
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
                                                maxLength={100}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.address_line1 ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.address_line1 && <p className="text-red text-sm mt-1">{errors.address_line1}</p>}
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
                                                maxLength={100}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.address_line2 ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.address_line2 && <p className="text-red text-sm mt-1">{errors.address_line2}</p>}
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
                                                maxLength={50}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.city ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
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
                                                maxLength={50}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.state ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
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
                                                maxLength={50}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.country ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.country && <p className="text-red text-sm mt-1">{errors.country}</p>}
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
                                                maxLength={10}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.pincode ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.pincode && <p className="text-red text-sm mt-1">{errors.pincode}</p>}
                                        </div>
                                    </div>
                                    <div className="mt-12">
                                        <button
                                            type="submit"
                                            className={`bg-primary text-white px-8 py-3 font-bold rounded-lg hover:bg-hover flex items-center gap-2 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
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
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}