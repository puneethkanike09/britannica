import React from 'react';
import ViewIcon from '../../../../assets/dashboard/Educator/home-page/view.svg';
import DownloadIcon from '../../../../assets/dashboard/Educator/home-page/download.svg';
import { DocumentCardProps } from '../../../../types/teacher';

const DocumentCard: React.FC<DocumentCardProps> = ({ title, onView, onDownload }) => {
    return (
        <div className="w-full max-w-xs rounded-lg bg-white group">
            <div className="relative pb-4 px-6 pt-6">
                <div className="absolute top-[-2px] right-4">
                    <span className="bg-red text-white text-xs font-bold px-4 py-1">
                        PDF
                    </span>
                </div>
                <h3 className="text-2xl font-black text-secondary leading-tight min-h-[6.5rem] flex items-center">
                    {title}
                </h3>
            </div>
            <div className="pt-0 px-6 pb-6">
                <div className="flex gap-3">
                    <button
                        onClick={onView}
                        className="flex-1 bg-primary hover:bg-hover text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <img src={ViewIcon} alt="View Icon" className="h-4 w-4" />
                        View
                    </button>
                    <button
                        onClick={onDownload}
                        className="flex-1 bg-primary hover:bg-hover text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <img src={DownloadIcon} alt="Download Icon" className="h-4 w-4" />
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentCard;