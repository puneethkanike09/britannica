// import { X } from "lucide-react";
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { SchoolActionModalProps } from "../../../../types/admin";
// import { motion, AnimatePresence } from "framer-motion";
// import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";

// export default function DeleteSchoolModal({ onClose, school }: SchoolActionModalProps) {
//     const [isDeleting, setIsDeleting] = useState(false);
//     const [isVisible, setIsVisible] = useState(true);

//     const handleClose = () => {
//         if (isDeleting) return;
//         setIsVisible(false);
//     };

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
//     }, [isDeleting]);

//     const handleDelete = () => {
//         setIsDeleting(true);
//         toast.promise(
//             new Promise((resolve) => {
//                 setTimeout(() => {
//                     resolve('School deleted successfully!');
//                 }, 2000);
//             }),
//             {
//                 loading: 'Deleting school...',
//                 success: () => {
//                     setIsDeleting(false);
//                     handleClose();
//                     return 'School deleted successfully!';
//                 },
//                 error: (err) => {
//                     setIsDeleting(false);
//                     return `Error: ${err.message}`;
//                 }
//             }
//         );
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
//                             <h2 className="text-3xl font-bold text-secondary">Delete School</h2>
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
//                                 Are you sure you want to delete school <span className="font-bold text-darkGray">{school.name}</span>?
//                                 This action cannot be undone.
//                             </p>

//                             <div className="flex justify-start gap-4">
//                                 <button
//                                     onClick={handleClose}
//                                     className={`px-8 py-3 font-bold rounded-lg border border-lightGray text-gray hover:bg-primary/10 ${isDeleting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
//                                     disabled={isDeleting}
//                                 >
//                                     No, Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleDelete}
//                                     className={`px-8 py-3 font-bold rounded-lg bg-red text-white hover:bg-red/80 ${isDeleting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
//                                     disabled={isDeleting}
//                                 >
//                                     Yes, Delete
//                                 </button>
//                             </div>
//                         </div>
//                     </motion.div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );
// }