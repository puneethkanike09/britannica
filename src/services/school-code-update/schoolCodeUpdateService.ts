import { apiClient } from "../../utils/apiClient";
import { SchoolListResponse } from "../../types/school-code-update";

interface SchoolCodeUpdateResponse {
    error: boolean;
    message: string;
}

interface SchoolCodeUpdate {
    school_id: string;
    school_code: string;
}

export class SchoolCodeUpdateService {
    static async updateSchoolCodes(updates: SchoolCodeUpdate[]): Promise<SchoolCodeUpdateResponse> {
        try {
            const response = await apiClient.put('/auth/schoolCodeUpdate', updates);
            return {
                error: response.error === "false" || response.error === false ? false : true,
                message: response.message || "School updated successfully.",
            };
        } catch (error) {
            console.error("Error updating school codes:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async fetchSchools(): Promise<SchoolListResponse> {
        try {
            const response = await apiClient.get('/auth/schoolList');
            return {
                error: response.error === "false" || response.error === false ? false : true,
                school: response.school || [],
                token: response.token || "",
                message: response.message,
            };
        } catch (error) {
            console.error("Error fetching schools:", error);
            return {
                error: true,
                school: [],
                token: "",
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
}
