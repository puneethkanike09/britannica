import { useEffect, useState } from 'react';
import BackgroundImage from '../../../assets/dashboard/Educator/home-page/kids.png';
import { pdfjs } from 'react-pdf';
import PdfRenderer from '../components/common/PdfRenderer';
import toast from 'react-hot-toast';



// Import PDF files
import EmergencyKitsPdf from '../../../assets/pdfs/demo.pdf';
import Header from '../components/layout/topbar';
import Select from '../components/common/Select';
import DocumentCard from '../components/common/DocumentCard';

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

    const pdfProjects = [
        { id: 1, title: 'Emergency Kits', type: 'PDF', file: EmergencyKitsPdf },
        { id: 2, title: 'School Gardening Initiative', type: 'PDF', file: EmergencyKitsPdf },
        { id: 3, title: 'DIY Water Filter', type: 'PDF', file: EmergencyKitsPdf },
        { id: 4, title: 'Mini Garbage Collector Robot', type: 'PDF', file: EmergencyKitsPdf },
        { id: 5, title: 'Mental Health Awareness', type: 'PDF', file: EmergencyKitsPdf },
        { id: 6, title: 'Campaign: Promoting Mental Well-Being in Schools', type: 'PDF', file: EmergencyKitsPdf },
        { id: 7, title: 'Well-Being in Schools', type: 'PDF', file: EmergencyKitsPdf },
        { id: 8, title: 'Crafting Fragrance from Waste', type: 'PDF', file: EmergencyKitsPdf },
        { id: 9, title: 'Culinary Creations', type: 'PDF', file: EmergencyKitsPdf }
    ];

    const gradeOptions = [
        { value: '1', label: 'Grade 3' },
        { value: '2', label: 'Grade 4' },
        { value: '3', label: 'Grade 5' },
        { value: '4', label: 'Grade 6' },
        { value: '5', label: 'Grade 7' },
        { value: '6', label: 'Grade 8' },
        { value: '7', label: 'Grade 9' },
        { value: '8', label: 'Grade 10' },
        { value: '9', label: 'Grade 11' },
        { value: '10', label: 'Grade 12' },
    ];

    const themeOptions = [
        { value: 'environment', label: 'Environment' },
        { value: 'entrepreneurship', label: 'Entrepreneurship' },
        { value: 'ai_robotics', label: 'AI & Robotics' },
        { value: 'cultural_development', label: 'Cultural Development' },
        { value: 'social_emotional_learning', label: 'Social Emotional Learning' },
        { value: 'vocational_education', label: 'Vocational Education' },
    ];

    const typeOptions = [
        { value: 'educator_navigation', label: 'Educator Navigation' },
        { value: 'students_explorer', label: 'Students Explorer' },
    ];

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

    const handleSubmit = () => {
        if (validateForm()) {
            setIsSubmitting(true);
            toast.promise(
                new Promise((resolve) => {
                    setTimeout(() => {
                        // Simulate a successful API call
                        resolve('Filters applied successfully!');
                    }, 1000); // Simulate 1-second API call
                }),
                {
                    loading: 'Applying filters...',
                    success: () => {
                        setIsSubmitting(false);
                        setOpenDropdown(null);
                        setShowResults(true);
                        console.log('Filters:', { selectedGrade, selectedTheme, selectedType });
                        return 'Filters applied successfully!';
                    },
                    error: (err) => {
                        setIsSubmitting(false);
                        return `Error: ${err.message}`;
                    },
                }
            );
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

    const handleView = (file: string | null) => {
        setCurrentPdfFile(file);
        setShowPdfViewer(true);
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
            <Header />
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-items-center w-full md:max-w-2xl lg:max-w-5xl px-4">
                            {pdfProjects.map((project) => (
                                <DocumentCard
                                    key={project.id}
                                    title={project.title}
                                    onView={() => handleView(project.file)}
                                    onDownload={() => handleDownload(project.title)}
                                />
                            ))}
                        </div>
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