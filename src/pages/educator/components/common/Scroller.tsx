import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

export default function ScrollingQuotes() {
    const quotes = useMemo(() => [
        {
            text: "I have waited long to shake your hand with this. Peter Pan, prepare to meet thy doom!",
            author: "Captain Hook"
        },
        {
            text: "The aim of education should be to teach us rather how to think, than what to think.",
            author: "James Beattie"
        },
        {
            text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
            author: "Ralph Waldo Emerson"
        },
        {
            text: "The only way to do great work is to love what you do.",
            author: "Steve Jobs"
        },
        {
            text: "In the middle of difficulty lies opportunity.",
            author: "Albert Einstein"
        }
    ], []);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [fadeClass, setFadeClass] = useState('opacity-100');
    const [isVisible, setIsVisible] = useState(true);
    
    const intervalRef = useRef(null);
    const autoPlayTimeoutRef = useRef(null);
    const containerRef = useRef(null);

    // Optimized reading time calculation with better constants
    const calculateReadingTime = useCallback((text) => {
        const words = text.split(' ').length;
        const wordsPerMinute = 200; // Average reading speed
        const readingTimeMs = Math.max(3000, (words / wordsPerMinute) * 60 * 1000);
        return Math.min(readingTimeMs, 8000); // Cap at 8 seconds
    }, []);

    // Optimized quote change with better timing
    const changeQuote = useCallback((indexOrFunction) => {
        setFadeClass('opacity-0');
        setTimeout(() => {
            setCurrentIndex(prev => 
                typeof indexOrFunction === 'function' ? indexOrFunction(prev) : indexOrFunction
            );
            setFadeClass('opacity-100');
        }, 150); // Reduced fade time for snappier feel
    }, []);

    // Intersection Observer for performance optimization
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

    // Auto-scroll with cleanup and visibility optimization
    useEffect(() => {
        if (!isAutoPlaying || !isVisible) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        const currentQuote = quotes[currentIndex];
        const readingTime = calculateReadingTime(currentQuote.text);

        intervalRef.current = setInterval(() => {
            changeQuote((prevIndex) =>
                prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
            );
        }, readingTime);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isAutoPlaying, isVisible, currentIndex, quotes, calculateReadingTime, changeQuote]);

    // Optimized manual navigation with debouncing
    const handleManualNavigation = useCallback((newIndex) => {
        setIsAutoPlaying(false);
        changeQuote(newIndex);
        
        // Clear existing timeout
        if (autoPlayTimeoutRef.current) {
            clearTimeout(autoPlayTimeoutRef.current);
        }
        
        // Resume auto-play after 5 seconds
        autoPlayTimeoutRef.current = setTimeout(() => {
            setIsAutoPlaying(true);
        }, 5000);
    }, [changeQuote]);

    const goToPrevious = useCallback(() => {
        const newIndex = currentIndex === 0 ? quotes.length - 1 : currentIndex - 1;
        handleManualNavigation(newIndex);
    }, [currentIndex, quotes.length, handleManualNavigation]);

    const goToNext = useCallback(() => {
        const newIndex = currentIndex === quotes.length - 1 ? 0 : currentIndex + 1;
        handleManualNavigation(newIndex);
    }, [currentIndex, quotes.length, handleManualNavigation]);

    const goToSlide = useCallback((index) => {
        if (index === currentIndex) return;
        handleManualNavigation(index);
    }, [currentIndex, handleManualNavigation]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
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

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
        };
    }, []);

    const ArrowIcon = ({ direction, className }) => (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <polyline points={direction === 'left' ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
        </svg>
    );

    return (
        <div className="w-full" ref={containerRef}>
            {/* Main quotes section */}
            <div className="bg-fourth py-8 sm:py-12 md:py-16 lg:py-20 relative">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    {/* Navigation arrows */}
                    <button
                        onClick={goToPrevious}
                        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 p-1 sm:p-2"
                        aria-label="Previous quote"
                        type="button"
                    >
                        <ArrowIcon 
                            direction="left"
                            className="cursor-pointer text-primary hover:text-primary/80 transition-all duration-200 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20"
                        />
                    </button>

                    <button
                        onClick={goToNext}
                        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 p-1 sm:p-2"
                        aria-label="Next quote"
                        type="button"
                    >
                        <ArrowIcon 
                            direction="right"
                            className="cursor-pointer text-primary hover:text-primary/80 transition-all duration-200 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20"
                        />
                    </button>

                    {/* Quote content */}
                    <div className="text-center">
                        <div className={`transition-opacity duration-150 ${fadeClass}`}>
                            {/* Quote text with inline quote marks */}
                            <div className="relative max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto">
                                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-textColor font-light leading-relaxed mb-6 sm:mb-8 italic">
                                    <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary font-serif leading-none align-top mr-1 sm:mr-2">"</span>
                                    {quotes[currentIndex].text}
                                    <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary font-serif leading-none align-top ml-1 sm:ml-2">"</span>
                                </p>
                            </div>

                            {/* Author attribution */}
                            <div className="mt-4 sm:mt-6">
                                <p className="text-primary font-medium text-base sm:text-lg md:text-xl">
                                    — {quotes[currentIndex].author}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dots indicator */}
                    <div className="flex justify-center mt-6 sm:mt-8 md:mt-10 space-x-1 sm:space-x-2" role="tablist" aria-label="Quote navigation">
                        {quotes.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`transition-all duration-200 rounded-full cursor-pointer ${
                                    index === currentIndex
                                        ? 'w-6 sm:w-8 h-2 sm:h-3 bg-secondary/80'
                                        : 'w-2 sm:w-3 h-2 sm:h-3 bg-lightGray hover:bg-primary'
                                }`}
                                aria-label={`Go to quote ${index + 1}`}
                                aria-selected={index === currentIndex}
                                role="tab"
                                type="button"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom static section */}
            <div className="bg-secondary text-white py-6 sm:py-6 md:py-6 lg:py-8 text-center px-4 sm:px-6 lg:px-8 border-t border-gray-200">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
                    Real Problems. Real Teams. Real Impact
                </h2>
            </div>
        </div>
    );
}