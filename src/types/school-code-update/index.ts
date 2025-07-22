export interface SchoolBasicInfo {
    school_id: string;
    school_name: string;
    school_email: string;
    school_mobile_no: string;
    school_address: string;
    status: string;
    school_code?: string;
}

export interface SchoolWithTempCode extends SchoolBasicInfo {
    tempSchoolCode: string;
}

export interface SchoolListResponse {
    error: boolean;
    school: SchoolBasicInfo[];
    token: string;
    message?: string;
}
