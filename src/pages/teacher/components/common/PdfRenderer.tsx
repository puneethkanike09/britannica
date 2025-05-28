import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { X } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfRendererProps {
    file: string | null;
    onClose: () => void;
}

const PdfRenderer: React.FC<PdfRendererProps> = ({ file, onClose }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);

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

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!file) {
        return (
            <div
                className="fixed inset-0 bg-black/40 bg-opacity-50 z-90 flex items-center justify-center px-4"
                onClick={handleBackdropClick}
            >
                <div className="bg-white rounded-lg w-full max-w-[500px] overflow-hidden flex flex-col sm:px-10 py-4">
                    <div className="bg-white px-8 py-6 flex justify-between items-center border-b border-gray-100 flex-shrink-0">
                        <h2 className="text-3xl font-bold text-textColor">Error</h2>
                        <button
                            onClick={onClose}
                            className="text-textColor hover:text-textColor/90 cursor-pointer"
                        >
                            <X className="h-7 w-7" />
                        </button>
                    </div>
                    <div className="px-8 py-6">
                        <p className="text-gray-700 mb-6">
                            This file type is not supported for viewing.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/80 cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 bg-black/40 bg-opacity-50 z-90 flex items-center justify-center px-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-white px-8 py-6 flex justify-between items-center border-b border-gray-100 flex-shrink-0">
                    <div>
                        {/* just for align the cross icon right side */}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-textColor hover:text-textColor/90 cursor-pointer"
                    >
                        <X className="h-7 w-7" />
                    </button>
                </div>
                <div className="px-8 py-6 overflow-auto flex-grow">
                    <div className="flex justify-center">
                        <Document
                            file={file}
                            onLoadSuccess={onDocumentLoadSuccess}
                            className="flex justify-center"
                            error={<p className="text-gray-700">Failed to load PDF.</p>}
                            loading={<p className="text-gray-700">Loading PDF...</p>}
                        >
                            <Page
                                pageNumber={pageNumber}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                                className="shadow-md"
                                width={Math.min(800, window.innerWidth * 0.8)}
                            />
                        </Document>
                    </div>
                </div>
                {numPages && (
                    <div className="bg-white px-8 py-6 flex justify-center items-center gap-4 border-t border-gray-100 flex-shrink-0">
                        <button
                            onClick={handlePrevPage}
                            disabled={pageNumber <= 1}
                            className={`px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 ${pageNumber <= 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        >
                            Previous
                        </button>
                        <p className="text-gray-700">
                            Page {pageNumber} of {numPages}
                        </p>
                        <button
                            onClick={handleNextPage}
                            disabled={pageNumber >= numPages}
                            className={`px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/80 ${pageNumber >= numPages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PdfRenderer;