import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from 'react';
import { TeacherActionModalProps } from "../../../../types/admin";

export default function DeleteTeacherModal({ onClose, teacher }: TeacherActionModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isDeleting) return;
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleDelete = () => {
        setIsDeleting(true);
        toast.promise(
            new Promise((resolve) => {
                setTimeout(() => {
                    // Simulate a successful API DELETE call
                    resolve('Teacher deleted successfully!');
                    // For error simulation, you could use:
                    // reject(new Error('Failed to delete teacher'));
                }, 2000); // Simulate 2-second API call
            }),
            {
                loading: 'Deleting teacher...',
                success: () => {
                    setIsDeleting(false);
                    onClose();
                    return 'Teacher deleted successfully!';
                },
                error: (err) => {
                    setIsDeleting(false);
                    return `Error: ${err.message}`;
                }
            }
        );
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 bg-opacity-50 z-90 flex items-center justify-center px-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg w-full max-w-[500px] overflow-hidden flex flex-col sm:px-10 py-4">
                {/* Sticky Header */}
                <div className="bg-white px-8 py-6 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-3xl font-bold text-secondary">Delete Teacher</h2>
                    <button
                        onClick={onClose}
                        className={`text-textColor hover:text-hover ${isDeleting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        disabled={isDeleting}
                    >
                        <X className="h-7 w-7" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-8 py-6">
                    <p className="text-gray-700 mb-6">
                        Are you sure you want to delete teacher <span className="font-medium text-gray-900">{`${teacher.firstName} ${teacher.lastName}`}</span>?
                        This action cannot be undone.
                    </p>

                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className={`px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 ${isDeleting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            disabled={isDeleting}
                        >
                            No, Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className={`px-6 py-2 rounded-lg bg-red text-white hover:bg-red/80 ${isDeleting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            disabled={isDeleting}
                        >
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}