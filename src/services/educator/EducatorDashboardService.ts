import {
    FetchGradesResponse,
    FetchThemesResponse,
    FetchUserAccessTypesResponse,
    FetchPblFilesPayload,
    FetchPblFilesResponse,
} from '../../types/educator';
import { apiClient } from '../../utils/apiClient';

export class EducatorDashboardService {
    static async fetchGrades(): Promise<FetchGradesResponse> {
        try {
            const response = await apiClient.get("/grade");
            return response;
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
            const response = await apiClient.get("/theme");
            return response;
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
            const response = await apiClient.get("/user_access_type");
            return response;
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
            const response = await apiClient.post("/file", payload);
            return response;
        } catch (error) {
            console.error("Error fetching PBL files:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async fetchPdfFileView(filePath: string): Promise<Blob> {
        return await apiClient.fetchPdfBlobGet('/file/view', { filePath });
    }
} 