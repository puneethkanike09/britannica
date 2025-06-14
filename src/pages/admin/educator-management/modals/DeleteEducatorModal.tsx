// import { X } from "lucide-react";
// import { useState, useEffect, useCallback } from 'react';
// import { EducatorActionModalProps } from "../../../../types/admin";
// import { motion, AnimatePresence } from "framer-motion";
// import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";

// export default function DeleteEducatorModal({ onClose, educator }: EducatorActionModalProps) {
//     const [isDeleting, setIsDeleting] = useState(false);
//     const [isVisible, setIsVisible] = useState(true);

//     const handleClose = useCallback(() => {
//         if (isDeleting) return;
//         setIsVisible(false);
//     }, [isDeleting]);

//     const handleAnimationComplete = () => {
//         if (!isVisible) {
//             onClose();
//         }
//     };

//     const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
//         if (isDeleting) return;
//         if (e.target === e.currentTarget) {
//             handleClose();
//         }
//     };

//     useEffect(() => {
//         const handleEscKey = (e: KeyboardEvent) => {
//             if (e.key === 'Escape' && !isDeleting) {
//                 handleClose();
//             }
//         };

//         document.addEventListener('keydown', handleEscKey);
//         return () => document.removeEventListener('keydown', handleEscKey);
//     }, [isDeleting, handleClose]);

//     const handleDelete = () => {
//         setIsDeleting(true);
//         // TODO: Call backend delete API here
//         setTimeout(() => {
//             setIsDeleting(false);
//             handleClose();
//         }, 1000);
//     };

//     return (
//         <AnimatePresence onExitComplete={handleAnimationComplete}>
//             {isVisible && (
//                 <motion.div
//                     className="fixed inset-0 bg-black/40  backdrop-blur-xs z-90 flex items-center justify-center px-4"
//                     onClick={handleBackdropClick}
//                     variants={backdropVariants}
//                     initial="hidden"
//                     animate="visible"
//                     exit="exit"
//                     transition={{ duration: 0.1, ease: "easeOut" }}
//                 >
//                     <motion.div
//                         className="bg-white rounded-lg w-full max-w-[500px] overflow-hidden flex flex-col sm:px-10 py-4"
//                         variants={modalVariants}
//                         initial="hidden"
//                         animate="visible"
//                         exit="exit"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         {/* Sticky Header */}
//                         <div className="bg-white px-8 py-6 flex justify-between items-center flex-shrink-0">
//                             <h2 className="text-3xl font-bold text-secondary">Delete Educator</h2>
//                             <button
//                                 onClick={handleClose}
//                                 className={`text-textColor hover:text-hover ${isDeleting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
//                                 disabled={isDeleting}
//                             >
//                                 <X className="h-7 w-7" />
//                             </button>
//                         </div>

//                         {/* Content */}
//                         <div className="px-8 py-6">
//                             <p className="text-textColor mb-6">
//                                 Are you sure you want to delete educator <span className="font-medium text-darkGray">{educator.teacher_name}</span>? This action cannot be undone.
//                             </p>

//                             <div className="flex justify-end gap-4">
//                                 <button
//                                     onClick={handleClose}
//                                     className="btn btn-secondary"
//                                     disabled={isDeleting}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleDelete}
//                                     className="btn btn-danger"
//                                     disabled={isDeleting}
//                                 >
//                                     {isDeleting ? 'Deleting...' : 'Delete'}
//                                 </button>
//                             </div>
//                         </div>
//                     </motion.div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );
// }