import { apiClient } from "../utils/apiClient";
import { School } from "../types/admin";

interface FetchSchoolsResponse {
    error: boolean | string; // API returns "false" or "true" as strings
    schools: School[];
    token: string;
    message?: string;
}

export class SchoolService {
    static async fetchSchools(): Promise<FetchSchoolsResponse> {
        try {
            const response = await apiClient.get<FetchSchoolsResponse>("/schools/all");
            if (response.data) {
                return response.data;
            } else {
                return {
                    error: true,
                    schools: [],
                    token: "",
                    message: response.message || "Unknown error",
                };
            }
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
                "/schools/create",
                schoolData
            );
            if (response.data) {
                return response.data;
            } else {
                return {
                    error: true,
                    message: response.message || "Unknown error",
                };
            }
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
                "/schools/update",
                schoolData
            );
            if (response.data) {
                return response.data;
            } else {
                return {
                    error: true,
                    message: response.message || "Unknown error",
                };
            }
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
                `/schools/${school_id}`
            );
            if (response.data) {
                return response.data;
            } else {
                return {
                    error: true,
                    message: response.message || "Unknown error",
                };
            }
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
            }>("/schools");

            if (response.data) {
                return response.data;
            } else {
                return {
                    error: true,
                    message: response.message || "Unknown error",
                };
            }
        } catch (error) {
            console.error("Error fetching schools for dropdown:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

}