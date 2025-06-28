import { apiClient } from "../utils/apiClient";
import {
    Grade,
    FetchGradesResponse,
    AddGradePayload,
    UpdateGradePayload,
    Theme,
    FetchThemesResponse,
    AddThemePayload,
    UpdateThemePayload,
    Type,
    FetchTypesResponse,
    AddTypePayload,
    UpdateTypePayload,
    PblFile,
    FetchPblFilesResponse,
    AddPblFilePayload,
    UpdatePblFilePayload
} from "../types/admin";

export class AdminService {
    // Grade Management
    static async fetchGrades(): Promise<FetchGradesResponse> {
        try {
            const response = await apiClient.get<FetchGradesResponse>("/grade");
            return response;
        } catch (error) {
            console.error("Error fetching grades:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async addGrade(gradeData: AddGradePayload): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            const response = await apiClient.post<{ error: boolean | string; token?: string; message?: string }>(
                "/grade/create",
                gradeData
            );
            return response;
        } catch (error) {
            console.error("Error adding grade:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async updateGrade(gradeData: UpdateGradePayload): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            const response = await apiClient.post<{ error: boolean | string; token?: string; message?: string }>(
                "/grade/update",
                gradeData
            );
            return response;
        } catch (error) {
            console.error("Error updating grade:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async deleteGrade(grade_id: string): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            const response = await apiClient.post<{ error: boolean | string; token?: string; message?: string }>(
                "/grade/delete",
                { grade_id }
            );
            return response;
        } catch (error) {
            console.error("Error deleting grade:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    // Theme Management
    static async fetchThemes(): Promise<FetchThemesResponse> {
        try {
            const response = await apiClient.get<FetchThemesResponse>("/theme");
            return response;
        } catch (error) {
            console.error("Error fetching themes:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async addTheme(themeData: AddThemePayload): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            const response = await apiClient.post<{ error: boolean | string; token?: string; message?: string }>(
                "/theme/create",
                themeData
            );
            return response;
        } catch (error) {
            console.error("Error adding theme:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async updateTheme(themeData: UpdateThemePayload): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            const response = await apiClient.post<{ error: boolean | string; token?: string; message?: string }>(
                "/theme/update",
                themeData
            );
            return response;
        } catch (error) {
            console.error("Error updating theme:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async deleteTheme(theme_id: string): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            const response = await apiClient.post<{ error: boolean | string; token?: string; message?: string }>(
                "/theme/delete",
                { theme_id }
            );
            return response;
        } catch (error) {
            console.error("Error deleting theme:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    // Type Management
    static async fetchTypes(): Promise<FetchTypesResponse> {
        try {
            const response = await apiClient.get<FetchTypesResponse>("/type");
            return response;
        } catch (error) {
            console.error("Error fetching types:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async addType(typeData: AddTypePayload): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            const response = await apiClient.post<{ error: boolean | string; token?: string; message?: string }>(
                "/type/create",
                typeData
            );
            return response;
        } catch (error) {
            console.error("Error adding type:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async updateType(typeData: UpdateTypePayload): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            const response = await apiClient.post<{ error: boolean | string; token?: string; message?: string }>(
                "/type/update",
                typeData
            );
            return response;
        } catch (error) {
            console.error("Error updating type:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async deleteType(type_id: string): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            const response = await apiClient.post<{ error: boolean | string; token?: string; message?: string }>(
                "/type/delete",
                { type_id }
            );
            return response;
        } catch (error) {
            console.error("Error deleting type:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    // PBL File Management
    static async fetchPblFiles(): Promise<FetchPblFilesResponse> {
        try {
            const response = await apiClient.get<FetchPblFilesResponse>("/pbl-file");
            return response;
        } catch (error) {
            console.error("Error fetching PBL files:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async addPblFile(pblFileData: AddPblFilePayload): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            const response = await apiClient.post<{ error: boolean | string; token?: string; message?: string }>(
                "/pbl-file/create",
                pblFileData
            );
            return response;
        } catch (error) {
            console.error("Error adding PBL file:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async updatePblFile(pblFileData: UpdatePblFilePayload): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            const response = await apiClient.post<{ error: boolean | string; token?: string; message?: string }>(
                "/pbl-file/update",
                pblFileData
            );
            return response;
        } catch (error) {
            console.error("Error updating PBL file:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async deletePblFile(pbl_id: string): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            const response = await apiClient.post<{ error: boolean | string; token?: string; message?: string }>(
                "/pbl-file/delete",
                { pbl_id }
            );
            return response;
        } catch (error) {
            console.error("Error deleting PBL file:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
} 