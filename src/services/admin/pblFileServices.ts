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

    static async uploadPblFile({
        file,
        grade_id,
        theme_id,
        user_access_type_id,
        title,
        desc,
        image,
    }: {
        file: File;
        grade_id: string;
        theme_id: string;
        user_access_type_id: string;
        title: string;
        desc: string;
        image: File;
    }): Promise<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('grade_id', grade_id);
        formData.append('theme_id', theme_id);
        formData.append('access_type_id', user_access_type_id);
        formData.append('title', title);
        formData.append('desc', desc);
        formData.append('image', image);
        return apiClient.postFormData('/file/upload', formData, true);
    }

    static async updatePblFile({
        file_id,
        file,
        grade_id,
        theme_id,
        user_access_type_id,
        title,
        desc,
        image,
    }: {
        file_id: string;
        file: File | null;
        grade_id: string;
        theme_id: string;
        user_access_type_id: string;
        title: string;
        desc: string;
        image: File | null;
    }): Promise<any> {
        const formData = new FormData();
        formData.append('id', file_id);
        if (file) formData.append('file', file);
        formData.append('grade_id', grade_id);
        formData.append('theme_id', theme_id);
        formData.append('access_type_id', user_access_type_id);
        formData.append('title', title);
        formData.append('desc', desc);
        if (image) formData.append('image', image);
        return apiClient.putFormData('/file/update', formData, true);
    }

    static async deletePblFile(pbl_id: string | number): Promise<any> {
        return apiClient.delete(`/file/${pbl_id}`);
    }

    static async fetchPblFileById(pbl_id: string | number): Promise<any> {
        try {
            const response = await apiClient.get(`/file/view/${pbl_id}`);
            return response;
        } catch (error) {
            console.error("Error fetching PBL file by ID:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
} 