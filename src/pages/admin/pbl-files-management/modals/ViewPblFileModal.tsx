import { X } from "lucide-react";
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
                                        <div className="grid grid-cols-1 md:grid-cols-3 md:border-t md:border-lightGray">
                                            <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                                <div className="text-textColor mb-2">File</div>
                                                <div className="text-primary font-medium break-all">
                                                    {pblFileDetails.pbl_name || '-'}
                                                    {pblFileDetails.file_url && (
                                                        <>
                                                            <br />
                                                            <a href={pblFileDetails.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download/View PDF</a>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="p-6 border-b border-lightGray md:border-b-0 md:border-r md:border-lightGray">
                                                <div className="text-textColor mb-2">Image</div>
                                                <div className="text-primary font-medium break-all">
                                                    {pblFileDetails.image_url ? (
                                                        <img
                                                            src={pblFileDetails.image_url}
                                                            alt="PBL File"
                                                            className="h-24 w-24 object-cover rounded border cursor-pointer"
                                                            onClick={() => {
                                                                setSelectedImageUrl(pblFileDetails.image_url);
                                                                setShowImageModal(true);
                                                            }}
                                                        />
                                                    ) : '-'}
                                                </div>
                                            </div>
                                            <div className="p-6 border-b border-lightGray md:border-b-0">
                                                <div className="text-textColor mb-2">ID</div>
                                                <div className="text-primary font-medium break-all">{pblFileDetails.pbl_id || '-'}</div>
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
                            className="bg-white rounded-lg p-4 max-w-2xl w-full flex flex-col items-center relative"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                aria-label="Close"
                                onClick={() => setShowImageModal(false)}
                                className="absolute top-2 right-2 text-textColor hover:text-hover cursor-pointer z-10"
                            >
                                <X className="h-7 w-7" />
                            </button>
                            <img
                                src={selectedImageUrl}
                                alt="PBL File Large Preview"
                                className="max-h-[70vh] w-auto object-contain rounded shadow-lg"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}