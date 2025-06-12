import { useEffect, useState } from 'react';
import BackgroundImage from '../../../assets/dashboard/Educator/home-page/kids.png';
import { pdfjs } from 'react-pdf';
import PdfRenderer from '../components/common/PdfRenderer';
import toast from 'react-hot-toast';
import { EducatorDashboardService } from '../../../services/educatorDashboardServices';
import Select from '../components/common/Select';
import DocumentCard from '../components/common/PdfCards';
import Topbar from '../components/layout/topbar';
import { PdfProject } from '../../../types/educator';

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
    const [gradeOptions, setGradeOptions] = useState<{ value: string; label: string }[]>([]);
    const [themeOptions, setThemeOptions] = useState<{ value: string; label: string }[]>([]);
    const [typeOptions, setTypeOptions] = useState<{ value: string; label: string }[]>([]);
    const [pdfProjects, setPdfProjects] = useState<PdfProject[]>([]);
    const [viewLoadingId, setViewLoadingId] = useState<string | number | null>(null);

    // Fetch dropdown data on mount
    useEffect(() => {
        setIsSubmitting(true);
        EducatorDashboardService.fetchAllDropdownsSequentially()
            .then(([gradesRes, themesRes, typesRes]) => {
                // gradesRes is always the result of fetchGrades
                if ('grade' in gradesRes && (gradesRes.error === false || gradesRes.error === 'false')) {
                    setGradeOptions((gradesRes.grade ?? []).map((g: { grade_id: string; grade_name: string }) => ({ value: g.grade_id, label: g.grade_name })));
                } else {
                    toast.error(gradesRes.message || 'Failed to load grades');
                }
                // themesRes is always the result of fetchThemes
                if ('theme' in themesRes && (themesRes.error === false || themesRes.error === 'false')) {
                    setThemeOptions((themesRes.theme ?? []).map((t: { theme_id: string; theme_name: string }) => ({ value: t.theme_id, label: t.theme_name })));
                } else {
                    toast.error(themesRes.message || 'Failed to load themes');
                }
                // typesRes is always the result of fetchUserAccessTypes
                if ('user_access_type' in typesRes && (typesRes.error === false || typesRes.error === 'false')) {
                    setTypeOptions((typesRes.user_access_type ?? []).map((t: { user_access_type_id: string; user_access_type_name: string }) => ({ value: t.user_access_type_id, label: t.user_access_type_name })));
                } else {
                    toast.error(typesRes.message || 'Failed to load types');
                }
            })
            .catch(() => {
                toast.error('Failed to load dropdown data');
            })
            .finally(() => setIsSubmitting(false));
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
                        file: `/${file.pbl_file_path}` // Ensure leading slash for static serving
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
            });
        }
    };

    const handleDownload = (title: string) => {
        console.log(`Downloading project: ${title}`);
        const project = pdfProjects.find((p) => p.title === title);
        if (project?.file) {
            const link = document.createElement('a');
            link.href = project.file;
            link.download = `${title}.${project.type.toLowerCase()}`;
            link.click();
        }
    };

    const handleView = async (pblId?: string | number) => {
        if (!pblId) return;
        setViewLoadingId(pblId);
        setIsSubmitting(true);
        try {
            const token = '';
            const res = await EducatorDashboardService.fetchPblFileById({ token, pbl_id: pblId });
            if (res.error === false || res.error === 'false') {
                let fileUrl = res.pbl_file && res.pbl_file[0]?.file_url;
                if (fileUrl) {
                    // If fileUrl is absolute, rewrite to relative for proxy
                    if (fileUrl.startsWith('https://pbl.4edgeit.com')) {
                        const url = new URL(fileUrl);
                        fileUrl = url.pathname + url.search;
                    }
                    // Fetch the PDF with required headers
                    const headers: HeadersInit = {
                        'API-KEY': import.meta.env.VITE_API_KEY || '',
                    };
                    const storedToken = localStorage.getItem('token');
                    if (storedToken) {
                        headers['Authorization'] = `Bearer ${storedToken}`;
                    }
                    const response = await fetch(fileUrl, { headers });
                    if (!response.ok) throw new Error('Failed to fetch PDF file');
                    const blob = await response.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    setCurrentPdfFile(blobUrl);
                    setShowPdfViewer(true);
                } else {
                    toast.error('No file URL found');
                }
            } else {
                toast.error(res.message || 'Failed to fetch file');
            }
        } catch (err) {
            toast.error((err as Error).message || 'Failed to fetch file');
        } finally {
            setIsSubmitting(false);
            setViewLoadingId(null);
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
                            isSubmitting={isSubmitting}
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
                            isSubmitting={isSubmitting}
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
                            isSubmitting={isSubmitting}
                            onErrorClear={handleErrorClear}
                        />
                        <div className="relative w-full sm:w-auto">
                            <button
                                onClick={handleSubmit}
                                className={`bg-primary hover:bg-hover text-white px-6 py-3 font-bold text-xl rounded-lg w-full sm:w-auto ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                    }`}
                                disabled={isSubmitting}
                            >
                                Submit
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
                                        onDownload={() => handleDownload(project.title)}
                                        viewLoading={viewLoadingId === project.id}
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