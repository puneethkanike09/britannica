// Report management types
export interface Report {
    userId: string | number;
    description: string;
    activityTs: string;
    firstName: string;
    lastName: string;
    schoolName: string;
}

export interface FetchReportsResponse {
    error: boolean | string;
    token: string;
    message?: string;
    reports: Report[];
    totalPages?: number;
    totalElements?: number;
    currentPage?: number;
    pageSize?: number;
}


export interface FetchReportsParams {
    start_date: string;
    end_date: string;
    page?: number;
    size?: number;
}

export interface DownloadReportParams {
    start_date: string;
    end_date: string;
} 