import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LogoIcon from '../../../../assets/dashboard/Educator/home-page/logo.png';

interface Quote {
    text: string;
    author: string;
}

export default function Scroller() {
    const quotes = useMemo<Quote[]>(() => [
        {
            text: "The aim of education should be to teach us rather how to think, than what to think.",
            author: "James Beattie"
        },
        {
            text: "Tell me and I forget. Teach me and I remember. Involve me and I will learn.",
            author: "Benjamin Franklin"
        },
        {
            text: "Give a man a fish and you feed him for a day; teach a man to fish and you feed him for a lifetime.",
            author: "Maimonides"
        },
        {
            text: "Real understanding is forged in the doing, not just the knowing.",
            author: "Seymour Paper"
        },
    ], []);

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [progress, setProgress] = useState<number>(0);
    
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const calculateReadingTime = useCallback((text: string): number => {
        const words = text.split(' ').length;
        const wordsPerMinute = 150;
        const readingTimeMs = Math.max(4000, (words / wordsPerMinute) * 60 * 1000);
        return Math.min(readingTimeMs, 10000);
    }, []);

    const changeQuote = useCallback((indexOrFunction: number | ((prev: number) => number)) => {
        setCurrentIndex(prev => 
            typeof indexOrFunction === 'function' ? indexOrFunction(prev) : indexOrFunction
        );
    }, []);

    const resetProgress = useCallback(() => {
        setProgress(0);
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    }, []);

    const startProgress = useCallback((duration: number) => {
        resetProgress();
        
        if (!isAutoPlaying || !isVisible) return;

        const startTime = Date.now();
        const updateInterval = 50;
        
        progressIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / duration) * 100, 100);
            setProgress(newProgress);
            
            if (elapsed >= duration) {
                setProgress(100);
                if (progressIntervalRef.current) {
                    clearInterval(progressIntervalRef.current);
                    progressIntervalRef.current = null;
                }
            }
        }, updateInterval);
    }, [isAutoPlaying, isVisible, resetProgress]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (intervalRef.current) {
            clearTimeout(intervalRef.current);
            intervalRef.current = null;
        }
        resetProgress();

        if (!isAutoPlaying || !isVisible) {
            return;
        }

        const currentQuote = quotes[currentIndex];
        const readingTime = calculateReadingTime(currentQuote.text);

        startProgress(readingTime);

        intervalRef.current = setTimeout(() => {
            changeQuote((prevIndex: number) =>
                prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
            );
        }, readingTime);

        return () => {
            if (intervalRef.current) {
                clearTimeout(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isAutoPlaying, isVisible, currentIndex, quotes, calculateReadingTime, changeQuote, startProgress, resetProgress]);

    const handleManualNavigation = useCallback((newIndex: number, _direction: 'left' | 'right'): void => {
        resetProgress();
        changeQuote(newIndex);
        
        const currentQuote = quotes[newIndex];
        const readingTime = calculateReadingTime(currentQuote.text);
        startProgress(readingTime);
    }, [changeQuote, resetProgress, quotes, calculateReadingTime, startProgress]);

    const goToPrevious = useCallback((): void => {
        const newIndex = currentIndex === 0 ? quotes.length - 1 : currentIndex - 1;
        handleManualNavigation(newIndex, 'left');
    }, [currentIndex, quotes.length, handleManualNavigation]);

    const goToNext = useCallback((): void => {
        const newIndex = currentIndex === quotes.length - 1 ? 0 : currentIndex + 1;
        handleManualNavigation(newIndex, 'right');
    }, [currentIndex, quotes.length, handleManualNavigation]);

    const goToSlide = useCallback((index: number): void => {
        if (index === currentIndex) return;
        const direction = index > currentIndex ? 'right' : 'left';
        handleManualNavigation(index, direction);
    }, [currentIndex, handleManualNavigation]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent): void => {
            // Only handle shortcuts if user is NOT typing in an input or textarea
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                (e.target as HTMLElement)?.isContentEditable
            ) {
                return;
            }

            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToPrevious();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goToNext();
            } else if (e.key === ' ') {
                e.preventDefault();
                setIsAutoPlaying(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToPrevious, goToNext]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearTimeout(intervalRef.current);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        };
    }, []);

    return (
        <div className="w-full flex flex-col bg-primary " ref={containerRef}>
            <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-6">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="relative">
                        <div className="bg-fourth rounded-lg p-8 sm:p-12 md:p-16">
                            <div className="space-y-8">
                                <AnimatePresence mode="wait">
                                    <motion.blockquote
                                        key={`${currentIndex}-quote`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                        className="text-xl sm:text-xl md:text-2xl lg:text-2xl font-light leading-relaxed tracking-wide text-textColor"
                                    >
                                        <svg 
                                            className="w-6 h-6 text-secondary opacity-80 inline-block align-top mr-2" 
                                            fill="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                                        </svg>
                                        <span>
                                            {quotes[currentIndex].text.split(' ').slice(0, -1).join(' ')}
                                            <span className="whitespace-nowrap">
                                                {' ' + quotes[currentIndex].text.split(' ').slice(-1)[0]}
                                                <svg 
                                                    className="w-6 h-6 text-secondary opacity-80 inline-block align-top ml-2 transform rotate-180" 
                                                    fill="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                                                </svg>
                                            </span>
                                        </span>
                                    </motion.blockquote>
                                </AnimatePresence>
                                <div className="flex items-center justify-between">
                                    <AnimatePresence mode="wait">
                                        <motion.cite
                                            key={`${currentIndex}-author`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                            className="text-xl sm:text-xl font-medium not-italic border-l-4 border-secondary pl-6 text-primary"
                                        >
                                            {quotes[currentIndex].author}
                                        </motion.cite>
                                    </AnimatePresence>
                                    <div className="w-24 h-1 bg-lightGray rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-secondary transition-all duration-100 ease-linear rounded-full"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center items-center mt-12 space-x-3">
                        {quotes.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`transition-all duration-300 ${
                                    index === currentIndex
                                        ? 'w-12 h-3 bg-secondary rounded-full'
                                        : 'w-3 h-3 bg-fourth rounded-full cursor-pointer hover:bg-secondary '
                                }`}
                                aria-label={`Go to quote ${index + 1}`}
                            />
                        ))}
                        <button
                            onClick={goToPrevious}
                            className="p-2 rounded-full cursor-pointer bg-fourth transition-colors duration-200"
                            aria-label="Previous quote"
                        >
                            <ChevronLeft className="w-6 h-6 text-textColor hover:text-primary" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="p-2 rounded-full cursor-pointer bg-fourth transition-colors duration-200"
                            aria-label="Next quote"
                        >
                            <ChevronRight className="w-6 h-6 text-textColor hover:text-primary" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-fourth py-6 text-center">
                <div className="mx-auto px-4 sm:px-6 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0" style={{minHeight: '40px'}}>
                    <div className="flex-shrink-0 flex items-center justify-center">
                        <img src={LogoIcon} alt="Britannica Education Logo" className="h-10 w-auto object-contain" />
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <h3 className="shine-text text-xl font-bold tracking-tight text-textColor text-center">Real Problems. Real Teams. Real Impact</h3>
                    </div>
                    <div className="hidden sm:flex flex-shrink-0 items-center justify-center" style={{visibility: 'hidden'}}>
                        <img src={LogoIcon} alt="" className="h-10 w-auto object-contain" />
                    </div>
                </div>
            </div>
        </div>
    )
}
