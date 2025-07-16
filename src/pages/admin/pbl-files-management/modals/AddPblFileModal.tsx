import { X, Loader2, Upload, FileText, Trash2 } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import { PblFileServices } from "../../../../services/admin/pblFileServices";
import Select from "../components/common/Select";
import { Download } from "lucide-react";

interface AddPblFileModalProps {
    onClose: () => void;
    onFileAdded: (file: { name: string; description: string; grade: string; theme: string; type: string; file: File }) => void;
}

export default function AddPblFileModal({ onClose, onFileAdded }: AddPblFileModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        grade: "",
        theme: "",
        type: "",
        file: null as File | null,
        image: null as File | null,
    });

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
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    // Add drag state for image
    const [dragActiveImage, setDragActiveImage] = useState(false);

    useEffect(() => {
        setIsSubmittingDropdowns(true);

        PblFileServices.fetchGrades()
            .then((gradesRes) => {
                if ('grade' in gradesRes && (gradesRes.error === false || gradesRes.error === 'false')) {
                    setGradeOptions((gradesRes.grade ?? []).map((g: { grade_id: string; grade_name: string }) => ({ value: g.grade_id, label: g.grade_name })));
                } else {
                    toast.error(gradesRes.message || 'Failed to load grades');
                }
            })
            .catch(() => {
                toast.error('Failed to load grades');
            });

        PblFileServices.fetchThemes()
            .then((themesRes) => {
                if ('theme' in themesRes && (themesRes.error === false || themesRes.error === 'false')) {
                    setThemeOptions((themesRes.theme ?? []).map((t: { theme_id: string; theme_name: string }) => ({ value: t.theme_id, label: t.theme_name })));
                } else {
                    toast.error(themesRes.message || 'Failed to load themes');
                }
            })
            .catch(() => {
                toast.error('Failed to load themes');
            });

        PblFileServices.fetchUserAccessTypes()
            .then((typesRes) => {
                if ('user_access_type' in typesRes && (typesRes.error === false || typesRes.error === 'false')) {
                    setTypeOptions((typesRes.user_access_type ?? []).map((t: { user_access_type_id: string; user_access_type_name: string }) => ({ value: t.user_access_type_id, label: t.user_access_type_name })));
                } else {
                    toast.error(typesRes.message || 'Failed to load types');
                }
            })
            .catch(() => {
                toast.error('Failed to load types');
            })
            .finally(() => {
                setIsSubmittingDropdowns(false);
            });
    }, []);

    const handleClose = useCallback(() => {
        if (isSubmitting) return;
        setIsVisible(false);
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
            setFormData((prev) => ({ ...prev, file: file }));
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
        }
    };

    const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleImageChange(file);
    };

    // Drag-and-drop handlers for image upload
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

    const removeImage = () => {
        setFormData((prev) => ({ ...prev, image: null }));
        setErrors((prev) => ({ ...prev, image: "" }));
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

        if (!formData.file) {
            newErrors.file = "PDF file is required";
            isValid = false;
        }
        if (!formData.image) {
            newErrors.image = "Image file is required";
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

    const handleAddFile = async () => {
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                const response = await PblFileServices.uploadPblFile({
                    file: formData.file!,
                    grade_id: formData.grade,
                    theme_id: formData.theme,
                    user_access_type_id: formData.type,
                    title: formData.name.trim(),
                    desc: formData.description.trim(),
                    image: formData.image!,
                });
                if (response.error === false || response.error === "false") {
                    toast.success(response.message || "File uploaded successfully");
                    onFileAdded({
                        name: formData.name.trim(),
                        description: formData.description.trim(),
                        grade: formData.grade,
                        theme: formData.theme,
                        type: formData.type,
                        file: formData.file!,
                    });
                    handleClose();
                } else {
                    toast.error(response.message || "Failed to add file");
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to add file");
            } finally {
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
                            <h2 className="text-3xl font-bold text-secondary">Add PBL File</h2>
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
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-textColor text-base mb-3">
                                        Upload PDF File<span className="text-red">*</span>
                                    </label>

                                    {!formData.file ? (
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
                                                    className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                                    disabled={isSubmitting}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {errors.file && <p className="text-red text-sm mt-1">{errors.file}</p>}
                                </div>
                                {/* Image uploader */}
                                <div className="mb-6">
                                    <label className="block text-textColor text-base mb-3">
                                        Upload Image<span className="text-red">*</span>
                                    </label>
                                    {!formData.image ? (
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
                                        onClick={handleAddFile}
                                        className={`bg-primary text-white px-8 py-3 font-bold rounded-lg font-medium hover:bg-hover flex items-center gap-2 ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                                            }`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <span className="font-bold">Add PBL File</span>}
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
                                    const imgFile = formData.image;
                                    if (!(imgFile instanceof File)) return;
                                    try {
                                        const url = window.URL.createObjectURL(imgFile);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = imgFile.name || 'image.jpg';
                                        document.body.appendChild(a);
                                        a.click();
                                        a.remove();
                                        window.URL.revokeObjectURL(url);
                                    } catch (err) {}
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
