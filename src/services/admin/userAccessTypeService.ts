import { FetchUserAccessTypesResponse, UserAccessType } from "../../types/admin/user-access-type-management";
import { apiClient } from "../../utils/apiClient";

export class UserAccessTypeService {
    static async fetchUserAccessTypes({
        page = 1,
        size = 10,
        search = ""
    }: { page?: number; size?: number; search?: string } = {}): Promise<FetchUserAccessTypesResponse> {
        try {
            const params = new URLSearchParams({
                page: String(Math.max(0, page - 1)),
                size: String(size),
                search: search || ""
            });
            const response = await apiClient.get(`/user_access_type/list?${params.toString()}`);
            return {
                error: response.error,
                user_access_type: response.user_access_type || [],
                token: response.token || "",
                message: response.message,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                currentPage: response.currentPage,
                pageSize: response.pageSize,
            };
        } catch (error) {
            console.error("Error fetching user access types:", error);
            return {
                error: true,
                user_access_type: [],
                token: "",
                message: error instanceof Error ? error.message : "Unknown error",
                totalPages: 0,
                totalElements: 0,
                currentPage: 0,
                pageSize: 0,
            };
        }
    }

    static async createUserAccessType(userAccessTypeData: {
        user_access_type_name: string;
        description: string;
    }): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            return await apiClient.post("/user_access_type/create", userAccessTypeData);
        } catch (error) {
            console.error("Error creating user access type:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async updateUserAccessType(userAccessTypeData: {
        user_access_type_id: string | number;
        user_access_type_name: string;
        description: string;
    }): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            return await apiClient.put("/user_access_type/update", userAccessTypeData);
        } catch (error) {
            console.error("Error updating user access type:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async fetchUserAccessTypeById(user_access_type_id: string | number): Promise<{ error: boolean | string; user_access_type?: UserAccessType; token?: string; message?: string }> {
        try {
            return await apiClient.get(`/user_access_type/${user_access_type_id}`);
        } catch (error) {
            console.error("Error fetching user access type detail:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async deleteUserAccessType(user_access_type_id: string | number): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            return await apiClient.put(`/user_access_type/delete/${user_access_type_id}`, {});
        } catch (error) {
            console.error("Error deleting user access type:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
} 