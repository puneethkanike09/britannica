import { apiClient } from "../utils/apiClient";
import {
    FetchGradesResponse,
    FetchThemesResponse,
    FetchUserAccessTypesResponse,
    FetchPblFilesPayload,
    FetchPblFilesResponse,
    FetchPblFileByIdResponse,
} from '../types/educator';

export class EducatorDashboardService {
    static async fetchGrades(): Promise<FetchGradesResponse> {
        try {
            const response = await apiClient.get<FetchGradesResponse>(
                "/grade"
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
                "/theme"
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
                "/user_access_type"
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
                "/file",
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

    static async fetchPblFileById(pblId: string | number): Promise<FetchPblFileByIdResponse> {
        try {
            const response = await apiClient.get<FetchPblFileByIdResponse>(
                `/file/${pblId}`
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
            console.error(`Error fetching PBL file by ID ${pblId}:`, error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
}