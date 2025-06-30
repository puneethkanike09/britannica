// school management page
export interface School {
    school_id: string;
    school_name: string;
    school_email: string;
    school_mobile_no: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    status?: string;
    created_user?: string;
    created_ts?: string;
    last_updated_user?: string;
    last_updated_ts?: string;
}

export interface FetchSchoolsResponse {
    error: boolean | string;
    schools: School[];
    token: string;
    message?: string;
}

export interface AddSchoolModalProps {
    onClose: () => void;
    onSchoolAdded?: () => void;
}

export interface SchoolActionModalProps {
    onClose: () => void;
    school: School;
    onSchoolUpdated?: () => void;
} 