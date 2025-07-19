import { X } from "lucide-react";
import { Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import Loader from "../../../../components/common/Loader";
import { PblFileServices } from "../../../../services/admin/pblFileServices";

interface ViewPblFileModalProps {
    onClose: () => void;
    file: { file_id: string };
}

export default function ViewPblFileModal({ onClose, file }: ViewPblFileModalProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [pblFileDetails, setPblFileDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        PblFileServices.fetchPblFileById(file.file_id).then((res) => {
            if (mounted) {
                if ((res.error === false || res.error === "false") && res.pbl_file) {
                    setPblFileDetails(res.pbl_file);
                } else {
                    setError(res.message || 'Failed to load PBL file details');
                }
                setLoading(false);
            }
        }).catch(() => {
            if (mounted) {
                setError('Failed to load PBL file details');
                setLoading(false);
            }
        });
        return () => { mounted = false; };
    }, [file.file_id]);

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, []);

    // Download image as blob
    const handleDownloadImage = async () => {
        if (!selectedImageUrl) return;
        try {
            const response = await fetch(selectedImageUrl, { mode: 'cors' });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            // Try to get filename from URL, fallback to 'image.jpg'
            const filename = selectedImageUrl.split('/').pop()?.split('?')[0] || 'image.jpg';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            // Optionally show a toast or error
        }
    };

    return (
        <>
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
                                <h2 className="text-3xl font-bold text-secondary">PBL File Details</h2>
                                <button
                                    aria-label="Close"
                                    onClick={handleClose}
                                    className="text-textColor hover:text-hover cursor-pointer"
                                >
                                    <X className="h-7 w-7" />
                                </button>
                            </div>
                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto px-8 py-6">
                                {loading ? (
                                    <Loader message="Loading PBL file details..." />
                                ) : error ? (
                                    <div className="text-red text-center py-8">{error}</div>
                                ) : pblFileDetails ? (
                                    <div className="border border-lightGray rounded-lg overflow-hidden mb-6">
                                        {/* First Row */}
                                        <div className="grid grid-cols-1 md:grid-cols-3">
                                            <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                                <div className="text-textColor mb-2">Grade</div>
                                                <div className="text-primary font-medium break-all">{pblFileDetails.grade_name || '-'}</div>
                                            </div>
                                            <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                                <div className="text-textColor mb-2">Theme</div>
                                                <div className="text-primary font-medium break-all">{pblFileDetails.theme_name || '-'}</div>
                                            </div>
                                            <div className="p-6 border-b border-lightGray md:border-b-0">
                                                <div className="text-textColor mb-2">Type</div>
                                                <div className="text-primary font-medium break-all">{pblFileDetails.user_access_type_name || '-'}</div>
                                            </div>
                                        </div>
                                        {/* Second Row */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 md:border-t md border-lightGray">
                                            {/* PBL File Name Column */}
                                            <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                                <div className="text-textColor mb-2">PBL File Name</div>
                                                <div className="text-primary font-medium break-all">{pblFileDetails.pbl_name || '-'}</div>
                                            </div>
                                            {/* PDF File Column */}
                                            <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                                <div className="text-textColor mb-2">PDF File</div>
                                                <div className="text-primary font-medium break-all">
                                                    {pblFileDetails.file_url ? (
                                                        <div 
                                                            className="relative group cursor-pointer bg-gray-50 border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all duration-200"
                                                            onClick={() => window.open(pblFileDetails.file_url, '_blank')}
                                                        >
                                                            <div className="flex flex-col items-center">
                                                                <svg className="w-12 h-12 text-red-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                                </svg>
                                                                <span className="text-sm font-medium text-gray-700">PDF Document</span>
                                                            </div>
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-lg transition-all duration-200 flex items-center justify-center">
                                                                <div className="opacity-0 group-hover:opacity-100 bg-white shadow-lg rounded-full p-2 transition-opacity duration-200">
                                                                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500">No file available</span>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Image Column */}
                                            <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-textColor">Image</span>
                                                </div>
                                                {pblFileDetails.image_url ? (
                                                    <div 
                                                        onClick={() => {
                                                            setSelectedImageUrl(pblFileDetails.image_url);
                                                            setShowImageModal(true);
                                                        }}
                                                        className="relative group cursor-pointer bg-gray-50 border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all duration-200"
                                                    >
                                                        <img
                                                            src={pblFileDetails.image_url}
                                                            alt="PBL File Preview"
                                                            className="h-28 w-full object-cover rounded-lg transition-all duration-200"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all duration-200 flex items-center justify-center">
                                                            <div className="opacity-0 group-hover:opacity-100 bg-white shadow-lg rounded-full p-2 transition-opacity duration-200">
                                                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-28 w-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                                                        <span className="text-gray-400 text-sm">No image attached</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Image Modal */}
            <AnimatePresence>
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
                            {/* Sticky Header with only close icon */}
                            <div className="bg-white px-8 py-6 flex justify-end items-center flex-shrink-0 gap-4">
                                {selectedImageUrl && (
                                    <button
                                        onClick={handleDownloadImage}
                                        className="text-textColor hover:text-hover cursor-pointer"
                                        aria-label="Download Image"
                                    >
                                        <Download className="h-7 w-7" />
                                    </button>
                                )}
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
        </>
    );
}