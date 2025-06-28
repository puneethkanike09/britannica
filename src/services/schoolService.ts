import { apiClient } from "../utils/apiClient";
import { FetchSchoolsResponse, School } from "../types/admin";



export class SchoolService {
    static async fetchSchools(): Promise<FetchSchoolsResponse> {
        try {
            const response = await apiClient.get<FetchSchoolsResponse>("/school/all");
            return response as FetchSchoolsResponse;
        } catch (error) {
            console.error("Error fetching schools:", error);
            return {
                error: true,
                schools: [],
                token: "",
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async addSchool(schoolData: {
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
            const response = await apiClient.post<{ error: boolean | string; token?: string; message?: string }>(
                "/school/create",
                schoolData
            );
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
            const response = await apiClient.post<{ error: boolean | string; token?: string; message?: string }>(
                "/school/update",
                schoolData
            );
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
            const response = await apiClient.get<{ error: boolean | string; school?: School; token?: string; message?: string }>(
                `/school/${school_id}`
            );
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
        schools?: Pick<School, 'school_id' | 'school_name'>[];
        token?: string;
        message?: string;
    }> {

        try {
            const response = await apiClient.get<{
                error: boolean | string;
                schools?: Pick<School, 'school_id' | 'school_name'>[];
                token?: string;
                message?: string;
            }>("/school");

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