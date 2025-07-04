import { Teacher, FetchTeachersResponse } from "../../types/admin/educator-management";
import { apiClient } from "../../utils/apiClient";

export class EducatorService {
    static async fetchTeachers({
        page = 1,
        size = 10,
        search = ""
    }: { page?: number; size?: number; search?: string }): Promise<FetchTeachersResponse> {
        try {
            const params = new URLSearchParams({
                page: String(Math.max(0, page - 1)),
                size: String(size),
                search: search || ""
            });
            const response = await apiClient.get(`/teacher?${params.toString()}`);
            return {
                error: response.error,
                teacher: response.teacher || [],
                token: response.token || "",
                message: response.message,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                currentPage: response.currentPage,
                pageSize: response.pageSize,
            };
        } catch (error) {
            console.error("Error fetching teachers:", error);
            return {
                error: true,
                teacher: [],
                token: "",
                message: error instanceof Error ? error.message : "Unknown error",
                totalPages: 0,
                totalElements: 0,
                currentPage: 0,
                pageSize: 0,
            };
        }
    }

    static async addTeacher(teacherData: {
        school_id: number;
        first_name: string;
        last_name: string;
        mobile_no: string;
        email_id: string;
        login_id: string;
    }): Promise<{ error: boolean | string; token?: string; message?: string; password_link?: string }> {
        try {
            const payload = {
                school: { school_id: teacherData.school_id },
                first_name: teacherData.first_name,
                last_name: teacherData.last_name,
                mobile_no: teacherData.mobile_no,
                email_id: teacherData.email_id,
                login_id: teacherData.login_id,
                user_roles: [
                    { role: { role_id: 2 } }
                ]
            };
            const response = await apiClient.post(
                "/teacher/create",
                payload
            );
            return response;
        } catch (error) {
            console.error("Error adding teacher:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async updateTeacher(teacherData: {
        teacher_id: string | number;
        login_id: string;
        email_id: string;
        mobile_no: string;
        first_name: string;
        last_name: string;
        user_id?: string;
    }): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            const response = await apiClient.put(
                "/teacher/update",
                teacherData
            );
            return response;
        } catch (error) {
            console.error("Error updating teacher:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async fetchTeacherById(teacher_id: string | number): Promise<{ error: boolean | string; teacher?: Teacher; token?: string; message?: string }> {
        try {
            const response = await apiClient.get(
                `/teacher/${teacher_id}`
            );
            return response;
        } catch (error) {
            console.error("Error fetching teacher detail:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async fetchTeacherCompleteDetails(teacher_id: string | number): Promise<{
        error: boolean | string;
        teacher?: {
            teacher_id: string | number;
            first_name: string;
            last_name: string;
            mobile_no: string;
            email_id: string;
            login_id: string;
            school_name: string;
            status?: string;
            created_user?: string | number;
            created_ts?: string;
            last_updated_user?: string | number;
            last_updated_ts?: string;
        };
        token?: string;
        message?: string;
    }> {
        try {
            const response = await apiClient.get(
                `/teacher/info/${teacher_id}`
            );
            return response;
        } catch (error) {
            console.error("Error fetching teacher complete details:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    static async deleteTeacher(teacher_id: string | number): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            const response = await apiClient.put(
                `/teacher/delete/${teacher_id}`,
                {}
            );
            return response;
        } catch (error) {
            console.error("Error deleting teacher:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
}
