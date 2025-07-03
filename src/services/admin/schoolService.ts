import { FetchSchoolsResponse, School } from "../../types/admin/school-management";
import { apiClient } from "../../utils/apiClient";

export class SchoolService {
    static async fetchSchools(): Promise<FetchSchoolsResponse> {
        try {
            const response = await apiClient.get("/school/all");
            return {
                error: response.error,
                school: response.school || [],
                token: response.token || "",
                message: response.message,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                currentPage: response.currentPage,
                pageSize: response.pageSize,
            };
        } catch (error) {
            console.error("Error fetching schools:", error);
            return {
                error: true,
                school: [],
                token: "",
                message: error instanceof Error ? error.message : "Unknown error",
                totalPages: 0,
                totalElements: 0,
                currentPage: 0,
                pageSize: 0,
            };
        }
    }

    static async addSchool(schoolData: {
        school_code: string;
        school_name: string;
        school_email: string;
        school_mobile_no: string;
        address_line1: string;
        address_line2?: string;
        city?: string;
        state?: string;
        country?: string;
        pincode?: string;
    }): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            const response = await apiClient.post("/school/create", schoolData);
            return response;
        } catch (error) {
            console.error("Error adding school:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async updateSchool(schoolData: {
        school_id: string | number;
        school_code: string;
        school_name: string;
        school_email: string;
        school_mobile_no: string;
        address_line1: string;
        address_line2?: string;
        city?: string;
        state?: string;
        country?: string;
        pincode?: string;
    }): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            const response = await apiClient.put("/school/update", schoolData);
            return response;
        } catch (error) {
            console.error("Error updating school:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async fetchSchoolById(school_id: string | number): Promise<{ error: boolean | string; school?: School; token?: string; message?: string }> {
        try {
            const response = await apiClient.get(`/school/${school_id}`);
            return response;
        } catch (error) {
            console.error("Error fetching school detail:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async fetchSchoolsForDropdown(): Promise<{
        error: boolean | string;
        school?: Pick<School, 'school_id' | 'school_name'>[];
        token?: string;
        message?: string;
    }> {
        try {
            const response = await apiClient.get("/school");
            return response;
        } catch (error) {
            console.error("Error fetching schools for dropdown:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
}
