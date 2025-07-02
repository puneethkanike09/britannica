import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { parsePhoneNumberFromString, isValidPhoneNumber } from "libphonenumber-js";
import loginImage from "../assets/loginImage.png";
import { backdropVariants, modalVariants } from "../config/constants/Animations/modalAnimation";

interface SchoolFormData {
    schoolName: string;
    emailAddress: string;
    phoneNumber: string;
    schoolCode: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
}

interface EducatorFormData {
    firstName: string;
    lastName: string;
    educatorEmail: string;
    educatorPhone: string;
    loginId: string;
}

const EducatorRegistration = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSuccessVisible, setIsSuccessVisible] = useState(false);

    const [schoolData, setSchoolData] = useState<SchoolFormData>({
        schoolName: "",
        emailAddress: "",
        phoneNumber: "",
        schoolCode: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
    });

    const [educatorData, setEducatorData] = useState<EducatorFormData>({
        firstName: "",
        lastName: "",
        educatorEmail: "",
        educatorPhone: "",
        loginId: "",
    });

    const [errors, setErrors] = useState<Partial<SchoolFormData & EducatorFormData>>({});

    // Restrict input for specific fields
    const restrictInput = (name: string, value: string) => {
        switch (name) {
            case "schoolName":
            case "city":
            case "state":
            case "country":
            case "firstName":
            case "lastName":
                return value.replace(/[^a-zA-Z\s']/g, "").slice(0, 50);
            case "emailAddress":
            case "educatorEmail":
                return value.replace(/[^a-zA-Z0-9._%+-@]/g, "").slice(0, 100);
            case "addressLine1":
            case "addressLine2":
                return value.replace(/[^a-zA-Z0-9\s,.-]/g, "").slice(0, 100);
            case "pincode":
                return value.replace(/[^0-9]/g, "").slice(0, 10);
            case "schoolCode":
            case "loginId":
                return value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 30);
            default:
                return value;
        }
    };

    const handleSchoolInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newValue = restrictInput(name, value);
        setSchoolData((prev) => ({ ...prev, [name]: newValue }));
        if (errors[name as keyof SchoolFormData]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleEducatorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newValue = restrictInput(name, value);
        setEducatorData((prev) => ({ ...prev, [name]: newValue }));
        if (errors[name as keyof EducatorFormData]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSchoolPhoneChange = (value: string | undefined) => {
        const phone = value || "";
        setSchoolData((prev) => ({ ...prev, phoneNumber: phone }));
        if (errors.phoneNumber) {
            setErrors((prev) => ({ ...prev, phoneNumber: "" }));
        }
    };

    const handleEducatorPhoneChange = (value: string | undefined) => {
        const phone = value || "";
        setEducatorData((prev) => ({ ...prev, educatorPhone: phone }));
        if (errors.educatorPhone) {
            setErrors((prev) => ({ ...prev, educatorPhone: "" }));
        }
    };

    const validateStep1 = () => {
        const newErrors: Partial<SchoolFormData> = {};
        let isValid = true;

        if (!schoolData.schoolName.trim()) {
            newErrors.schoolName = "School name is required";
            isValid = false;
        } else if (!/^[a-zA-Z\s']{2,50}$/.test(schoolData.schoolName.trim())) {
            newErrors.schoolName = "School name must be 2-50 letters only";
            isValid = false;
        }

        if (schoolData.emailAddress.trim() && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(schoolData.emailAddress)) {
            newErrors.emailAddress = "Please enter a valid email address (max 100 characters)";
            isValid = false;
        }

        if (schoolData.phoneNumber.trim()) {
            try {
                const phoneNumber = parsePhoneNumberFromString(schoolData.phoneNumber);
                if (!phoneNumber || !isValidPhoneNumber(schoolData.phoneNumber, phoneNumber.country || undefined)) {
                    newErrors.phoneNumber = "Enter a valid phone number for the selected country";
                    isValid = false;
                }
            } catch {
                newErrors.phoneNumber = "Enter a valid phone number";
                isValid = false;
            }
        }

        if (!schoolData.schoolCode.trim()) {
            newErrors.schoolCode = "School code is required";
            isValid = false;
        } else if (!/^[a-zA-Z0-9\s]{3,30}$/.test(schoolData.schoolCode)) {
            newErrors.schoolCode = "School code must be 3-30 alphanumeric characters";
            isValid = false;
        }

        if (!schoolData.addressLine1.trim()) {
            newErrors.addressLine1 = "Address line 1 is required";
            isValid = false;
        } else if (schoolData.addressLine1.length < 5 || schoolData.addressLine1.length > 100) {
            newErrors.addressLine1 = "Address must be 5-100 characters";
            isValid = false;
        }

        if (!schoolData.city.trim()) {
            newErrors.city = "City is required";
            isValid = false;
        } else if (!/^[a-zA-Z\s]{2,50}$/.test(schoolData.city.trim())) {
            newErrors.city = "City must be 2-50 letters only";
            isValid = false;
        }

        if (!schoolData.state.trim()) {
            newErrors.state = "State is required";
            isValid = false;
        } else if (!/^[a-zA-Z\s]{2,50}$/.test(schoolData.state.trim())) {
            newErrors.state = "State must be 2-50 letters only";
            isValid = false;
        }

        if (!schoolData.country.trim()) {
            newErrors.country = "Country is required";
            isValid = false;
        } else if (!/^[a-zA-Z\s]{2,50}$/.test(schoolData.country.trim())) {
            newErrors.country = "Country must be 2-50 letters only";
            isValid = false;
        }

        if (schoolData.pincode.trim() && !/^\d{4,10}$/.test(schoolData.pincode)) {
            newErrors.pincode = "Pincode must be 4-10 digits";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const validateStep2 = () => {
        const newErrors: Partial<EducatorFormData> = {};
        let isValid = true;

        if (!educatorData.firstName.trim()) {
            newErrors.firstName = "First name is required";
            isValid = false;
        } else if (!/^[a-zA-Z\s]{2,50}$/.test(educatorData.firstName.trim())) {
            newErrors.firstName = "First name must be 2-50 letters only";
            isValid = false;
        }

        if (!educatorData.educatorEmail.trim()) {
            newErrors.educatorEmail = "Educator email is required";
            isValid = false;
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(educatorData.educatorEmail)) {
            newErrors.educatorEmail = "Please enter a valid email address";
            isValid = false;
        }

        if (educatorData.educatorPhone.trim()) {
            try {
                const phoneNumber = parsePhoneNumberFromString(educatorData.educatorPhone);
                if (!phoneNumber || !isValidPhoneNumber(educatorData.educatorPhone, phoneNumber.country || undefined)) {
                    newErrors.educatorPhone = "Enter a valid phone number for the selected country";
                    isValid = false;
                }
            } catch {
                newErrors.educatorPhone = "Enter a valid phone number";
                isValid = false;
            }
        }

        if (!educatorData.loginId.trim()) {
            newErrors.loginId = "Login ID is required";
            isValid = false;
        } else if (!/^[a-zA-Z0-9]{3,30}$/.test(educatorData.loginId)) {
            newErrors.loginId = "Login ID must be 3-30 alphanumeric characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep1()) {
            setCurrentStep(2);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(1);
    };

    const handleCloseSuccess = () => {
        setIsSuccessVisible(false);
    };

    const handleSuccessAnimationComplete = () => {
        if (!isSuccessVisible) {
            setShowSuccessModal(false);
            navigate("/educator-login");
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isSubmitting) return;
        if (e.target === e.currentTarget) {
            handleCloseSuccess();
        }
    };

    const handleRegister = async () => {
        if (!validateStep2()) return;

        setIsSubmitting(true);
        toast.promise(
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("Registration successful!");
                    setShowSuccessModal(true);
                    setIsSuccessVisible(true);
                }, 2000);
            }),
            {
                loading: "Registering...",
                success: () => {
                    return "Registered successfully!";
                },
                error: "Registration failed. Please try again.",
            }
        ).finally(() => {
            setIsSubmitting(false);
        });
    };

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Section - Scrollable Form */}
            <div className="flex-1 overflow-y-auto bg-white lg:pr-[46%]">
                <div className="flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-8 py-8">
                    <div className="max-w-[835px] w-full">
                        <div className="bg-white px-8 py-6 flex justify-between items-center">
                            <h1 className="text-textColor text-4xl font-bold mb-1 text-center sm:text-left">
                                Register with Britannica Build
                            </h1>
                        </div>
                        <div className="mb-8 px-8 max-w-md mx-auto py-6">
                            <div className="flex items-center justify-between relative">
                                {/* Step 1 */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center text-white font-medium z-10 relative ${currentStep >= 1 ? "bg-primary" : "bg-lightGray"
                                            }`}
                                    >
                                        1
                                    </div>
                                    <span
                                        className={`mt-2 text-sm ${currentStep === 1 ? "text-primary font-bold" : "text-gray"
                                            }`}
                                    >
                                        School Details
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="absolute left-[75px] right-[85px] top-4 h-0.5 bg-gray-300 z-0">
                                    <div
                                        className={`h-full transition-all duration-300 ${currentStep >= 2 ? "bg-primary" : "bg-gray"
                                            }`}
                                        style={{ width: currentStep >= 2 ? "100%" : "0%" }}
                                    />


                                </div>

                                {/* Step 2 */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center text-white font-medium z-10 relative ${currentStep >= 2 ? "bg-primary" : "bg-lightGray"
                                            }`}
                                    >
                                        2
                                    </div>
                                    <span
                                        className={`mt-2 text-sm ${currentStep === 2 ? "text-primary font-bold" : "text-gray"
                                            }`}
                                    >
                                        Educator Details
                                    </span>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="px-8"
                        >
                            {currentStep === 1 ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="mb-3 relative">
                                            <label className="block text-textColor text-base mb-2">
                                                School UDISE Code<span className="text-red">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="schoolCode"
                                                value={schoolData.schoolCode}
                                                onChange={handleSchoolInputChange}
                                                placeholder="Enter School Code"
                                                maxLength={30}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder focus:outline-none focus:border-primary ${errors.schoolCode ? "border-red" : "border-inputPlaceholder"} ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.schoolCode && (
                                                <p className="text-red text-sm mt-1">{errors.schoolCode}</p>
                                            )}
                                        </div>
                                        <div className="mb-3 relative">
                                            <label className="block text-textColor text-base mb-2">
                                                School Name<span className="text-red">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="schoolName"
                                                value={schoolData.schoolName}
                                                onChange={handleSchoolInputChange}
                                                placeholder="Enter School Name"
                                                maxLength={50}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder focus:outline-none focus:border-primary ${errors.schoolName ? "border-red" : "border-inputPlaceholder"} ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.schoolName && (
                                                <p className="text-red text-sm mt-1">{errors.schoolName}</p>
                                            )}
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
                                                value={schoolData.phoneNumber}
                                                onChange={handleSchoolPhoneChange}
                                                placeholder="Enter Phone Number"
                                                className={`phone-input-container ${errors.phoneNumber ? "border-red" : "border-inputPlaceholder"} ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.phoneNumber && (
                                                <p className="text-red text-sm mt-1">{errors.phoneNumber}</p>
                                            )}
                                        </div>
                                        <div className="mb-3 relative">
                                            <label className="block text-textColor text-base mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                name="emailAddress"
                                                value={schoolData.emailAddress}
                                                onChange={handleSchoolInputChange}
                                                placeholder="Enter Email Address"
                                                maxLength={100}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder focus:outline-none focus:border-primary ${errors.emailAddress ? "border-red" : "border-inputPlaceholder"} ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.emailAddress && (
                                                <p className="text-red text-sm mt-1">{errors.emailAddress}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="mb-3 relative">
                                            <label className="block text-textColor text-base mb-2">
                                                Address Line 1<span className="text-red">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="addressLine1"
                                                value={schoolData.addressLine1}
                                                onChange={handleSchoolInputChange}
                                                placeholder="Enter Address Line 1"
                                                maxLength={100}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder focus:outline-none focus:border-primary ${errors.addressLine1 ? "border-red" : "border-inputPlaceholder"} ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.addressLine1 && (
                                                <p className="text-red text-sm mt-1">{errors.addressLine1}</p>
                                            )}
                                        </div>
                                        <div className="mb-3 relative">
                                            <label className="block text-textColor text-base mb-2">
                                                Address Line 2
                                            </label>
                                            <input
                                                type="text"
                                                name="addressLine2"
                                                value={schoolData.addressLine2}
                                                onChange={handleSchoolInputChange}
                                                placeholder="Enter Address Line 2"
                                                maxLength={100}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder focus:outline-none focus:border-primary ${isSubmitting ? "cursor-not-allowed opacity-50" : "border-inputPlaceholder"}`}
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="mb-3 relative">
                                            <label className="block text-textColor text-base mb-2">
                                                City<span className="text-red">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={schoolData.city}
                                                onChange={handleSchoolInputChange}
                                                placeholder="Enter City"
                                                maxLength={50}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder focus:outline-none focus:border-primary ${errors.city ? "border-red" : "border-inputPlaceholder"} ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.city && <p className="text-red text-sm mt-1">{errors.city}</p>}
                                        </div>
                                        <div className="mb-3 relative">
                                            <label className="block text-textColor text-base mb-2">
                                                State<span className="text-red">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={schoolData.state}
                                                onChange={handleSchoolInputChange}
                                                placeholder="Enter State"
                                                maxLength={50}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder focus:outline-none focus:border-primary ${errors.state ? "border-red" : "border-inputPlaceholder"} ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.state && <p className="text-red text-sm mt-1">{errors.state}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="mb-3 relative">
                                            <label className="block text-textColor text-base mb-2">
                                                Country<span className="text-red">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={schoolData.country}
                                                onChange={handleSchoolInputChange}
                                                placeholder="Enter Country"
                                                maxLength={50}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder focus:outline-none focus:border-primary ${errors.country ? "border-red" : "border-inputPlaceholder"} ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.country && <p className="text-red text-sm mt-1">{errors.country}</p>}
                                        </div>
                                        <div className="mb-3 relative">
                                            <label className="block text-textColor text-base mb-2">
                                                Pincode
                                            </label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={schoolData.pincode}
                                                onChange={handleSchoolInputChange}
                                                placeholder="Enter Pincode"
                                                maxLength={10}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder focus:outline-none focus:border-primary ${errors.pincode ? "border-red" : "border-inputPlaceholder"} ${isSubmitting ? "cursor-not-allowed opacity-50" : "border-inputPlaceholder"}`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.pincode && <p className="text-red text-sm mt-1">{errors.pincode}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-start mt-12">
                                        <button
                                            onClick={handleNext}
                                            className={`bg-primary text-white px-8 py-3 font-bold rounded-lg font-medium hover:bg-hover flex items-center gap-2 ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                            disabled={isSubmitting}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="mb-3 relative">
                                            <label className="block text-textColor text-base mb-2">
                                                First Name<span className="text-red">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={educatorData.firstName}
                                                onChange={handleEducatorInputChange}
                                                placeholder="Enter First Name"
                                                maxLength={50}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder focus:outline-none focus:border-primary ${errors.firstName ? "border-red" : "border-inputPlaceholder"} ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.firstName && (
                                                <p className="text-red text-sm mt-1">{errors.firstName}</p>
                                            )}
                                        </div>
                                        <div className="mb-3 relative">
                                            <label className="block text-textColor text-base mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={educatorData.lastName}
                                                onChange={handleEducatorInputChange}
                                                placeholder="Enter Last Name"
                                                maxLength={50}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder focus:outline-none focus:border-primary ${isSubmitting ? "cursor-not-allowed opacity-50" : "border-inputPlaceholder"}`}
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="mb-3 relative">
                                            <label className="block text-textColor text-base mb-2">
                                                Educator Phone
                                            </label>
                                            <PhoneInput
                                                international
                                                defaultCountry="IN"
                                                value={educatorData.educatorPhone}
                                                onChange={handleEducatorPhoneChange}
                                                placeholder="Enter Educator Phone"
                                                className={`phone-input-container ${errors.educatorPhone ? "border-red" : "border-inputPlaceholder"} ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.educatorPhone && (
                                                <p className="text-red text-sm mt-1">{errors.educatorPhone}</p>
                                            )}
                                        </div>
                                        <div className="mb-3 relative">
                                            <label className="block text-textColor text-base mb-2">
                                                Educator Email<span className="text-red">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="educatorEmail"
                                                value={educatorData.educatorEmail}
                                                onChange={handleEducatorInputChange}
                                                placeholder="Enter Educator Email"
                                                maxLength={100}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder focus:outline-none focus:border-primary ${errors.educatorEmail ? "border-red" : "border-inputPlaceholder"} ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.educatorEmail && (
                                                <p className="text-red text-sm mt-1">{errors.educatorEmail}</p>
                                            )}
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
                                                value={educatorData.loginId}
                                                onChange={handleEducatorInputChange}
                                                placeholder="Enter Login ID"
                                                maxLength={30}
                                                className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder focus:outline-none focus:border-primary ${errors.loginId ? "border-red" : "border-inputPlaceholder"} ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.loginId && (
                                                <p className="text-red text-sm mt-1">{errors.loginId}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-6 mt-12">
                                        <button
                                            onClick={handlePrevious}
                                            className={`border border-primary hover:bg-primary/10 text-textColor px-8 py-3 font-bold rounded-lg font-medium flex items-center gap-2 ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                            disabled={isSubmitting}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Previous
                                        </button>
                                        <button
                                            onClick={handleRegister}
                                            className={`bg-primary text-white px-8 py-3 font-bold rounded-lg font-medium hover:bg-hover flex items-center gap-2 ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="animate-spin" />
                                            ) : (
                                                <span className="font-bold">Register</span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Right Section - Fixed Image */}
            <div
                className="hidden lg:block fixed top-0 right-0 h-full w-[46%] bg-cover bg-center"
                style={{ backgroundImage: `url(${loginImage})` }}
            />

            {/* Success Modal */}
            <AnimatePresence onExitComplete={handleSuccessAnimationComplete}>
                {showSuccessModal && isSuccessVisible && (
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
                            className="bg-white rounded-lg w-full max-w-[500px] overflow-hidden flex flex-col sm:px-10 py-8"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex-1 px-8 py-6 text-center">
                                <p className="text-textColor text-lg mb-8">
                                    Your request has been sent to the Admin. You will receive a notification once it is approved.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleCloseSuccess}
                                    className="bg-primary hover:bg-hover text-white px-8 py-3 font-bold rounded-lg font-medium cursor-pointer"
                                >
                                    Ok
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EducatorRegistration;