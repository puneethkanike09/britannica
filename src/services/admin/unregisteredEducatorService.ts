import { FetchUnregisteredEducatorsResponse, ActionResponse } from "../../types/admin/unregistered-educator-management";
import { apiClient } from "../../utils/apiClient";

export class UnregisteredEducatorService {
    static async fetchUnregisteredEducators({
        page = 1,
        size = 10,
        search = ""
    }: { page?: number; size?: number; search?: string } = {}): Promise<FetchUnregisteredEducatorsResponse> {
        try {
            const params = new URLSearchParams({
                page: String(Math.max(0, page - 1)),
                size: String(size),
                search: search || ""
            });
            const response = await apiClient.get(`/teacher/unregistered?${params.toString()}`);
            return {
                error: response.error,
                teachers: response.teachers || [],
                token: response.token || "",
                message: response.message,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                currentPage: response.currentPage,
                pageSize: response.pageSize,
            };
        } catch (error) {
            console.error("Error fetching unregistered educators:", error);
            return {
                error: true,
                teachers: [],
                token: "",
                message: error instanceof Error ? error.message : "Unknown error",
                totalPages: 0,
                totalElements: 0,
                currentPage: 0,
                pageSize: 0,
            };
        }
    }

    static async unregisterEducator(id: string | number): Promise<ActionResponse> {
        try {
            const response = await apiClient.delete(`/teacher/unregistered-delete/${id}`);
            return response;
        } catch (error) {
            console.error("Error unregistering educator:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async bulkUnregisterEducators(ids: (string | number)[]): Promise<ActionResponse> {
        try {
            const response = await apiClient.delete("/teacher/unregistered-delete-all", { ids });
            return response;
        } catch (error) {
            console.error("Error bulk unregistering educators:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
} 