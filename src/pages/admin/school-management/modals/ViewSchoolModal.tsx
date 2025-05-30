import { X } from "lucide-react";
import { SchoolActionModalProps } from "../../../../types/admin";



export default function ViewSchoolModal({ onClose, school }: SchoolActionModalProps) {
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 bg-opacity-50 z-90 flex items-center justify-center px-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg w-full max-w-[835px] max-h-[90vh] overflow-hidden flex flex-col sm:px-10 py-4">
                {/* Sticky Header */}
                <div className="bg-white px-8 py-6 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-3xl font-bold text-secondary">School Details</h2>
                    <button
                        onClick={onClose}
                        className="text-textColor hover:text-hover cursor-pointer"
                    >
                        <X className="h-7 w-7" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3">
                            <div className="border-r border-gray-300 border-b md:border-b-0 p-6">
                                <div className="text-textColor mb-2">School Name</div>
                                <div className="text-primary font-medium break-words">{school.name}</div>
                            </div>
                            <div className="border-r border-gray-300 border-b md:border-b-0 p-6">
                                <div className="text-textColor mb-2">Email Address</div>
                                <div className="text-primary font-medium break-words">{school.email}</div>
                            </div>
                            <div className="border-b border-gray-300 md:border-b-0 p-6">
                                <div className="text-textColor mb-2">Phone Number</div>
                                <div className="text-primary font-medium break-words">{school.phone}</div>
                            </div>
                        </div>
                        <div className="border-t border-gray-300 grid grid-cols-1 md:grid-cols-3">
                            <div className="border-r border-gray-300 border-b md:border-b-0 p-6">
                                <div className="text-textColor mb-2">Address</div>
                                <div className="text-primary font-medium break-words">
                                    {school.address || "Not provided"}
                                </div>
                            </div>
                            <div className="hidden md:block"></div>
                            <div className="hidden md:block"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}