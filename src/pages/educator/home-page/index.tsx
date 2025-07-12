import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { EducatorDashboardService } from '../../../services/educator/EducatorDashboardService';
import { apiClient } from '../../../utils/apiClient';
import Select from '../components/common/Select';
import DocumentCard from '../components/common/PdfCards';
import Topbar from '../components/layout/topbar';
import { PdfProject } from '../../../types/educator';
import { Loader2 } from 'lucide-react';
import BritannicaHeroSection from '../components/common/Header';
import FlipCards from '../components/common/Footer';
import ScrollingBanner from '../components/common/Scroller';
import bgImage from '../../../assets/dashboard/Educator/home-page/bg.jpg'
import PdfRenderer from '../components/common/PdfRenderer';

const EducatorDashboard = () => {
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [errors, setErrors] = useState({
        grade: '',
        theme: '',
        type: '',
    });
    const [showResults, setShowResults] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmittingDropdowns, setIsSubmittingDropdowns] = useState(false);
    const [isLoadingFiles, setIsLoadingFiles] = useState(false);
    const [gradeOptions, setGradeOptions] = useState<{ value: string; label: string }[]>([]);
    const [themeOptions, setThemeOptions] = useState<{ value: string; label: string }[]>([]);
    const [typeOptions, setTypeOptions] = useState<{ value: string; label: string }[]>([]);
    const [pdfProjects, setPdfProjects] = useState<PdfProject[]>([]);
    const [viewLoadingId, setViewLoadingId] = useState<string | number | null>(null);
    const [downloadLoadingId, setDownloadLoadingId] = useState<string | number | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [showPdf, setShowPdf] = useState(false);

    // Fetch dropdown data on mount
    useEffect(() => {
        setIsSubmittingDropdowns(true);
        setIsSubmitting(true);

        // Fetch grades
        EducatorDashboardService.fetchGrades()
            .then((gradesRes) => {
                if ('grade' in gradesRes && (gradesRes.error === false || gradesRes.error === 'false')) {
                    setGradeOptions((gradesRes.grade ?? []).map((g: { grade_id: string; grade_name: string }) => ({ value: g.grade_id, label: g.grade_name })));
                } else {
                    toast.error(gradesRes.message || 'Failed to load grades');
                }
            })
            .catch((err) => {
                toast.error(err?.message || 'Failed to load grades');
            });

        // Fetch themes
        EducatorDashboardService.fetchThemes()
            .then((themesRes) => {
                if ('theme' in themesRes && (themesRes.error === false || themesRes.error === 'false')) {
                    setThemeOptions((themesRes.theme ?? []).map((t: { theme_id: string; theme_name: string }) => ({ value: t.theme_id, label: t.theme_name })));
                } else {
                    toast.error(themesRes.message || 'Failed to load themes');
                }
            })
            .catch((err) => {
                toast.error(err?.message || 'Failed to load themes');
            });

        // Fetch types
        EducatorDashboardService.fetchUserAccessTypes()
            .then((typesRes) => {
                if ('user_access_type' in typesRes && (typesRes.error === false || typesRes.error === 'false')) {
                    setTypeOptions((typesRes.user_access_type ?? []).map((t: { user_access_type_id: string; user_access_type_name: string }) => ({ value: t.user_access_type_id, label: t.user_access_type_name })));
                } else {
                    toast.error(typesRes.message || 'Failed to load types');
                }
            })
            .catch((err) => {
                toast.error(err?.message || 'Failed to load types');
            })
            .finally(() => {
                setIsSubmittingDropdowns(false);
                setIsSubmitting(false);
            });
    }, []);

    const validateForm = () => {
        const newErrors = {
            grade: '',
            theme: '',
            type: '',
        };
        let isValid = true;

        if (!selectedGrade) {
            newErrors.grade = 'Grade is required';
            isValid = false;
        }

        if (!selectedTheme) {
            newErrors.theme = 'Theme is required';
            isValid = false;
        }

        if (!selectedType) {
            newErrors.type = 'Type is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            setIsSubmitting(true);
            setShowResults(false);
            setIsLoadingFiles(true);

            try {
                const token = '';
                const res = await EducatorDashboardService.fetchPblFiles({
                    token,
                    grade_id: selectedGrade,
                    theme_id: selectedTheme,
                    user_access_type_id: selectedType,
                });

                if (res.error === false || res.error === 'false') {
                    const files = (res.pbl_file || []).map((file: {
                        pbl_id: string | number;
                        pbl_file_path: string;
                        pbl_name: string;
                    }) => ({
                        id: file.pbl_id,
                        title: file.pbl_name,
                        type: 'PDF',
                        file: file.pbl_file_path
                    }));
                    setPdfProjects(files);
                    setShowResults(true);
                } else {
                    setPdfProjects([]);
                    toast.error(res.message || 'No files found');
                }
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Failed to load files');
            } finally {
                setIsSubmitting(false);
                setIsLoadingFiles(false);
            }
        }
    };

    const handleView = async (pblId: string | number) => {
        const project = pdfProjects.find((p) => p.id === pblId);
        if (!project) {
            toast.error('File not found');
            return;
        }
        setViewLoadingId(pblId);
        try {
            // Fetch the PDF as a blob using GET
            const blob = await apiClient.fetchPdfBlobGet('/file/view', { filePath: project.file });
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
            setShowPdf(true);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to view file');
        } finally {
            setViewLoadingId(null);
        }
    };

    const handleClosePdf = () => {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
        setShowPdf(false);
    };

    const handleDownload = async (pblId: string | number, title: string) => {
        const project = pdfProjects.find((p) => p.id === pblId);
        if (!project?.file) {
            toast.error('File path not found');
            return;
        }
        setDownloadLoadingId(pblId);
        try {
            const downloadResponse = await apiClient.getFileDownloadUrl(project.file);
            if (downloadResponse.error === false || downloadResponse.error === 'false') {
                const response = await fetch(downloadResponse.data, { credentials: 'omit' });
                if (!response.ok) throw new Error('Failed to fetch file for download');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${title}.pdf`;
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(link);
                }, 100);
            } else {
                throw new Error(downloadResponse.message || 'Failed to get download URL');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to download file');
        } finally {
            setDownloadLoadingId(null);
        }
    };

    const handleDropdownToggle = (dropdownId: string) => {
        if (isSubmitting) return;
        setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
    };

    const handleErrorClear = (field: string) => {
        setErrors((prev) => ({ ...prev, [field]: '' }));
        setOpenDropdown(null);
    };

    useEffect(() => {
        if (!openDropdown) return;
        const handleBackdropClick = (e: MouseEvent) => {
            const dropdowns = document.querySelectorAll('.custom-select-dropdown');
            let clickedInside = false;
            dropdowns.forEach((dropdown) => {
                if (dropdown.contains(e.target as Node)) {
                    clickedInside = true;
                }
            });
            if (!clickedInside) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleBackdropClick);
        return () => {
            document.removeEventListener('mousedown', handleBackdropClick);
        };
    }, [openDropdown]);



    return (
        <>
            <Topbar />
            <BritannicaHeroSection />
            <div
                className="relative py-28"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="relative flex flex-col items-center justify-start px-4 sm:px-6 max-w-[1500px] mx-auto">
                    <div className="flex flex-col sm:flex-row gap-4 items-start justify-center w-full max-w-7xl mb-8">
                        <Select
                            value={selectedTheme}
                            onValueChange={setSelectedTheme}
                            placeholder="Theme"
                            options={themeOptions}
                            isOpen={openDropdown === 'theme'}
                            onToggle={() => handleDropdownToggle('theme')}
                            error={errors.theme}
                            isSubmitting={isSubmitting || isLoadingFiles}
                            isSubmittingDropdowns={isSubmittingDropdowns}
                            onErrorClear={handleErrorClear}
                        />
                        <Select
                            value={selectedGrade}
                            onValueChange={setSelectedGrade}
                            placeholder="Grade"
                            options={gradeOptions}
                            isOpen={openDropdown === 'grade'}
                            onToggle={() => handleDropdownToggle('grade')}
                            error={errors.grade}
                            isSubmitting={isSubmitting || isLoadingFiles}
                            isSubmittingDropdowns={isSubmittingDropdowns}
                            onErrorClear={handleErrorClear}
                        />
                        <Select
                            value={selectedType}
                            onValueChange={setSelectedType}
                            placeholder="Type"
                            options={typeOptions}
                            isOpen={openDropdown === 'type'}
                            onToggle={() => handleDropdownToggle('type')}
                            error={errors.type}
                            isSubmitting={isSubmitting || isLoadingFiles}
                            isSubmittingDropdowns={isSubmittingDropdowns}
                            onErrorClear={handleErrorClear}
                        />
                        <div className="relative w-full sm:w-auto">
                            <button
                                onClick={handleSubmit}
                                className={`bg-primary hover:bg-hover text-white px-6 py-3 font-bold text-xl rounded-lg w-full sm:w-auto flex items-center justify-center gap-2 ${(isSubmitting || isLoadingFiles) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                disabled={isSubmitting || isLoadingFiles}
                            >
                                {(isLoadingFiles || isSubmitting) ? (
                                    <>
                                        <Loader2 className="animate-spin" />
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* PDF Results Section */}
                    {showResults && (
                        <div className="w-full mb-8">
                            {pdfProjects.length === 0 ? (
                                <div className="text-center text-lg text-red-500 font-semibold py-8">No files found with this filter.</div>
                            ) : (
                                <div className="flex flex-wrap gap-6 justify-center w-full px-4">
                                    {pdfProjects.map((project) => (
                                        <DocumentCard
                                            key={project.id}
                                            title={project.title}
                                            onView={() => handleView(project.id)}
                                            onDownload={() => handleDownload(project.id, project.title)}
                                            viewLoading={viewLoadingId === project.id}
                                            downloadLoading={downloadLoadingId === project.id}
                                        />
                                    ))}
                                </div>
                            )}
                            {/* PDF Renderer Modal */}
                            {showPdf && pdfUrl && (
                                <PdfRenderer file={pdfUrl} onClose={handleClosePdf} />
                            )}
                        </div>
                    )}

                    {/* Inspirational Quote Section */}
                    <div className="w-full pt-6 text-center">
                        <p className="text-xl text-textColor font-black leading-relaxed max-w-4xl mx-auto">
                            "Britannica Build offers Project-Based Learning—an experiential, inquiry-driven framework that engages learners in exploring real-world challenges through collaboration, creativity, and critical thinking."
                        </p>
                    </div>
                </div>
            </div>
            <FlipCards />
            <ScrollingBanner />
        </>
    );
};

export default EducatorDashboard;