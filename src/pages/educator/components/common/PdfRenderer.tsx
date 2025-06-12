import { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "../../../../config/constants/Animations/modalAnimation";
import Loader from '../../../admin/components/common/Loader';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

interface PdfRendererProps {
    file: string | File | null;
    onClose: () => void;
    initialPage?: number;
    className?: string;
}

const PdfRenderer: React.FC<PdfRendererProps> = ({
    file,
    onClose,
    initialPage = 1,
    className = ''
}) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(initialPage);
    const [pageInputValue, setPageInputValue] = useState<string>(initialPage.toString());
    const [scale, setScale] = useState<number>(1.0);
    const [rotation, setRotation] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pageWidth, setPageWidth] = useState<number>(800);
    const [isVisible, setIsVisible] = useState(true);

    // Calculate responsive page width
    useEffect(() => {
        const updatePageWidth = () => {
            const maxWidth = Math.min(800, window.innerWidth * 0.75);
            setPageWidth(maxWidth);
        };

        updatePageWidth();
        window.addEventListener('resize', updatePageWidth);
        return () => window.removeEventListener('resize', updatePageWidth);
    }, []);

    // Reset state when file changes
    useEffect(() => {
        if (file) {
            setPageNumber(initialPage);
            setPageInputValue(initialPage.toString());
            setScale(1.0);
            setRotation(0);
            setError(null);
            setIsLoading(true);
        }
    }, [file, initialPage]);

    const handleClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const handleAnimationComplete = useCallback(() => {
        if (!isVisible) {
            onClose();
        }
    }, [isVisible, onClose]);

    const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    }, [handleClose]);

    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [handleClose]);

    const handleNextPage = useCallback(() => {
        if (numPages && pageNumber < numPages) {
            const newPage = pageNumber + 1;
            setPageNumber(newPage);
            setPageInputValue(newPage.toString());
        }
    }, [numPages, pageNumber]);

    const handlePrevPage = useCallback(() => {
        if (pageNumber > 1) {
            const newPage = pageNumber - 1;
            setPageNumber(newPage);
            setPageInputValue(newPage.toString());
        }
    }, [pageNumber]);

    const handleZoomIn = useCallback(() => {
        setScale(prev => Math.min(prev + 0.25, 3.0));
    }, []);

    const handleZoomOut = useCallback(() => {
        setScale(prev => Math.max(prev - 0.25, 0.5));
    }, []);

    const handleRotate = useCallback(() => {
        setRotation(prev => (prev + 90) % 360);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!numPages) return;

            switch (e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    handlePrevPage();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    handleNextPage();
                    break;
                case '+':
                case '=':
                    e.preventDefault();
                    handleZoomIn();
                    break;
                case '-':
                    e.preventDefault();
                    handleZoomOut();
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    handleRotate();
                    break;
                case 'Home':
                    e.preventDefault();
                    setPageNumber(1);
                    setPageInputValue('1');
                    break;
                case 'End':
                    e.preventDefault();
                    setPageNumber(numPages);
                    setPageInputValue(numPages.toString());
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [numPages, pageNumber, handleNextPage, handlePrevPage, handleZoomIn, handleZoomOut, handleRotate]);

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setIsLoading(false);
        setError(null);

        // Ensure page number is within valid range
        if (initialPage > numPages) {
            setPageNumber(numPages);
            setPageInputValue(numPages.toString());
        }
    }, [initialPage]);

    const onDocumentLoadError = useCallback((error: Error) => {
        setError(`Failed to load PDF: ${error.message}`);
        setIsLoading(false);
        setNumPages(null);
    }, []);

    const handlePageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setPageInputValue(inputValue);

        // Navigate immediately if it's a valid page number
        const value = parseInt(inputValue, 10);
        if (!isNaN(value) && numPages && value >= 1 && value <= numPages) {
            setPageNumber(value);
        }
    }, [numPages]);

    const handlePageInputBlur = useCallback(() => {
        // Reset input to current page if the value is invalid
        const value = parseInt(pageInputValue, 10);
        if (isNaN(value) || !numPages || value < 1 || value > numPages) {
            setPageInputValue(pageNumber.toString());
        }
    }, [pageInputValue, numPages, pageNumber]);

    const handlePageInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
        } else if (e.key === 'Escape') {
            setPageInputValue(pageNumber.toString());
            (e.target as HTMLInputElement).blur();
        }
    }, [pageNumber]);

    // Error state
    if (!file || error) {
        return (
            <AnimatePresence onExitComplete={handleAnimationComplete}>
                {isVisible && (
                    <motion.div
                        className={`fixed inset-0 bg-black/40  backdrop-blur-xs z-90 flex items-center justify-center px-4 ${className}`}
                        onClick={handleBackdropClick}
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.1, ease: "easeOut" }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="error-title"
                    >
                        <motion.div
                            className="bg-white rounded-lg w-full max-w-[500px] overflow-hidden flex flex-col sm:px-10 py-4"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Sticky Header */}
                            <div className="bg-white px-8 py-6 flex justify-between items-center flex-shrink-0">
                                <h2 id="error-title" className="text-3xl font-bold text-textColor">
                                    {error ? "PDF Load Error" : "File Error"}
                                </h2>
                                <button
                                    onClick={handleClose}
                                    className="text-textColor hover:text-hover cursor-pointer  rounded"
                                    aria-label="Close dialog"
                                >
                                    <X className="h-7 w-7" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto px-8 py-6">
                                <p className="text-textColor text-base mb-6">
                                    {error || "This file type is not supported for viewing."}
                                </p>
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleClose}
                                        className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-hover transition-colors  cursor-pointer"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>

                            {/* Mobile swipe hint - Only visible on mobile */}
                            <div className="bg-inputBg border-inputBorder px-8 py-4 text-sm text-textColor border-t block md:hidden">
                                <div className="text-center">
                                    <span>← Swipe to navigate pages →</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    return (
        <AnimatePresence onExitComplete={handleAnimationComplete}>
            {isVisible && (
                <motion.div
                    className={`fixed inset-0 bg-black/40  backdrop-blur-xs z-50 flex items-center justify-center px-4 ${className}`}
                    onClick={handleBackdropClick}
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="pdf-title"
                >
                    <motion.div
                        className="bg-white rounded-lg w-full max-w-6xl overflow-hidden flex flex-col max-h-[95vh] shadow-2xl"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-inputPlaceholder">
                            <div></div>
                            <div className="flex items-center gap-2">
                                {/* Zoom Controls */}
                                <div className="flex items-center gap-1 mr-4">
                                    <button
                                        onClick={handleZoomOut}
                                        disabled={scale <= 0.5}
                                        className="p-2 rounded-md text-textColor hover:bg-hover/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors  cursor-pointer"
                                        aria-label="Zoom out"
                                        title="Zoom out (-)"
                                    >
                                        <ZoomOut className="h-4 w-4" />
                                    </button>
                                    <span className="text-sm text-textColor min-w-[3rem] text-center">
                                        {Math.round(scale * 100)}%
                                    </span>
                                    <button
                                        onClick={handleZoomIn}
                                        disabled={scale >= 3.0}
                                        className="p-2 rounded-md text-textColor hover:bg-hover/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors  cursor-pointer"
                                        aria-label="Zoom in"
                                        title="Zoom in (+)"
                                    >
                                        <ZoomIn className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Rotate Button */}
                                <button
                                    onClick={handleRotate}
                                    className="p-2 rounded-md text-textColor hover:bg-hover/10 transition-colors  cursor-pointer mr-4"
                                    aria-label="Rotate page"
                                    title="Rotate page (R)"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                                    </svg>
                                </button>

                                {/* Close Button */}
                                <button
                                    onClick={handleClose}
                                    className="p-2 rounded-md text-textColor hover:text-hover transition-colors  cursor-pointer"
                                    aria-label="Close PDF viewer"
                                    title="Close (Esc)"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        {/* PDF Content - Fixed scrolling container */}
                        <div
                            className="flex-grow bg-inputBg border-inputBorder overflow-auto"
                            style={{
                                scrollBehavior: 'smooth'
                            }}
                        >
                            {/* Container with proper padding and centering */}
                            <div
                                className="min-h-full flex items-center justify-center p-6"
                                style={{
                                    minWidth: scale > 1 ? `${pageWidth * scale + 48}px` : '100%'
                                }}
                            >
                                {isLoading && (
                                    <Loader message='Loading PDF...' />
                                )}

                                <Document
                                    file={file}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    onLoadError={onDocumentLoadError}
                                    className="flex justify-center"
                                    loading=""
                                    error=""
                                >
                                    <Page
                                        pageNumber={pageNumber}
                                        renderAnnotationLayer={true}
                                        renderTextLayer={true}
                                        width={pageWidth * scale}
                                        rotate={rotation}
                                        className="shadow-lg border border-inputPlaceholder"
                                        loading={
                                            <div
                                                className="flex items-center justify-center bg-white border border-inputPlaceholder shadow-lg"
                                                style={{
                                                    width: pageWidth * scale,
                                                    height: pageWidth * scale * 1.4,
                                                    minHeight: '400px'
                                                }}
                                            >
                                                <div className="animate-pulse text-textColor">Loading page...</div>
                                            </div>
                                        }
                                        error={
                                            <div
                                                className="flex items-center justify-center bg-white border border-red-200 shadow-lg text-red-600"
                                                style={{
                                                    width: pageWidth * scale,
                                                    height: pageWidth * scale * 1.4,
                                                    minHeight: '400px'
                                                }}
                                            >
                                                Failed to load page
                                            </div>
                                        }
                                    />
                                </Document>
                            </div>
                        </div>

                        {/* Navigation Footer */}
                        {numPages && (
                            <div className="bg-white px-6 py-4 flex justify-center items-center gap-4 border-t border-inputPlaceholder">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={pageNumber <= 1}
                                    className="px-3 py-2 rounded-md border border-inputPlaceholder text-textColor hover:bg-hover/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer "
                                    aria-label="Previous page"
                                    title="Previous page (←)"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>

                                <div className="flex items-center gap-2">
                                    <span className="text-textColor hidden md:block">Page</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max={numPages}
                                        value={pageInputValue}
                                        onChange={handlePageInputChange}
                                        onBlur={handlePageInputBlur}
                                        onKeyDown={handlePageInputKeyDown}
                                        className="w-16 px-2 py-1 text-center border border-inputPlaceholder rounded  text-textColor cursor-pointer"
                                        aria-label="Current page number"
                                    />
                                    <span className="text-textColor">of {numPages}</span>
                                </div>

                                <button
                                    onClick={handleNextPage}
                                    disabled={pageNumber >= numPages}
                                    className="px-3 py-2 rounded-md bg-primary text-white hover:bg-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer "
                                    aria-label="Next page"
                                    title="Next page (→)"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        )}

                        {/* Keyboard shortcuts help - Hidden on mobile */}
                        <div className="bg-inputBg border-inputBorder px-6 py-2 text-xs text-textColor border-t hidden md:block">
                            <div className="flex flex-wrap gap-4 justify-center">
                                <span>← → Navigate pages</span>
                                <span>+ - Zoom</span>
                                <span>R Rotate</span>
                                <span>Esc Close</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PdfRenderer;