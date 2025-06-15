import { useEffect, useState } from 'react';
import BackgroundImage from '../../../assets/dashboard/Educator/home-page/kids.png';
import { pdfjs } from 'react-pdf';
import PdfRenderer from '../components/common/PdfRenderer';
import toast from 'react-hot-toast';
import { EducatorDashboardService } from '../../../services/educatorDashboardServices';
import { apiClient } from '../../../utils/apiClient';
import Select from '../components/common/Select';
import DocumentCard from '../components/common/PdfCards';
import Topbar from '../components/layout/topbar';
import { PdfProject } from '../../../types/educator';
import { Loader2 } from 'lucide-react';

// Set pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

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
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [currentPdfFile, setCurrentPdfFile] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmittingDropdowns, setIsSubmittingDropdowns] = useState(false);
    const [isLoadingFiles, setIsLoadingFiles] = useState(false);
    const [gradeOptions, setGradeOptions] = useState<{ value: string; label: string }[]>([]);
    const [themeOptions, setThemeOptions] = useState<{ value: string; label: string }[]>([]);
    const [typeOptions, setTypeOptions] = useState<{ value: string; label: string }[]>([]);
    const [pdfProjects, setPdfProjects] = useState<PdfProject[]>([]);
    const [viewLoadingId, setViewLoadingId] = useState<string | number | null>(null);
    const [downloadLoadingId, setDownloadLoadingId] = useState<string | number | null>(null);

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
            .catch(() => {
                toast.error('Failed to load grades');
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
            .catch(() => {
                toast.error('Failed to load themes');
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
            .catch(() => {
                toast.error('Failed to load types');
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
            const fetchFiles = async () => {
                const token = '';
                const res = await EducatorDashboardService.fetchPblFiles({
                    token,
                    grade_id: selectedGrade,
                    theme_id: selectedTheme,
                    user_access_type_id: selectedType,
                });
                if (res.error === false || res.error === 'false') {
                    // Map API response to PdfProject[]
                    const files = (res.pbl_file || []).map((file: {
                        pbl_id: string | number;
                        pbl_file_path: string;
                        pbl_name: string;
                    }) => ({
                        id: file.pbl_id,
                        title: file.pbl_name,
                        type: 'PDF',
                        file: file.pbl_file_path // Store the filePath as provided by the API
                    }));
                    setPdfProjects(files);
                    setShowResults(true);
                    if (files.length === 0) {
                        throw new Error('No files found with this filter');
                    }
                    return 'Files loaded successfully!';
                } else {
                    setPdfProjects([]);
                    throw new Error(res.message || 'No files found');
                }
            };
            toast.promise(
                fetchFiles(),
                {
                    loading: 'Loading files...',
                    success: (msg) => msg,
                    error: (err) => err.message || 'Failed to load files',
                }
            ).finally(() => {
                setIsSubmitting(false);
                setIsLoadingFiles(false);
            });
        }
    };

    const handleView = async (pblId: string | number) => {
        const project = pdfProjects.find((p) => p.id === pblId);
        if (!project?.file) {
            toast.error('File path not found');
            return;
        }
        setViewLoadingId(pblId);
        try {
            const viewResponse = await apiClient.getFileViewUrl(project.file);
            if (viewResponse.success && viewResponse.data) {
                setCurrentPdfFile(viewResponse.data);
                setShowPdfViewer(true);
            } else {
                throw new Error(viewResponse.message || 'Failed to get view URL');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to view file');
        } finally {
            setViewLoadingId(null);
        }
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
            if (downloadResponse.success && downloadResponse.data) {
                const link = document.createElement('a');
                link.href = downloadResponse.data;
                link.download = `${title}.pdf`;
                link.click();
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
            <div className="min-h-screen relative overflow-hidden">
                <div
                    className="fixed inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${BackgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                    aria-hidden="true"
                />
                <div className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-24 sm:pt-24 lg:pt-32 pb-8 sm:pb-8 lg:pb-8">
                    <h2 className="text-primary text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-center">
                        Welcome to the Educators Dashboard!
                    </h2>
                    <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-8 sm:mb-12 text-center">
                        Project Based Learning
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-4 items-start justify-center mb-8 w-full max-w-4xl">
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
                    {showResults && (
                        pdfProjects.length === 0 ? (
                            <div className="text-center text-lg text-red font-semibold py-8">No files found with this filter.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-items-center w-full md:max-w-2xl lg:max-w-5xl px-4">
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
                        )
                    )}
                </div>
                {showPdfViewer && (
                    <PdfRenderer file={currentPdfFile} onClose={() => setShowPdfViewer(false)} />
                )}
            </div>
        </>
    );
};

export default EducatorDashboard;