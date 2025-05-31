export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: SelectOption[];
    className?: string;
    isOpen: boolean;
    onToggle: () => void;
    error?: string;
    isSubmitting?: boolean;
    onErrorClear?: (field: string) => void;
}


export interface DocumentCardProps {
    title: string;
    onView: () => void;
    onDownload: () => void;
}