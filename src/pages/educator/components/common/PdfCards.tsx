import React from 'react';
import ViewIcon from '../../../../assets/dashboard/Educator/home-page/view.svg';
import DownloadIcon from '../../../../assets/dashboard/Educator/home-page/download.svg';
import { DocumentCardWithLoadingProps } from '../../../../types/educator';

const DocumentCard: React.FC<DocumentCardWithLoadingProps> = ({ title, onView, onDownload, viewLoading, downloadLoading }) => {
    return (
        <div className="w-full max-w-xs rounded-lg bg-white group">
            <div className="relative pb-4 px-6 pt-6">
                <div className="absolute top-0 right-4">
                    <p className="bg-red text-white text-xs font-bold px-4 py-1">
                        PDF
                    </p>
                </div>
                <h3 className="text-2xl font-black text-textColor leading-tight min-h-[6.5rem] flex items-center">
                    {title}
                </h3>
            </div>
            <div className="pt-0 px-6 pb-6">
                <div className="flex gap-3">
                    <button
                        onClick={onView}
                        className={`flex-1 bg-primary hover:bg-hover text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer ${viewLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        disabled={viewLoading}
                    >
                        {viewLoading ? (
                            <span className="loader h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <img src={ViewIcon} alt="View Icon" className="h-4 w-4" />
                        )}
                        View
                    </button>
                    <button
                        onClick={onDownload}
                        className={`flex-1 bg-primary hover:bg-hover text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer ${downloadLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        disabled={downloadLoading}
                    >
                        {downloadLoading ? (
                            <span className="loader h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <img src={DownloadIcon} alt="Download Icon" className="h-4 w-4" />
                        )}
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentCard;