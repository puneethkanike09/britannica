import React from 'react';
import ViewIcon from '../../../../assets/dashboard/Educator/home-page/view.svg';
import DownloadIcon from '../../../../assets/dashboard/Educator/home-page/download.svg';
import { DocumentCardWithLoadingProps } from '../../../../types/educator';
import { motion } from "framer-motion";
import { modalVariants } from '../../../../config/constants/Animations/modalAnimation';

// Theme color mapping for educator themes
export const THEME_COLOR_MAP: Record<string, string> = {
    "Environment": "#38761d",
    "AI and Robotics": "#999999",
    "Social-Emotional Learning": "#46bdc6",
    "Cultural Development": "#a61c00",
    "Entrepreneurship": "#6fa8dc",
    "Vocational Education": "#8e7cc3",
};

// Add reverseOverlay prop to the type
interface DocumentCardWithLoadingPropsWithReverse extends DocumentCardWithLoadingProps {
    reverseOverlay?: boolean;
}

const DocumentCard: React.FC<DocumentCardWithLoadingPropsWithReverse> = ({ title, onView, onDownload, viewLoading, downloadLoading, thumbnail, color, reverseOverlay }) => {
    return (
        <motion.div
            className="w-full max-w-xs rounded-lg overflow-hidden group relative"
            style={{ backgroundColor: color || '#fff' }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {/* Overlay logic: if reverseOverlay, show thumbnail by default and color on hover; else, color by default and thumbnail on hover */}
            {thumbnail && !reverseOverlay && (
                <div
                    className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        backgroundImage: `url(${thumbnail})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            )}
            {thumbnail && reverseOverlay && (
                <>
                    <div
                        className="absolute inset-0 z-0 opacity-100 group-hover:opacity-0 transition-opacity duration-300"
                        style={{
                            backgroundImage: `url(${thumbnail})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <div
                        className="absolute inset-0 z-10 opacity-0 group-hover:opacity-80 transition-opacity duration-300"
                        style={{
                            backgroundColor: color || '#fff',
                        }}
                    />
                </>
            )}
            <div className="relative pb-4 px-6 pt-6 z-10">
                <div className="absolute top-0 right-4">
                    <p className="bg-red text-white text-xs font-bold px-4 py-1">
                        PDF
                    </p>
                </div>
                <h3 className="text-2xl font-black text-white leading-tight min-h-[6.5rem] flex items-center" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
                    {title}
                </h3>
            </div>
            <div className="py-4 px-6 bg-white relative z-10">
                <div className="flex gap-3">
                    <button
                        onClick={onView}
                        className={`flex-1 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer ${viewLoading ? 'opacity-60 cursor-not-allowed' : ''} ${!color ? 'bg-primary hover:bg-hover' : ''}`}
                        disabled={viewLoading}
                        style={color ? { backgroundColor: color } : {}}
                    >
                        {viewLoading ? (
                            <span className="loader h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <img src={ViewIcon} alt="View Icon" className="h-4 w-4" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.7))' }} />
                        )}
                        <span style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>View</span>
                    </button>
                    <button
                        onClick={onDownload}
                        className={`flex-1 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer ${downloadLoading ? 'opacity-60 cursor-not-allowed' : ''} ${!color ? 'bg-primary hover:bg-hover' : ''}`}
                        disabled={downloadLoading}
                        style={color ? { backgroundColor: color } : {}}
                    >
                        {downloadLoading ? (
                            <span className="loader h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <img src={DownloadIcon} alt="Download Icon" className="h-4 w-4" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.7))' }} />
                        )}
                        <span style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>Download</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default DocumentCard;