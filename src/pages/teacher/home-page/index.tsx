// src/pages/TeacherDashboard.tsx
import { useEffect, useState } from 'react';
import TeacherLayout from '../TeacherLayout';
import BackgroundImage from '../../../assets/dashboard/Teacher/home-page/kids.png';
import { LogOut } from 'lucide-react';
import LogoutModal from '../../admin/components/layout/topbar/modals/LogoutModal';
import LogoIcon from '../../../assets/dashboard/Teacher/home-page/logo.png';
import ViewIcon from '../../../assets/dashboard/Teacher/home-page/view.svg';
import DownloadIcon from '../../../assets/dashboard/Teacher/home-page/download.svg';
import ArrowIcon from '../../../assets/dashboard/Teacher/home-page/arrow.svg';
import { Link } from 'react-router-dom';
import { pdfjs } from 'react-pdf';
import PdfRenderer from '../components/common/PdfRenderer';
import toast from 'react-hot-toast';

// Import PDF files
import EmergencyKitsPdf from '../../../assets/pdfs/Puneeth-internship.pdf';

// Set pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

interface SelectProps {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: { value: string; label: string }[];
    className?: string;
    isOpen: boolean;
    onToggle: () => void;
    error?: string;
}

interface DocumentCardProps {
    title: string;
    type: string;
    onView: () => void;
    onDownload: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ title, type, onView, onDownload }) => {
    return (
        <div className="w-full max-w-xs rounded-lg bg-white group">
            <div className="relative pb-4 px-6 pt-6">
                <div className="absolute top-[-2px] right-4">
                    <span className="bg-red-500 text-white text-xs font-bold px-4 py-1">
                        {type}
                    </span>
                </div>
                <h3 className="text-2xl font-black text-textColor leading-tight min-h-[6.5rem] flex items-center">
                    {title}
                </h3>
            </div>
            <div className="pt-0 px-6 pb-6">
                <div className="flex gap-3">
                    <button
                        onClick={onView}
                        className="flex-1 bg-primary hover:bg-primary/80 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <img src={ViewIcon} alt="View Icon" className="h-4 w-4" />
                        View
                    </button>
                    <button
                        onClick={onDownload}
                        className="flex-1 bg-primary hover:bg-primary/80 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <img src={DownloadIcon} alt="Download Icon" className="h-4 w-4" />
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
};

const TeacherDashboard = () => {
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
        { id: 2, title: 'School Gardening Initiative', type: 'PPT', file: null },
        { id: 3, title: 'Mini Garbage Collector Robot', type: 'PDF', file: EmergencyKitsPdf },
        { id: 4, title: 'Emergency Kits 2', type: 'PDF', file: EmergencyKitsPdf },
    ];

    const gradeOptions = [
        { value: 'k', label: 'Kindergarten' },
        { value: '1', label: 'Grade 1' },
        { value: '2', label: 'Grade 2' },
        { value: '3', label: 'Grade 3' },
        { value: '4', label: 'Grade 4' },
        { value: '5', label: 'Grade 5' },
    ];

    const themeOptions = [
        { value: 'science', label: 'Science' },
        { value: 'math', label: 'Mathematics' },
        { value: 'history', label: 'History' },
        { value: 'art', label: 'Art' },
        { value: 'literature', label: 'Literature' },
    ];

    const typeOptions = [
        { value: 'individual', label: 'Individual' },
        { value: 'group', label: 'Group' },
        { value: 'research', label: 'Research' },
        { value: 'creative', label: 'Creative' },
        { value: 'presentation', label: 'Presentation' },
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

    const Select: React.FC<SelectProps> = ({
        value,
        onValueChange,
        placeholder,
        options,
        className = '',
        isOpen,
        onToggle,
        error,
    }) => {
        return (
            <div className="relative w-full sm:w-[250px] custom-select-dropdown">
                <button
                    onClick={onToggle}
                    className={`flex items-center justify-between px-4  text-left w-full bg-orange hover:bg-orange/80 text-white font-bold text-xl rounded-lg h-12 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${error ? 'border border-red-500' : ''} ${className}`}
                    aria-label={`Select ${placeholder}`}
                    aria-expanded={isOpen}
                    role="combobox"
                    disabled={isSubmitting}
                >
                    <span>{value ? options.find((opt) => opt.value === value)?.label : placeholder}</span>
                    <img
                        src={ArrowIcon}
                        alt="Arrow Icon"
                        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>
                {isOpen && (
                    <div
                        className="absolute w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto top-[50px] mt-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                        role="listbox"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onValueChange(option.value);
                                    setErrors((prev) => ({ ...prev, [placeholder.toLowerCase()]: '' }));
                                    setOpenDropdown(null);
                                }}
                                className={`w-full px-4  text-xl font-bold py-2 text-left hover:bg-gray-100 text-textColor cursor-pointer ${value === option.value ? 'bg-gray-100' : ''}`}
                                role="option"
                                aria-selected={value === option.value}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
        );
    };

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const openLogoutModal = () => {
        setShowLogoutModal(true);
    };

    const closeLogoutModal = () => {
        setShowLogoutModal(false);
    };

    return (
        <TeacherLayout>
            <header className="fixed top-0 right-0 left-0 flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16 sm:h-[81px] bg-[#EEFAFF] z-[20]">
                <Link to="/">
                    <div className="flex items-center gap-3">
                        <img src={LogoIcon} alt="Britannica Education Logo" className="h-[40px] object-cover" />
                    </div>
                </Link>
                <button
                    onClick={openLogoutModal}
                    className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-lg font-medium cursor-pointer flex items-center gap-2"
                >
                    <LogOut size={18} />
                    <span className="hidden md:inline">Log out</span>
                </button>
            </header>
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
                <div className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-24 sm:py-24 lg:py-32">
                    <h2 className="text-primary text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-center">
                        Welcome to the Teachers Dashboard!
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
                        />
                        <Select
                            value={selectedTheme}
                            onValueChange={setSelectedTheme}
                            placeholder="Theme"
                            options={themeOptions}
                            isOpen={openDropdown === 'theme'}
                            onToggle={() => handleDropdownToggle('theme')}
                            error={errors.theme}
                        />
                        <Select
                            value={selectedType}
                            onValueChange={setSelectedType}
                            placeholder="Type"
                            options={typeOptions}
                            isOpen={openDropdown === 'type'}
                            onToggle={() => handleDropdownToggle('type')}
                            error={errors.type}
                        />
                        <div className="relative w-full sm:w-auto">

                            <button
                                onClick={handleSubmit}
                                className={`bg-primary hover:bg-primary/80 text-white px-6 font-bold h-12 text-xl rounded-lg font-medium w-full sm:w-auto ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
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
                                    type={project.type}
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
            {showLogoutModal && <LogoutModal onClose={closeLogoutModal} />}
        </TeacherLayout>
    );
};

export default TeacherDashboard;