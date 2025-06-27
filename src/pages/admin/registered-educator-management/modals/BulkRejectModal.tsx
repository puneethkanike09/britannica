import React, { useState, useCallback } from 'react';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { backdropVariants, modalVariants } from '../../../../config/constants/Animations/modalAnimation';

interface Educator {
    educator_id: string;
    name: string;
    school_name: string;
    login_id: string;
}

interface BulkRejectModalProps {
    onClose: () => void;
    educators: Educator[];
    onBulkReject: (rejectedIds: string[], reason: string) => void;
}

const BulkRejectModal: React.FC<BulkRejectModalProps> = ({
    onClose,
    educators,
    onBulkReject,
}) => {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = useCallback(() => {
        if (isRejecting) return;
        setIsVisible(false);
    }, [isRejecting]);

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isRejecting) return;
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value.replace(/[^a-zA-Z0-9\s,.-]/g, '').slice(0, 200);
        setReason(value);
        if (error) {
            setError('');
        }
    };

    const validateForm = () => {
        if (reason.length > 200) {
            setError('Reason must be 200 characters or less');
            return false;
        }
        return true;
    };

    const handleReject = () => {
        if (!validateForm()) return;

        setIsRejecting(true);
        setTimeout(() => {
            try {
                const rejectedIds = educators.map(edu => edu.educator_id);
                onBulkReject(rejectedIds, reason.trim());
                toast.success(`Rejected ${educators.length} educator${educators.length !== 1 ? 's' : ''} successfully!`);
                setIsRejecting(false);
                handleClose();
            } catch (error) {
                console.error(error);
                toast.error('Failed to reject educators');
                setIsRejecting(false);
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
                    transition={{ duration: 0.1, ease: 'easeOut' }}
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
                            <h2 className="text-3xl font-bold text-secondary">Reject Educators</h2>
                            <button
                                onClick={handleClose}
                                className={`text-textColor hover:text-hover ${isRejecting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                disabled={isRejecting}
                            >
                                <X className="h-7 w-7" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            <p className="text-textColor text-base mb-6">
                                Are you sure you want to reject the registration of the following{' '}
                                <span className="font-bold">{educators.length}</span> educator{educators.length !== 1 ? 's' : ''}?
                            </p>

                            <div className="rounded-lg p-2 max-h-60 overflow-y-auto bg-inputBg border border-inputBorder">
                                <div className="flex flex-wrap gap-2">
                                    {educators.map((educator) => (
                                        <div
                                            key={educator.educator_id}
                                            className="px-4 py-2 bg-white border border-primary text-textColor rounded-lg text-sm font-medium whitespace-nowrap hover:bg-primary/10 "
                                        >
                                            {educator.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 space-y-6">
                                <div className="relative">
                                    <label className="block text-textColor text-base mb-2">
                                        Reason for Rejection (Optional)
                                    </label>
                                    <textarea
                                        value={reason}
                                        onChange={handleInputChange}
                                        placeholder="Provide a reason for rejecting the educators' registrations"
                                        maxLength={200}
                                        rows={4}
                                        className={`p-4 py-3 text-textColor w-full border rounded-lg text-base bg-inputBg border-inputBorder placeholder:text-inputPlaceholder ${error ? 'border-red' : 'border-inputBorder'
                                            } ${isRejecting ? 'cursor-not-allowed opacity-50' : ''}`}
                                        disabled={isRejecting}
                                    />
                                    {error && <p className="text-red text-sm mt-1">{error}</p>}
                                </div>

                                <div className="flex justify-start gap-4 mt-12">
                                    <button
                                        onClick={handleClose}
                                        className={`px-8 py-3 font-bold rounded-lg border border-primary text-textColor hover:bg-primary/10 ${isRejecting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                            }`}
                                        disabled={isRejecting}
                                    >
                                        No, Cancel
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        className={`bg-red text-white px-8 py-3 font-bold rounded-lg hover:bg-red/80 flex items-center gap-2 ${isRejecting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                            }`}
                                        disabled={isRejecting}
                                    >
                                        {isRejecting ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <span className="font-bold">Yes, Reject All</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BulkRejectModal;