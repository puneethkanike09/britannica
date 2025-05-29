import { X } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useState } from 'react';
import toast from "react-hot-toast";

interface School {
    id: number;
    name: string;
    email: string;
    phone: string;
    address?: string;
}

interface EditSchoolModalProps {
    onClose: () => void;
    school: School;
}

export default function EditSchoolModal({ onClose, school }: EditSchoolModalProps) {
    const [formData, setFormData] = useState({
        schoolName: school.name,
        email: school.email,
        phoneNumber: school.phone,
        address: school.address || '',
    });
    const [errors, setErrors] = useState({
        schoolName: '',
        email: '',
        phoneNumber: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isSubmitting) return;
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePhoneNumberChange = (value: string | undefined) => {
        setFormData(prev => ({ ...prev, phoneNumber: value || '' }));
        if (errors.phoneNumber) {
            setErrors(prev => ({ ...prev, phoneNumber: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            schoolName: '',
            email: '',
            phoneNumber: ''
        };
        let isValid = true;

        if (!formData.schoolName.trim()) {
            newErrors.schoolName = 'School name is required';
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);
            toast.promise(
                new Promise((resolve) => {
                    setTimeout(() => {
                        // Simulate a successful API call
                        resolve('School updated successfully!');
                        // For error simulation, you could use:
                        // reject(new Error('Failed to update school'));
                    }, 2000); // Simulate 2-second API call
                }),
                {
                    loading: 'Updating school...',
                    success: () => {
                        setIsSubmitting(false);
                        onClose();
                        return 'School updated successfully!';
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
        <div
            className="fixed inset-0 bg-black/40 bg-opacity-50 z-90 flex items-center justify-center px-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg w-full max-w-[835px] max-h-[90vh] overflow-hidden flex flex-col sm:px-10 py-4">
                {/* Sticky Header */}
                <div className="bg-white px-8 py-6 flex justify-between items-center  flex-shrink-0">
                    <h2 className="text-3xl font-bold text-textColor">Edit School</h2>
                    <button
                        onClick={onClose}
                        className={`text-textColor hover:text-textColor/90 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        disabled={isSubmitting}
                    >
                        <X className="h-7 w-7" />
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-textColor mb-2">
                                    School Name<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="schoolName"
                                    value={formData.schoolName}
                                    onChange={handleInputChange}
                                    className={`w-full p-3 border rounded-lg text-base bg-primary/5 placeholder:text-gray-400 ${errors.schoolName ? 'border-red-500' : 'border-gray-300'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                    disabled={isSubmitting}
                                />
                                {errors.schoolName && <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>}
                            </div>
                            <div>
                                <label className="block text-textColor mb-2">
                                    Email Address<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full p-3 border rounded-lg text-base bg-primary/5 placeholder:text-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-300'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                    disabled={isSubmitting}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-textColor mb-2">
                                    Phone Number<span className="text-red-500">*</span>
                                </label>
                                <PhoneInput
                                    international
                                    defaultCountry="IN"
                                    value={formData.phoneNumber}
                                    onChange={handlePhoneNumberChange}
                                    className={`phone-input-container ${errors.phoneNumber ? 'border-red-500' : ''} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                    disabled={isSubmitting}
                                />
                                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                            </div>
                            <div>
                                <label className="block text-textColor mb-2">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className={`w-full p-3 border border-gray-300 rounded-lg text-base bg-primary/5 placeholder:text-gray-400 ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="mt-12">
                            <button
                                type="submit"
                                className={`bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/80 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                disabled={isSubmitting}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}