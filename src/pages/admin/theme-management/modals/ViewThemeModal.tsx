import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import Loader from "../../../../components/common/Loader";
import { ThemeActionModalProps } from "../../../../types/admin/theme-management";
import { ThemeService } from "../../../../services/admin/themeService";

export default function ViewThemeModal({ onClose, theme }: ThemeActionModalProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [themeDetails, setThemeDetails] = useState<typeof theme | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        ThemeService.fetchThemeById(theme.theme_id).then((res) => {
            if (mounted) {
                if ((res.error === false || res.error === "false") && res.theme) {
                    setThemeDetails(res.theme || null);
                } else {
                    setError(res.message || 'Failed to load theme details');
                }
                setLoading(false);
            }
        }).catch(() => {
            if (mounted) {
                setError('Failed to load theme details');
                setLoading(false);
            }
        });
        return () => { mounted = false; };
    }, [theme.theme_id]);

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
                        className="bg-white rounded-lg w-full max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col sm:px-10 py-4"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Sticky Header */}
                        <div className="bg-white px-8 py-6 flex justify-between items-center flex-shrink-0">
                            <h2 className="text-3xl font-bold text-secondary">Theme Details</h2>
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
                                <Loader message="Loading Theme Details..." />
                            ) : error ? (
                                <div className="py-12 text-center text-red">{error}</div>
                            ) : themeDetails ? (
                                <div className="border border-lightGray rounded-lg overflow-hidden mb-6">
                                    {/* First Row */}
                                    <div className="grid grid-cols-1">
                                        <div className="p-6 border-b border-lightGray">
                                            <div className="text-textColor mb-2">Theme Name</div>
                                            <div className="text-primary font-medium break-words">{themeDetails.theme_name || '-'}</div>
                                        </div>
                                    </div>
                                    {/* Second Row */}
                                    <div className="grid grid-cols-1">
                                        <div className="p-6 border-b border-lightGray">
                                            <div className="text-textColor mb-2">Description</div>
                                            <div className="text-primary font-medium break-words">{themeDetails.description || '-'}</div>
                                        </div>
                                    </div>
                                    {/* Third Row: Theme Color */}
                                    <div className="grid grid-cols-1">
                                        <div className="p-6">
                                            <div className="text-textColor mb-2">Theme Color</div>
                                            <div className="flex items-center gap-2">
                                                <span style={{ backgroundColor: themeDetails.theme_color, width: 24, height: 24, display: 'inline-block', borderRadius: 4, border: 'none' }} />
                                                <span className="text-primary font-medium">{themeDetails.theme_color || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}