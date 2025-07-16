import { X, Loader2, Upload, FileText, Trash2 } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import { PblFileServices } from "../../../../services/admin/pblFileServices";
import Select from "../components/common/Select";
import { Download } from "lucide-react";

interface EditPblFileModalProps {
    onClose: () => void;
    file: { file_id: string };
    onFileUpdated: (file: any) => void;
}

export default function EditPblFileModal({ onClose, file, onFileUpdated }: EditPblFileModalProps) {
    const [formData, setFormData] = useState({
        file_id: file.file_id,
        name: "",
        description: "",
        grade: "",
        theme: "",
        type: "",
        file: null as File | null,
        image: null as File | null,
    });
    const [pblFileDetails, setPblFileDetails] = useState<any>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [optionsLoaded, setOptionsLoaded] = useState(false);
    const [errors, setErrors] = useState({
        name: "",
        description: "",
        file: "",
        image: "",
        grade: "",
        theme: "",
        type: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [dragActive, setDragActive] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isSubmittingDropdowns, setIsSubmittingDropdowns] = useState(false);
    const [gradeOptions, setGradeOptions] = useState<{ value: string; label: string }[]>([]);
    const [themeOptions, setThemeOptions] = useState<{ value: string; label: string }[]>([]);
    const [typeOptions, setTypeOptions] = useState<{ value: string; label: string }[]>([]);
    const [prefilled, setPrefilled] = useState(false);
    const [deleteImage, setDeleteImage] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    // Add drag state for image
    const [dragActiveImage, setDragActiveImage] = useState(false);

    // Fetch PBL file details
    useEffect(() => {
        PblFileServices.fetchPblFileById(file.file_id).then((res) => {
            if ((res.error === false || res.error === "false") && res.pbl_file) {
                setPblFileDetails(res.pbl_file);
                setFileUrl(res.pbl_file.file_url || null);
                setImageUrl(res.pbl_file.image_url || null);
            }
        });
    }, [file.file_id]);

    // Fetch dropdown options
    useEffect(() => {
        setIsSubmittingDropdowns(true);
        Promise.all([
            PblFileServices.fetchGrades(),
            PblFileServices.fetchThemes(),
            PblFileServices.fetchUserAccessTypes()
        ]).then(([gradesRes, themesRes, typesRes]) => {
            if ('grade' in gradesRes && (gradesRes.error === false || gradesRes.error === 'false')) {
                setGradeOptions((gradesRes.grade ?? []).map((g: { grade_id: string; grade_name: string }) => ({ value: g.grade_id, label: g.grade_name })));
            }
            if ('theme' in themesRes && (themesRes.error === false || themesRes.error === 'false')) {
                setThemeOptions((themesRes.theme ?? []).map((t: { theme_id: string; theme_name: string }) => ({ value: t.theme_id, label: t.theme_name })));
            }
            if ('user_access_type' in typesRes && (typesRes.error === false || typesRes.error === 'false')) {
                setTypeOptions((typesRes.user_access_type ?? []).map((t: { user_access_type_id: string; user_access_type_name: string }) => ({ value: t.user_access_type_id, label: t.user_access_type_name })));
            }
            setOptionsLoaded(true);
        }).finally(() => {
            setIsSubmittingDropdowns(false);
        });
    }, []);

    // Prefill selectors and fields after both options and details are loaded
    useEffect(() => {
        if (optionsLoaded && pblFileDetails && !prefilled) {
            setFormData((prev) => ({
                ...prev,
                name: pblFileDetails.pbl_name || "",
                description: pblFileDetails.description || "",
                grade: pblFileDetails.grade_id ? String(pblFileDetails.grade_id) : "",
                theme: pblFileDetails.theme_id ? String(pblFileDetails.theme_id) : "",
                type: pblFileDetails.user_access_type_id ? String(pblFileDetails.user_access_type_id) : "",
            }));
            setPrefilled(true);
        }
    }, [optionsLoaded, pblFileDetails, prefilled]);

    const handleClose = useCallback(() => {
        if (isSubmitting) return;
        setIsVisible(false);
        setDeleteImage(false); // Reset on close/cancel
    }, [isSubmitting]);

    const handleAnimationComplete = () => {
        if (!isVisible) onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isSubmitting) return;
        if (e.target === e.currentTarget) handleClose();
    };

    const handleInputChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) setErrors((prev) => ({ ...prev, [name]: "" }));
        setOpenDropdown(null);
    };

    const handleFileChange = (file: File | null) => {
        if (file && file.type !== "application/pdf") {
            setErrors((prev) => ({ ...prev, file: "Only PDF files are allowed" }));
            setFormData((prev) => ({ ...prev, file: null }));
        } else {
            setErrors((prev) => ({ ...prev, file: "" }));
            setFormData((prev) => ({ ...prev, file }));
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleFileChange(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const removeFile = () => {
        setFormData((prev) => ({ ...prev, file: null }));
        setErrors((prev) => ({ ...prev, file: "" }));
    };

    // Image uploader handlers
    const handleImageChange = (file: File | null) => {
        if (file && !file.type.startsWith("image/")) {
            setErrors((prev) => ({ ...prev, image: "Only image files are allowed" }));
            setFormData((prev) => ({ ...prev, image: null }));
        } else {
            setErrors((prev) => ({ ...prev, image: "" }));
            setFormData((prev) => ({ ...prev, image: file }));
            setDeleteImage(false); // Reset deleteImage if a new image is uploaded
        }
    };
    const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleImageChange(file);
    };
    const removeImage = () => {
        setFormData((prev) => ({ ...prev, image: null }));
        setErrors((prev) => ({ ...prev, image: "" }));
        setDeleteImage(true); // Mark image for deletion on save
        setImageUrl(null); // Remove preview immediately
    };

    // Add drag handlers for image
    const handleImageDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActiveImage(true);
        } else if (e.type === "dragleave") {
            setDragActiveImage(false);
        }
    };
    const handleImageDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActiveImage(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageChange(e.dataTransfer.files[0]);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const validateForm = () => {
        const newErrors = { name: "", description: "", file: "", image: "", grade: "", theme: "", type: "" };
        let isValid = true;
        if (!formData.name.trim()) {
            newErrors.name = "File name is required";
            isValid = false;
        } else if (formData.name.length < 2 || formData.name.length > 50) {
            newErrors.name = "Name must be 2-50 characters";
            isValid = false;
        }
        if (formData.description.trim() && formData.description.length > 200) {
            newErrors.description = "Description must be 200 characters or less";
            isValid = false;
        }
        // File validation (required)
        if (!formData.file && !fileUrl) {
            newErrors.file = "PDF file is required";
            isValid = false;
        } else if (formData.file && formData.file.type !== "application/pdf") {
            newErrors.file = "Only PDF files are allowed";
            isValid = false;
        }
        // Image validation (optional in edit)
        if (formData.image && !formData.image.type.startsWith("image/")) {
            newErrors.image = "Only image files are allowed";
            isValid = false;
        }
        if (!formData.grade) {
            newErrors.grade = "Grade is required";
            isValid = false;
        }
        if (!formData.theme) {
            newErrors.theme = "Theme is required";
            isValid = false;
        }
        if (!formData.type) {
            newErrors.type = "Type is required";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                const response = await PblFileServices.updatePblFile({
                    file_id: formData.file_id,
                    file: formData.file,
                    grade_id: formData.grade,
                    theme_id: formData.theme,
                    user_access_type_id: formData.type,
                    title: formData.name.trim(),
                    desc: formData.description.trim(),
                    image: formData.image,
                    deleteImage, // Pass the flag
                } as {
                    file_id: string;
                    file: File | null;
                    grade_id: string;
                    theme_id: string;
                    user_access_type_id: string;
                    title: string;
                    desc: string;
                    image: File | null;
                    deleteImage?: boolean;
                });
                if (response.error === false || response.error === "false") {
                    toast.success(response.message || "File updated successfully");
                    onFileUpdated({ ...formData });
                    setIsSubmitting(false);
                    handleClose();
                } else {
                    toast.error(response.message || "Failed to update file");
                    setIsSubmitting(false);
                }
            } catch (error) {
                toast.error("Failed to update file");
                setIsSubmitting(false);
            }
        }
    };

    const handleDropdownToggle = (dropdownId: string) => {
        if (isSubmitting) return;
        setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
    };

    const handleErrorClear = (field: string) => {
        setErrors((prev) => ({ ...prev, [field]: "" }));
        setOpenDropdown(null);
    };

    useEffect(() => {
        if (!openDropdown) return;
        const handleBackdropClick = (e: MouseEvent) => {
            const dropdowns = document.querySelectorAll('.custom-select-dropdown');
            let clickedInside = false;
            dropdowns.forEach((dropdown) => {
                if (dropdown.contains(e.target as Node)) {
                    clickedInside = true;
                }
            });
            if (!clickedInside) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleBackdropClick);
        return () => {
            document.removeEventListener('mousedown', handleBackdropClick);
        };
    }, [openDropdown]);

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
                        <div className="bg-white px-8 py-6 flex justify-between items-center flex-shrink-0">
                            <h2 className="text-3xl font-bold text-secondary">Edit PBL File</h2>
                            <button
                                aria-label="Close"
                                onClick={handleClose}
                                className={`text-textColor hover:text-hover ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                disabled={isSubmitting}
                            >
                                <X className="h-7 w-7" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            Grade<span className="text-red">*</span>
                                        </label>
                                        <Select
                                            value={formData.grade}
                                            onValueChange={(value) => handleInputChange('grade', value)}
                                            placeholder="Grade"
                                            options={gradeOptions}
                                            isOpen={openDropdown === 'grade'}
                                            onToggle={() => handleDropdownToggle('grade')}
                                            error={errors.grade}
                                            isSubmitting={isSubmitting}
                                            isSubmittingDropdowns={isSubmittingDropdowns}
                                            onErrorClear={() => handleErrorClear('grade')}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            Theme<span className="text-red">*</span>
                                        </label>
                                        <Select
                                            value={formData.theme}
                                            onValueChange={(value) => handleInputChange('theme', value)}
                                            placeholder="Theme"
                                            options={themeOptions}
                                            isOpen={openDropdown === 'theme'}
                                            onToggle={() => handleDropdownToggle('theme')}
                                            error={errors.theme}
                                            isSubmitting={isSubmitting}
                                            isSubmittingDropdowns={isSubmittingDropdowns}
                                            onErrorClear={() => handleErrorClear('theme')}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            Type<span className="text-red">*</span>
                                        </label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(value) => handleInputChange('type', value)}
                                            placeholder="Type"
                                            options={typeOptions}
                                            isOpen={openDropdown === 'type'}
                                            onToggle={() => handleDropdownToggle('type')}
                                            error={errors.type}
                                            isSubmitting={isSubmitting}
                                            isSubmittingDropdowns={isSubmittingDropdowns}
                                            onErrorClear={() => handleErrorClear('type')}
                                            disabled={true}
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-textColor text-base mb-3">
                                        Upload PDF File<span className="text-red">*</span>
                                    </label>
                                    {!formData.file && fileUrl ? (
                                        <div className="border border-inputBorder rounded-lg p-4 bg-inputBg flex items-center gap-4">
                                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download/View PDF</a>
                                            <button
                                                type="button"
                                                onClick={() => setFileUrl(null)}
                                                className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                                disabled={isSubmitting}
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ) : !formData.file ? (
                                        <div
                                            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                                ? 'border-primary bg-primary/5'
                                                : errors.file
                                                    ? 'border-red bg-red/5'
                                                    : 'border-inputBorder bg-inputBg hover:border-primary/50'
                                                } ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            onClick={() => !isSubmitting && document.getElementById('file-input')?.click()}
                                        >
                                            <input
                                                id="file-input"
                                                type="file"
                                                accept="application/pdf"
                                                onChange={handleFileInput}
                                                className="hidden"
                                                disabled={isSubmitting}
                                            />
                                            <Upload className="mx-auto h-12 w-12 text-inputPlaceholder mb-4" />
                                            <p className="text-textColor font-medium mb-2">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-inputPlaceholder text-sm">
                                                PDF files only (Max 10MB)
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="border border-inputBorder rounded-lg p-4 bg-inputBg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-shrink-0">
                                                        <FileText className="h-8 w-8 text-red-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-textColor truncate">
                                                            {formData.file.name}
                                                        </p>
                                                        <p className="text-sm text-inputPlaceholder">
                                                            {formatFileSize(formData.file.size)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={removeFile}
                                                    className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 transition-colors"
                                                    disabled={isSubmitting}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {errors.file && <p className="text-red text-sm mt-1">{errors.file}</p>}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-textColor text-base mb-3">
                                        Upload Image
                                    </label>
                                    {!formData.image && imageUrl ? (
                                        <div className="border border-inputBorder rounded-lg p-4 bg-inputBg flex items-center gap-4">
                                            <img
                                                src={imageUrl}
                                                alt="PBL File"
                                                className="h-12 w-12 object-cover rounded cursor-pointer"
                                                onClick={() => {
                                                    setSelectedImageUrl(imageUrl);
                                                    setShowImageModal(true);
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                                disabled={isSubmitting}
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ) : !formData.image ? (
                                        <div
                                            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActiveImage
                                                ? 'border-primary bg-primary/5'
                                                : errors.image
                                                    ? 'border-red bg-red/5'
                                                    : 'border-inputBorder bg-inputBg hover:border-primary/50'
                                                } ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                            onDragEnter={handleImageDrag}
                                            onDragLeave={handleImageDrag}
                                            onDragOver={handleImageDrag}
                                            onDrop={handleImageDrop}
                                            onClick={() => !isSubmitting && document.getElementById('image-input')?.click()}
                                        >
                                            <input
                                                id="image-input"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageInput}
                                                className="hidden"
                                                disabled={isSubmitting}
                                            />
                                            <Upload className="mx-auto h-12 w-12 text-inputPlaceholder mb-4" />
                                            <p className="text-textColor font-medium mb-2">
                                                Click to upload image or drag and drop
                                            </p>
                                            <p className="text-inputPlaceholder text-sm">
                                                Image files only (Max 5MB)
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="border border-inputBorder rounded-lg p-4 bg-inputBg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-shrink-0">
                                                        {/* Image preview */}
                                                        <img
                                                            src={formData.image ? URL.createObjectURL(formData.image) : undefined}
                                                            alt="Preview"
                                                            className="h-12 w-12 object-cover rounded cursor-pointer"
                                                            onClick={() => {
                                                                if (formData.image) {   
                                                                    setSelectedImageUrl(URL.createObjectURL(formData.image));
                                                                    setShowImageModal(true);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-textColor truncate">
                                                            {formData.image.name}
                                                        </p>
                                                        <p className="text-sm text-inputPlaceholder">
                                                            {formatFileSize(formData.image.size)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                                    disabled={isSubmitting}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {errors.image && <p className="text-red text-sm mt-1">{errors.image}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            Name<span className="text-red">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Enter File name"
                                            maxLength={50}
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.name ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
                                            disabled={isSubmitting}
                                        />
                                        {errors.name && <p className="text-red text-sm mt-1">{errors.name}</p>}
                                    </div>
                                    <div className="mb-3 relative">
                                        <label className="block text-textColor text-base mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            placeholder="Enter File Description"
                                            maxLength={200}
                                            rows={1}
                                            className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${errors.description ? 'border-red' : 'border-inputPlaceholder'} ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:border-primary`}
                                            disabled={isSubmitting}
                                        />
                                        {errors.description && <p className="text-red text-sm mt-1">{errors.description}</p>}
                                    </div>
                                </div>

                                <div className="mt-12">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className={`bg-primary text-white px-8 py-3 font-bold rounded-lg font-medium hover:bg-hover flex items-center gap-2 ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <span className="font-bold">Save</span>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            {showImageModal && selectedImageUrl && (
                <motion.div
                    className="fixed inset-0 bg-black/40 backdrop-blur-xs z-100 flex items-center justify-center px-4"
                    onClick={() => setShowImageModal(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                >
                    <motion.div
                        className="bg-white rounded-lg w-full max-w-[835px] max-h-[90vh] overflow-hidden flex flex-col sm:px-10 py-4"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Sticky Header with close and download icons */}
                        <div className="bg-white px-8 py-6 flex justify-end items-center flex-shrink-0 gap-4">
                            <button
                                onClick={async () => {
                                    if (!selectedImageUrl) return;
                                    // If local file
                                    if (formData.image && formData.image instanceof File && selectedImageUrl === URL.createObjectURL(formData.image)) {
                                        const url = URL.createObjectURL(formData.image);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = formData.image.name || 'image.jpg';
                                        document.body.appendChild(a);
                                        a.click();
                                        a.remove();
                                        URL.revokeObjectURL(url);
                                    } else {
                                        // If remote URL
                                        try {
                                            const response = await fetch(selectedImageUrl, { mode: 'cors' });
                                            const blob = await response.blob();
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            // Use the unique filename from the URL
                                            const filename = selectedImageUrl.split('/').pop()?.split('?')[0] || 'image.jpg';
                                            a.href = url;
                                            a.download = filename;
                                            document.body.appendChild(a);
                                            a.click();
                                            a.remove();
                                            URL.revokeObjectURL(url);
                                        } catch (err) {}
                                    }
                                }}
                                className="text-textColor hover:text-hover cursor-pointer"
                                aria-label="Download Image"
                            >
                                <Download className="h-7 w-7" />
                            </button>
                            <button
                                aria-label="Close"
                                onClick={() => setShowImageModal(false)}
                                className="text-textColor hover:text-hover cursor-pointer"
                            >
                                <X className="h-7 w-7" />
                            </button>
                        </div>
                        {/* Centered Image */}
                        <div className="flex-1 flex items-center justify-center px-8 py-6">
                            <img
                                src={selectedImageUrl}
                                alt="PBL File Large Preview"
                                className="max-h-[70vh] w-auto object-contain rounded shadow-lg"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}