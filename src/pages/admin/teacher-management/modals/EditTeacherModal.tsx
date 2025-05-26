import { X } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useState } from 'react';
import toast from "react-hot-toast";

interface Teacher {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
}

interface EditTeacherModalProps {
    onClose: () => void;
    teacher: Teacher;
}

const schools = [
    { id: 1, name: "Britanica School" },
    { id: 2, name: "St. Mary's School" },
    { id: 3, name: "Delhi Public School" },
    { id: 4, name: "Kendriya Vidyalaya" },
];

export default function EditTeacherModal({ onClose, teacher }: EditTeacherModalProps) {
    const [formData, setFormData] = useState({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        phoneNumber: teacher.phone,
        address: teacher.address || '',
        school: ''
    });
    const [errors, setErrors] = useState({
        firstName: '',
        email: '',
        phoneNumber: '',
        school: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isSubmitting) return;
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            firstName: '',
            email: '',
            phoneNumber: '',
            school: ''
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

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
            isValid = false;
        }

        if (!formData.school) {
            newErrors.school = 'School is required';
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
                        resolve('Teacher updated successfully!');
                        // For error simulation, you could use:
                        // reject(new Error('Failed to update teacher'));
                    }, 2000); // Simulate 2-second API call
                }),
                {
                    loading: 'Updating teacher...',
                    success: () => {
                        setIsSubmitting(false);
                        onClose();
                        return 'Teacher updated successfully!';
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
                <div className="bg-white px-8 py-6 flex justify-between items-center border-b border-gray-100 flex-shrink-0">
                    <h2 className="text-3xl font-bold text-textColor">Edit Teacher</h2>
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
                                    First Name<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className={`w-full p-3 border rounded-lg text-base bg-primary/5 placeholder:text-gray-400 ${errors.firstName ? 'border-red-500' : 'border-gray-300'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                    disabled={isSubmitting}
                                />
                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                            </div>
                            <div>
                                <label className="block text-textColor mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className={`w-full p-3 border border-gray-300 rounded-lg text-base bg-primary/5 placeholder:text-gray-400 ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-textColor mb-2">
                                    Email address<span className="text-red-500">*</span>
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <div>
                                <label className="block text-textColor mb-2">
                                    School<span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="school"
                                    value={formData.school}
                                    onChange={handleInputChange}
                                    className={`w-full p-3 border rounded-lg text-base bg-primary/5 placeholder:text-gray-400 appearance-none h-[49px] ${errors.school ? 'border-red-500' : 'border-gray-300'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select School</option>
                                    {schools.map(school => (
                                        <option key={school.id} value={school.id}>
                                            {school.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.school && <p className="text-red-500 text-sm mt-1">{errors.school}</p>}
                            </div>
                        </div>

                        <div className="mt-12">
                            <button
                                type="submit"
                                className={`bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/80 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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