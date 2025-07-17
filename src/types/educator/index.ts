//topbar nav item
export interface EducatorNavItem {
    label: string;
    to?: string;
    dropdown?: Array<{
        label?: string;
        to?: string;
        isExternal?: boolean; // Add this to handle external links like PDFs
        content?: string; // Add this to support content-based dropdown items
    }>;
}


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
    isSubmittingDropdowns?: boolean;
    disabled?: boolean;
}


export interface DocumentCardProps {
    title: string;
    onView?: () => void;
    onDownload: () => void;
    image_url?: string;
    theme_color?: string;
    file: string;
    onViewCloudfront?: () => void;
}

export interface DocumentCardWithLoadingProps extends DocumentCardProps {
    viewLoading?: boolean;
    downloadLoading?: boolean;
}

export interface PdfProject {
    id: string | number;
    title: string;
    type: string;
    file: string;
    image_url?: string;
    theme_color?: string;
}



export interface Grade {
    grade_id: string;
    grade_name: string;
}

export interface Theme {
    theme_id: string;
    theme_name: string;
}

export interface UserAccessType {
    user_access_type_id: string;
    user_access_type_name: string;
}

export interface FetchGradesResponse {
    error: boolean | string;
    grade?: Grade[];
    token?: string;
    message?: string;
}

export interface FetchThemesResponse {
    error: boolean | string;
    theme?: Theme[];
    token?: string;
    message?: string;
}

export interface FetchUserAccessTypesResponse {
    error: boolean | string;
    user_access_type?: UserAccessType[];
    token?: string;
    message?: string;
}

export interface FetchPblFilesPayload {
    token: string;
    grade_id: string | number;
    theme_id: string | number;
    user_access_type_id: string | number;
}

export interface FetchPblFilesResponse {
    error: boolean | string;
    pbl_file?: Array<{
        pbl_id: string | number;
        pbl_file_path: string;
        pbl_name: string;
    }>;
    message?: string;
}

// Educator types
export interface EducatorRegistrationData {
    user_account: {
        first_name: string;
        last_name: string;
        login_id: string;
        mobile_no: string;
        email_id: string;
        user_roles: Array<{
            role: {
                role_id: number;
            };
        }>;
    };
    school: {
        school_code: string;
        school_name: string;
        school_email: string;
        school_mobile_no: string;
        address_line1: string;
        address_line2: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
    };
}

export interface EducatorRegistrationResponse {
    error: boolean | string;
    message?: string;
    token?: string;
}

export interface EducatorRegistrationFormData {
    // School data
    schoolName: string;
    emailAddress: string;
    phoneNumber: string;
    schoolCode: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    // Educator data
    firstName: string;
    lastName: string;
    educatorEmail: string;
    educatorPhone: string;
    loginId: string;
}

// Forgot password types
export interface ForgotPasswordRequest {
    email_id: string;
}

export interface ForgotPasswordResponse {
    error: boolean | string;
    message?: string;
}

// Reset password types
export interface ResetPasswordRequest {
    password: string;
    confirm_password: string;
}

export interface ResetPasswordResponse {
    error: boolean | string;
    message?: string;
}