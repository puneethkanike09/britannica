export interface SelectProps {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: { value: string; label: string }[];
    className?: string;
    isOpen: boolean;
    onToggle: () => void;
    error?: string;
}


export interface DocumentCardProps {
    title: string;
    onView: () => void;
    onDownload: () => void;
}