// src/components/common/PdfRenderer.tsx
import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set workerSrc for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

interface PdfRendererProps {
    file: string | null;
    onClose: () => void;
}

const PdfRenderer: React.FC<PdfRendererProps> = ({ file, onClose }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Handle escape key to exit fullscreen
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreen) {
                exitFullscreen();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [isFullscreen]);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    const handleNextPage = () => {
        if (numPages && pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    const handlePrevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.25, 3.0));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.25, 0.5));
    };

    const handleResetZoom = () => {
        setScale(1.0);
    };

    const toggleFullscreen = async () => {
        if (!document.fullscreenElement) {
            const element = document.documentElement;
            if (element.requestFullscreen) {
                await element.requestFullscreen();
            }
        } else {
            await document.exitFullscreen();
        }
    };

    const exitFullscreen = async () => {
        if (document.fullscreenElement) {
            await document.exitFullscreen();
        }
    };

    const getPageWidth = () => {
        const isMobile = windowWidth < 768;
        const baseWidth = isMobile ? windowWidth * 0.9 : Math.min(800, windowWidth * 0.8);
        return baseWidth * scale;
    };

    if (!file) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                    <p className="text-gray-800 mb-4">This file type is not supported for viewing.</p>
                    <button
                        onClick={onClose}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`fixed inset-0 bg-black/50 flex flex-col z-50 ${isFullscreen ? 'bg-black' : ''}`}>
            {/* Header */}
            <div className="bg-white border-b shadow-sm p-2 md:p-4 flex-shrink-0">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 truncate">
                        PDF Viewer
                    </h3>
                    <div className="flex items-center gap-1 md:gap-2">
                        {/* Zoom Controls */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={handleZoomOut}
                                disabled={scale <= 0.5}
                                className="p-1 md:p-2 text-xs md:text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded border transition-colors"
                                title="Zoom Out"
                            >
                                -
                            </button>
                            <span className="px-2 py-1 text-xs md:text-sm font-mono min-w-[3rem] text-center">
                                {Math.round(scale * 100)}%
                            </span>
                            <button
                                onClick={handleZoomIn}
                                disabled={scale >= 3.0}
                                className="p-1 md:p-2 text-xs md:text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded border transition-colors"
                                title="Zoom In"
                            >
                                +
                            </button>
                            <button
                                onClick={handleResetZoom}
                                className="px-2 py-1 text-xs md:text-sm bg-white hover:bg-gray-50 rounded border transition-colors"
                                title="Reset Zoom"
                            >
                                Reset
                            </button>
                        </div>

                        {/* Fullscreen Toggle */}
                        <button
                            onClick={toggleFullscreen}
                            className="p-1 md:p-2 text-xs md:text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                        >
                            {isFullscreen ? "Exit FS" : "Full"}
                        </button>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="p-1 md:p-2 text-xs md:text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {/* PDF Content */}
            <div className="flex-1 overflow-auto bg-gray-100">
                <div className="flex justify-center items-start p-2 md:p-4 min-h-full">
                    <Document
                        file={file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        className="flex justify-center"
                        error={
                            <div className="text-red-500 p-4 bg-white rounded-lg shadow">
                                <p className="text-center">Failed to load PDF.</p>
                                <p className="text-sm text-center mt-2 text-gray-600">
                                    Please check if the file is valid and try again.
                                </p>
                            </div>
                        }
                        loading={
                            <div className="text-gray-600 p-4 bg-white rounded-lg shadow">
                                <p className="text-center">Loading PDF...</p>
                                <div className="mt-2 flex justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                </div>
                            </div>
                        }
                    >
                        <Page
                            pageNumber={pageNumber}
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                            className="shadow-lg rounded-lg overflow-hidden bg-white"
                            width={getPageWidth()}
                            scale={1} // We handle scaling through width
                        />
                    </Document>
                </div>
            </div>

            {/* Fixed Bottom Pagination */}
            {numPages && (
                <div className="bg-white border-t shadow-lg p-2 md:p-4 flex-shrink-0">
                    <div className="flex justify-center items-center gap-2 md:gap-4 max-w-screen-sm mx-auto">
                        <button
                            onClick={handlePrevPage}
                            disabled={pageNumber <= 1}
                            className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-2 md:px-4 md:py-2 rounded-lg transition-colors text-sm md:text-base"
                        >
                            ‹ Prev
                        </button>

                        {/* Page Input for Desktop, Simple display for Mobile */}
                        <div className="flex items-center gap-2 flex-1 justify-center">
                            {windowWidth >= 768 ? (
                                <>
                                    <span className="text-gray-600 text-sm">Page</span>
                                    <input
                                        type="number"
                                        value={pageNumber}
                                        onChange={(e) => {
                                            const page = parseInt(e.target.value);
                                            if (page >= 1 && page <= numPages) {
                                                setPageNumber(page);
                                            }
                                        }}
                                        min={1}
                                        max={numPages}
                                        className="w-16 px-2 py-1 text-center border rounded text-sm"
                                    />
                                    <span className="text-gray-600 text-sm">of {numPages}</span>
                                </>
                            ) : (
                                <span className="text-gray-800 font-medium text-sm">
                                    {pageNumber} / {numPages}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={handleNextPage}
                            disabled={pageNumber >= numPages}
                            className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-2 md:px-4 md:py-2 rounded-lg transition-colors text-sm md:text-base"
                        >
                            Next ›
                        </button>
                    </div>

                    {/* Page Jump Shortcuts for Desktop */}
                    {windowWidth >= 768 && numPages > 5 && (
                        <div className="flex justify-center gap-2 mt-2">
                            <button
                                onClick={() => setPageNumber(1)}
                                disabled={pageNumber === 1}
                                className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 disabled:text-gray-400 rounded transition-colors"
                            >
                                First
                            </button>
                            <button
                                onClick={() => setPageNumber(numPages)}
                                disabled={pageNumber === numPages}
                                className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 disabled:text-gray-400 rounded transition-colors"
                            >
                                Last
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PdfRenderer;