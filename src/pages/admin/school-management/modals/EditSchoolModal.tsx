import { X } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useState } from 'react';
import toast from "react-hot-toast";// Adjust the path based on your project structure
import { SchoolActionModalProps, School } from "../../../../types/admin";



export default function EditSchoolModal({ onClose, school }: SchoolActionModalProps) {
    const [formData, setFormData] = useState<Omit<School, 'id'>>({
        name: school.name,
        email: school.email,
        phone: school.phone,
        address: school.address || '',
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: ''
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
        setFormData(prev => ({ ...prev, phone: value || '' }));
        if (errors.phone) {
            setErrors(prev => ({ ...prev, phone: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            name: '',
            email: '',
            phone: ''
        };
        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = 'School name is required';
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
                        resolve('School updated successfully!');
                    }, 2000);
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
                <div className="bg-white px-8 py-6 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-3xl font-bold text-secondary">Edit School</h2>
                    <button
                        onClick={onClose}
                        className={`text-textColor hover:text-hover ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        disabled={isSubmitting}
                    >
                        <X className="h-7 w-7" />
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="mb-3 relative">
                                <label className="block text-textColor text-base mb-2">
                                    School Name<span className="text-red">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter School Name"
                                    className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.name ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                    disabled={isSubmitting}
                                />
                                {errors.name && <p className="text-red text-sm mt-1">{errors.name}</p>}
                            </div>
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <div className="mb-3 relative">
                                <label className="block text-textColor text-base mb-2">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter Address"
                                    className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'border-inputPlaceholder'}`}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="mt-12">
                            <button
                                type="submit"
                                className={`bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-hover ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
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