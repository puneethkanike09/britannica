import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

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
        const wordsPerMinute = 150; // Reduced from 200 to 150 to increase reading time
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
        // Clear existing timers
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

        // Start progress bar immediately
        startProgress(readingTime);

        // Set up the interval for changing quotes
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
        
        // Start progress immediately after manual navigation
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
        <div className="w-full flex flex-col bg-fourth " ref={containerRef}>
            {/* Main carousel section */}
            <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-6xl mx-auto">

                    {/* Main quote card */}
                    <div className="relative">
                        <div 
                            className="transform transition-all duration-500 ease-out"
                            key={currentIndex}
                        >
                            <div className="bg-white rounded-lg p-8 sm:p-12 md:p-16">
                                {/* Quote content */}
                                <div className="space-y-8">
                                    <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl font-light leading-relaxed tracking-wide text-textColor">
                                        <span>{quotes[currentIndex].text}</span>
                                    </blockquote>
                                    
                                    <div className="flex items-center justify-between">
                                        <cite className="text-xl sm:text-2xl font-medium not-italic border-l-4 border-orange pl-6 text-textColor">
                                            {quotes[currentIndex].author}
                                        </cite>
                                        
                                        {/* Progress indicator */}
                                        <div className="w-24 h-1 bg-lightGray rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-primary transition-all duration-100 ease-linear rounded-full"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation controls */}
                    <div className="flex justify-center items-center mt-12 space-x-3">
                        {/* Navigation dots */}
                        {quotes.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`transition-all duration-300 ${
                                    index === currentIndex
                                        ? 'w-12 h-3 bg-primary rounded-full'
                                        : 'w-3 h-3 bg-white rounded-full cursor-pointer hover:bg-primary '
                                }`}
                                aria-label={`Go to quote ${index + 1}`}
                            />
                        ))}
                        {/* Left arrow */}
                        <button
                            onClick={goToPrevious}
                            className="p-2 rounded-full cursor-pointer bg-white transition-colors duration-200"
                            aria-label="Previous quote"
                        >
                            <ChevronLeft className="w-6 h-6 text-textColor hover:text-primary" />
                        </button>
                        {/* Right arrow */}
                        <button
                            onClick={goToNext}
                            className="p-2 rounded-full cursor-pointer bg-white  transition-colors duration-200"
                            aria-label="Next quote"
                        >
                            <ChevronRight className="w-6 h-6 text-textColor hover:text-primary" />
                        </button>
                    </div>

                </div>
            </div>

            {/* Footer section */}
            <div className=" bg-secondary py-10 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h3 className="text-xl font-bold tracking-tight text-white">Real Problems. Real Teams. Real Impact</h3>
                </div>
            </div>
        </div>
    );
}