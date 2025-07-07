import { FetchPblFilesResponse } from '../../types/admin/pbl-files-management';
import {
    FetchGradesResponse,
    FetchThemesResponse,
    FetchUserAccessTypesResponse,
} from '../../types/educator';
import { apiClient } from '../../utils/apiClient';

export class PblFileServices {
    static async fetchGrades(): Promise<FetchGradesResponse> {
        try {
            const response = await apiClient.get("/grade/list");
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
            const response = await apiClient.get("/theme/list");
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
            const response = await apiClient.get("/user_access_type/list");
            return response;
        } catch (error) {
            console.error("Error fetching user access types:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }


    static async fetchPblFiles({
        page = 1,
        size = 10,
        search = ""
    }: { page?: number; size?: number; search?: string } = {}): Promise<FetchPblFilesResponse> {
        try {
            const params = new URLSearchParams({
                page: String(Math.max(0, page - 1)),
                size: String(size),
                search: search || ""
            });
            const response = await apiClient.get(`/file/list?${params.toString()}`);
            return {
                error: response.error,
                pbl_files: response.pbl_files || [],
                token: response.token || "",
                message: response.message,
                totalPages: response.totalPages,
                totalItems: response.totalItems,
                currentPage: response.currentPage,
                pageSize: response.pageSize,
            };
        } catch (error) {
            console.error("Error fetching PBL files:", error);
            return {
                error: true,
                pbl_files: [],
                token: "",
                message: error instanceof Error ? error.message : "Unknown error",
                totalPages: 0,
                totalItems: 0,
                currentPage: 0,
                pageSize: 0,
            };
        }
    }


} 