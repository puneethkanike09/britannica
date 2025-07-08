import { FetchThemesResponse, Theme } from "../../types/admin/theme-management";
import { apiClient } from "../../utils/apiClient";

export class ThemeService {
    static async fetchThemes({
        page = 1,
        size = 10,
        search = ""
    }: { page?: number; size?: number; search?: string } = {}): Promise<FetchThemesResponse> {
        try {
            const params = new URLSearchParams({
                page: String(Math.max(0, page - 1)),
                size: String(size),
                search: search || ""
            });
            const response = await apiClient.get(`/theme/list?${params.toString()}`);
            return {
                error: response.error,
                theme: response.theme || [],
                token: response.token || "",
                message: response.message,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                currentPage: response.currentPage,
                pageSize: response.pageSize,
            };
        } catch (error) {
            console.error("Error fetching themes:", error);
            return {
                error: true,
                theme: [],
                token: "",
                message: error instanceof Error ? error.message : "Unknown error",
                totalPages: 0,
                totalElements: 0,
                currentPage: 0,
                pageSize: 0,
            };
        }
    }

    static async createTheme(themeData: {
        theme_name: string;
        description: string;
        theme_color: string;
    }): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            return await apiClient.post("/theme/create", themeData);
        } catch (error) {
            console.error("Error creating theme:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async updateTheme(themeData: {
        theme_id: string | number;
        theme_name: string;
        description: string;
        theme_color: string;
    }): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            return await apiClient.put("/theme/update", themeData);
        } catch (error) {
            console.error("Error updating theme:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async fetchThemeById(theme_id: string | number): Promise<{ error: boolean | string; theme?: Theme; token?: string; message?: string }> {
        try {
            return await apiClient.get(`/theme/${theme_id}`);
        } catch (error) {
            console.error("Error fetching theme detail:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async deleteTheme(theme_id: string | number): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            return await apiClient.put(`/theme/delete/${theme_id}`, {});
        } catch (error) {
            console.error("Error deleting theme:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
} 