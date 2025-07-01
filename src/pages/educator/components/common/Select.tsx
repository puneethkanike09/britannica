import React, { useRef } from 'react';
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
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleOptionSelect = (optionValue: string) => {
        onValueChange(optionValue);
        if (onErrorClear) {
            onErrorClear(placeholder.toLowerCase());
        }
    };

    // Calculate dropdown position immediately when rendering
    const getDropdownTop = () => {
        if (buttonRef.current) {
            return buttonRef.current.offsetHeight + 4; // 4px gap (mt-1)
        }
        return 54; // fallback height (50px + 4px gap)
    };

    return (
        <div className="relative w-full sm:w-[750px] custom-select-dropdown">
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
                <p className="break-words pr-2 flex-1 leading-tight">
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
                    className="absolute bg-white border border-white rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-lightGray scrollbar-track-lightGray w-full min-w-full"
                    style={{
                        top: `${getDropdownTop()}px`
                    }}
                    role="listbox"
                >
                    {options.length === 0 ? (
                        <div className="px-4 py-2 text-textColor font-bold text-lg">No options available</div>
                    ) : (
                        options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleOptionSelect(option.value)}
                                className={`w-full px-4 text-xl font-bold py-2 text-left hover:bg-primary/10 text-textColor cursor-pointer break-words leading-tight ${value === option.value ? 'bg-gray/10' : ''
                                    }`}
                                role="option"
                                aria-selected={value === option.value}
                                title={option.label} // Show full text on hover
                            >
                                {option.label}
                            </button>
                        ))
                    )}
                </div>
            )}
            {error && <p className="text-red text-sm mt-1">{error}</p>}
        </div>
    );
};

export default Select;