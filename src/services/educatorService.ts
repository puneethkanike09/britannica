import { apiClient } from "../utils/apiClient";
import { Teacher } from "../types/admin";

export class EducatorService {
    static async fetchTeachers(): Promise<{ error: boolean | string; teachers?: Teacher[]; token?: string; message?: string }> {
        try {
            const response = await apiClient.get<{ error: boolean | string; teachers?: Teacher[]; token?: string; message?: string }>(
                "/teachers"
            );
            if (response.data) {
                return response.data;
            } else {
                return {
                    error: true,
                    message: response.message || "Unknown error",
                };
            }
        } catch (error) {
            console.error("Error fetching teachers:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
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
            const response = await apiClient.post<{ error: boolean | string; token?: string; message?: string; password_link?: string }>(
                "/teachers/create",
                payload
            );
            if (response.data) {
                return response.data;
            } else {
                return {
                    error: true,
                    message: response.message || "Unknown error",
                };
            }
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
            const response = await apiClient.post<{ error: boolean | string; token?: string; message?: string }>(
                "/teachers/update",
                teacherData
            );
            if (response.data) {
                return response.data;
            } else {
                return {
                    error: true,
                    message: response.message || "Unknown error",
                };
            }
        } catch (error) {
            console.error("Error updating teacher:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    // Future: add, update, delete teacher methods can be added here

    static async fetchTeacherById(teacher_id: string | number): Promise<{ error: boolean | string; teacher?: Teacher; token?: string; message?: string }> {
        try {
            const response = await apiClient.get<{ error: boolean | string; teacher?: Teacher; token?: string; message?: string }>(
                `/teachers/${teacher_id}`
            );
            if (response.data) {
                return response.data;
            } else {
                return {
                    error: true,
                    message: response.message || "Unknown error",
                };
            }
        } catch (error) {
            console.error("Error fetching teacher detail:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
}
