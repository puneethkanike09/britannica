import React from 'react';
import ViewIcon from '../../../../assets/dashboard/Educator/home-page/view.svg';
import DownloadIcon from '../../../../assets/dashboard/Educator/home-page/download.svg';
import { DocumentCardWithLoadingProps } from '../../../../types/educator';
import { motion } from "framer-motion";
import { modalVariants } from '../../../../config/constants/Animations/modalAnimation';
import defaultThemeImage from '../../../../assets/dashboard/Educator/home-page/defaultThemeImage.jpg';

const DocumentCard: React.FC<DocumentCardWithLoadingProps & { onViewCloudfront?: () => void }> = ({ title, onDownload, viewLoading, downloadLoading, image_url, theme_color, onViewCloudfront }) => {
    const backgroundImage = image_url || defaultThemeImage;
    return (
        <motion.div
            className="w-full max-w-xs rounded-lg overflow-hidden group shadow-lg relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Light black overlay for background image, hidden when theme color overlay is active */}
            <div
                className="absolute inset-0 transition-opacity duration-300 pointer-events-none z-10 group-hover:opacity-0"
                style={{ background: 'rgba(0,0,0,0.40)' }}
            />
            {/* Overlay for theme color on hover */}
            {theme_color && (
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
                    style={{ backgroundColor: theme_color }}
                />
            )}
            <div
                className="relative pb-4 px-6 pt-6 transition-colors duration-200 z-20 h-40 overflow-hidden"
            >
                {/* Background image only for this div */}
                <div
                    className="absolute inset-0 w-full h-full z-0"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
                {/* Light black overlay for background image, hidden when theme color overlay is active */}
                <div
                    className="absolute inset-0 transition-opacity duration-300 pointer-events-none z-10 group-hover:opacity-0"
                    style={{ background: 'rgba(0,0,0,0.40)' }}
                />
                {/* Overlay for theme color on hover */}
                {theme_color && (
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
                        style={{ backgroundColor: theme_color }}
                    />
                )}
                <div className="absolute top-0 right-4 z-30">
                    <p className="bg-red text-white text-xs font-bold px-4 py-1">
                        PDF
                    </p>
                </div>
                <h3 className="text-2xl font-black text-white leading-tight min-h-[6.5rem] flex items-center relative z-30" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
                    {title}
                </h3>
            </div>
            <div className="py-4 px-6 bg-white z-20 relative">
                <div className="flex gap-3">
                    <button
                        onClick={onViewCloudfront}
                        className={`flex-1 bg-primary hover:bg-hover text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer ${viewLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        disabled={viewLoading}
                        style={{ ...(theme_color ? { backgroundColor: theme_color, border: 'none' } : {}), textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
                    >
                        {viewLoading ? (
                            <span className="loader h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <img src={ViewIcon} alt="View Icon" className="h-4 w-4" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.7))' }} />
                        )}
                        View
                    </button>
                    <button
                        onClick={onDownload}
                        className={`flex-1 bg-primary hover:bg-hover text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer ${downloadLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        disabled={downloadLoading}
                        style={{ ...(theme_color ? { backgroundColor: theme_color, border: 'none' } : {}), textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
                    >
                        {downloadLoading ? (
                            <span className="loader h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <img src={DownloadIcon} alt="Download Icon" className="h-4 w-4" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.7))' }} />
                        )}
                        Download
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default DocumentCard;