import React, { useEffect, useRef, useState } from 'react';
import ArrowIcon from '../../../../assets/dashboard/Educator/home-page/arrow.svg';
import { SelectProps } from '../../../../types/educator';
import { Loader2 } from 'lucide-react';

const Select: React.FC<SelectProps> = ({
    value,
    onValueChange,
    placeholder,
    options,
    isOpen,
    onToggle,
    error,
    isSubmitting = false,
    onErrorClear,
    isSubmittingDropdowns = false,
}) => {
    const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(undefined);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleOptionSelect = (optionValue: string) => {
        onValueChange(optionValue);
        if (onErrorClear) {
            onErrorClear(placeholder.toLowerCase());
        }
    };

    // Calculate required width based on content
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const buttonWidth = buttonRef.current.offsetWidth;

            // Find the longest option text
            const longestOption = options.reduce((longest, current) =>
                current.label.length > longest.label.length ? current : longest
            );

            // Create a temporary element to measure text width
            const tempElement = document.createElement('div');
            tempElement.style.visibility = 'hidden';
            tempElement.style.position = 'absolute';
            tempElement.style.fontSize = '1.25rem'; // text-xl
            tempElement.style.fontWeight = 'bold';
            tempElement.style.padding = '0 1rem'; // px-4
            tempElement.style.whiteSpace = 'nowrap';
            tempElement.textContent = longestOption.label;

            document.body.appendChild(tempElement);
            const textWidth = tempElement.offsetWidth + 32; // Add some padding
            document.body.removeChild(tempElement);

            // Use the larger of button width or required text width
            const requiredWidth = Math.max(buttonWidth, textWidth);
            setDropdownWidth(requiredWidth);
        }
    }, [isOpen, options]);

    return (
        <div className="relative w-full sm:w-[250px] custom-select-dropdown">
            <button
                ref={buttonRef}
                onClick={onToggle}
                className={`flex items-center justify-between px-4 py-3 text-left w-full bg-orange hover:bg-orange/80 text-white font-bold text-xl rounded-lg ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                    } ${error ? 'border border-red' : ''}`}
                aria-label={`Select ${placeholder}`}
                aria-expanded={isOpen}
                role="combobox"
                disabled={isSubmitting}
            >
                <p className="break-all pr-2 flex-1">
                    {isSubmittingDropdowns ? (
                        <Loader2 className="animate-spin inline-block" />
                    ) : null}
                    {value ? options.find((opt) => opt.value === value)?.label : placeholder}
                </p>
                <img
                    src={ArrowIcon}
                    alt="Arrow Icon"
                    className={`h-4 w-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isOpen && (
                <div
                    className="absolute bg-white border border-white rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto top-[50px] mt-1 scrollbar-thin scrollbar-thumb-lightGray scrollbar-track-lightGray"
                    style={{
                        width: dropdownWidth ? `${dropdownWidth}px` : '100%',
                        minWidth: '100%'
                    }}
                    role="listbox"
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleOptionSelect(option.value)}
                            className={`w-full px-4 text-xl font-bold py-2 text-left hover:bg-gray/10 text-textColor cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis ${value === option.value ? 'bg-gray/10' : ''
                                }`}
                            role="option"
                            aria-selected={value === option.value}
                            title={option.label} // Show full text on hover
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
            {error && <p className="text-red text-sm mt-1">{error}</p>}
        </div>
    );
};

export default Select;