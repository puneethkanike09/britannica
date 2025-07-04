import { FetchGradesResponse, Grade } from "../../types/admin/grade-management";
import { apiClient } from "../../utils/apiClient";

export class GradeService {
    static async fetchGrades({
        page = 1,
        size = 10,
        search = ""
    }: { page?: number; size?: number; search?: string } = {}): Promise<FetchGradesResponse> {
        try {
            const params = new URLSearchParams({
                page: String(Math.max(0, page - 1)),
                size: String(size),
                search: search || ""
            });
            const response = await apiClient.get(`/grade/list?${params.toString()}`);
            return {
                error: response.error,
                grade: response.grade || [],
                token: response.token || "",
                message: response.message,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                currentPage: response.currentPage,
                pageSize: response.pageSize,
            };
        } catch (error) {
            console.error("Error fetching grades:", error);
            return {
                error: true,
                grade: [],
                token: "",
                message: error instanceof Error ? error.message : "Unknown error",
                totalPages: 0,
                totalElements: 0,
                currentPage: 0,
                pageSize: 0,
            };
        }
    }

    static async createGrade(gradeData: {
        grade_name: string;
        description: string;
    }): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            return await apiClient.post("/grade/create", gradeData);
        } catch (error) {
            console.error("Error creating grade:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async updateGrade(gradeData: {
        grade_id: string | number;
        grade_name: string;
        description: string;
    }): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            return await apiClient.put("/grade/update", gradeData);
        } catch (error) {
            console.error("Error updating grade:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async fetchGradeById(grade_id: string | number): Promise<{ error: boolean | string; grade?: Grade; token?: string; message?: string }> {
        try {
            return await apiClient.get(`/grade/${grade_id}`);
        } catch (error) {
            console.error("Error fetching grade detail:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async deleteGrade(grade_id: string | number): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            return await apiClient.put(`/grade/delete/${grade_id}`, {});
        } catch (error) {
            console.error("Error deleting grade:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
} 