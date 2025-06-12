import { apiClient } from "../utils/apiClient";
import {
    FetchGradesResponse,
    FetchThemesResponse,
    FetchUserAccessTypesResponse,
    FetchPblFilesPayload,
    FetchPblFilesResponse,
    FetchPblFileByIdResponse
} from '../types/educator';

export class EducatorDashboardService {
    static async fetchGrades(): Promise<FetchGradesResponse> {
        try {
            const response = await apiClient.get<FetchGradesResponse>(
                "/grades"
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
            console.error("Error fetching grades:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async fetchThemes(): Promise<FetchThemesResponse> {
        try {
            const response = await apiClient.get<FetchThemesResponse>(
                "/themes"
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
            console.error("Error fetching themes:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async fetchUserAccessTypes(): Promise<FetchUserAccessTypesResponse> {
        try {
            const response = await apiClient.get<FetchUserAccessTypesResponse>(
                "/user_access_types"
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
            console.error("Error fetching user access types:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async fetchPblFiles(payload: FetchPblFilesPayload): Promise<FetchPblFilesResponse> {
        try {
            const response = await apiClient.post<FetchPblFilesResponse>(
                "/pbl_files",
                payload
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
            console.error("Error fetching PBL files:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async fetchPblFileById(payload: { token: string; pbl_id: string | number }): Promise<FetchPblFileByIdResponse> {
        try {
            const response = await apiClient.post<FetchPblFileByIdResponse>(
                "/pbl_files/by-id",
                payload
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
            console.error("Error fetching PBL file by id:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    // Helper to fetch all dropdowns in sequence to avoid refresh token issues
    static async fetchAllDropdownsSequentially() {
        const gradesRes = await this.fetchGrades();
        const themesRes = await this.fetchThemes();
        const typesRes = await this.fetchUserAccessTypes();
        return [gradesRes, themesRes, typesRes];
    }
}
