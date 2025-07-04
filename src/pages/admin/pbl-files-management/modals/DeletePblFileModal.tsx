import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";

interface DeletePblFileModalProps {
    onClose: () => void;
    file: { file_id: string; name: string; description: string; grade: string; theme: string; type: string; file: File | null };
    onDeleted?: (file_id: string) => void;
}

export default function DeletePblFileModal({ onClose, file, onDeleted }: DeletePblFileModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isDeleting) handleClose();
        };
        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [isDeleting]);

    const handleClose = () => {
        if (isDeleting) return;
        setIsVisible(false);
    };

    const handleAnimationComplete = () => {
        if (!isVisible) onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isDeleting) return;
        if (e.target === e.currentTarget) handleClose();
    };

    const handleDelete = () => {
        setIsDeleting(true);
        setTimeout(() => {
            try {
                if (onDeleted) onDeleted(file.file_id);
                toast.success("File deleted successfully!");
                setIsDeleting(false);
                handleClose();
            } catch (error) {
                console.log(error);
                toast.error("Failed to delete file");
                setIsDeleting(false);
            }
        }, 1000);
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
                        className="bg-white rounded-lg w-full max-w-[500px] overflow-hidden flex flex-col sm:px-10 py-4"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white px-8 py-6 flex justify-between items-center flex-shrink-0">
                            <h2 className="text-3xl font-bold text-textColor">Delete PBL File</h2>
                            <button
                                aria-label="Close"
                                onClick={handleClose}
                                className={`text-textColor hover:text-hover ${isDeleting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                disabled={isDeleting}
                            >
                                <X className="h-7 w-7" />
                            </button>
                        </div>
                        <div className="px-8 py-6">
                            <p className="text-textColor mb-6">
                                Are you sure you want to delete the file <span className="font-bold">{file.name}</span>?
                            </p>
                            <div className="flex justify-start gap-4">
                                <button
                                    onClick={handleClose}
                                    className={`px-8 py-3 font-bold rounded-lg border border-lightGray text-gray hover:bg-primary/10 ${isDeleting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                    disabled={isDeleting}
                                >
                                    No, Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className={`px-8 py-3 font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2 ${isDeleting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? <Loader2 className="animate-spin" /> : "Yes, Delete"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}