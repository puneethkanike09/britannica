import React from 'react';
import ArrowIcon from '../../../../assets/dashboard/Educator/home-page/arrow.svg';
import { SelectProps } from '../../../../types/teacher';

const Select: React.FC<SelectProps> = ({
    value,
    onValueChange,
    placeholder,
    options,
    className = '',
    isOpen,
    onToggle,
    error,
    isSubmitting = false,
    onErrorClear,
}) => {
    const handleOptionSelect = (optionValue: string) => {
        onValueChange(optionValue);
        if (onErrorClear) {
            onErrorClear(placeholder.toLowerCase());
        }
    };

    return (
        <div className="relative w-full sm:w-[250px] custom-select-dropdown">
            <button
                onClick={onToggle}
                className={`flex items-center justify-between px-4 py-3 text-left w-full bg-orange hover:bg-orange/80 text-white font-bold text-xl rounded-lg ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                    } ${error ? 'border border-red' : ''} ${className}`}
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
                            onClick={() => handleOptionSelect(option.value)}
                            className={`w-full px-4 text-xl font-bold py-2 text-left hover:bg-gray-100 text-textColor cursor-pointer ${value === option.value ? 'bg-gray-100' : ''
                                }`}
                            role="option"
                            aria-selected={value === option.value}
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