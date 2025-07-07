import { FetchRegisteredEducatorsResponse, ActionResponse } from "../../types/admin/registered-educator-management";
import { apiClient } from "../../utils/apiClient";

export class RegisteredEducatorService {
    static async fetchRegisteredEducators({
        page = 1,
        size = 10,
        search = ""
    }: { page?: number; size?: number; search?: string } = {}): Promise<FetchRegisteredEducatorsResponse> {
        try {
            const params = new URLSearchParams({
                page: String(Math.max(0, page - 1)),
                size: String(size),
                search: search || ""
            });
            const response = await apiClient.get(`/teacher/registered?${params.toString()}`);
            return {
                error: response.error,
                data: response.data || [],
                token: response.token || "",
                message: response.message,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                currentPage: response.currentPage,
                pageSize: response.pageSize,
            };
        } catch (error) {
            console.error("Error fetching registered educators:", error);
            return {
                error: true,
                data: [],
                token: "",
                message: error instanceof Error ? error.message : "Unknown error",
                totalPages: 0,
                totalElements: 0,
                currentPage: 0,
                pageSize: 0,
            };
        }
    }

    static async fetchRegisteredEducatorCompleteDetails(user_id: string | number): Promise<{
        error: boolean | string;
        teacher?: {
            teacher_id: string | number;
            first_name?: string;
            last_name?: string;
            mobile_no?: string;
            email_id?: string;
            login_id?: string;
            school_name?: string;
            status?: string;
            created_user?: string | number;
            created_ts?: string;
            last_updated_user?: string | number;
            last_updated_ts?: string;
            addressLine1?: string;
            city?: string;
            state?: string;
            country?: string;
            pincode?: string;
        };
        token?: string;
        message?: string;
    }> {
        try {
            const response = await apiClient.get(
                `/teacher/info/${user_id}`
            );
            if (response.teacher) return response;
            if (response.educator) return { ...response, teacher: response.educator };
            return response;
        } catch (error) {
            console.error("Error fetching registered educator complete details:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async approveEducator(user_id: string | number): Promise<ActionResponse> {
        try {
            return await apiClient.put(`/teacher/approve/${user_id}`, {});
        } catch (error) {
            console.error("Error approving educator:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async bulkApproveEducators(user_ids: (string | number)[]): Promise<ActionResponse> {
        try {
            return await apiClient.put("/teacher/approve-all", { ids: user_ids });
        } catch (error) {
            console.error("Error bulk approving educators:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async rejectEducator(user_id: string | number, remarks: string): Promise<ActionResponse> {
        try {
            return await apiClient.put("/teacher/reject", {
                user_id: user_id,
                remarks: remarks
            });
        } catch (error) {
            console.error("Error rejecting educator:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async bulkRejectEducators(user_ids: (string | number)[], remarks: string): Promise<ActionResponse> {
        try {
            return await apiClient.put("/teacher/reject-all", {
                ids: user_ids,
                remarks: remarks
            });
        } catch (error) {
            console.error("Error bulk rejecting educators:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
}