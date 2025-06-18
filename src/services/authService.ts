import { apiClient } from "../utils/apiClient";
import { TokenService } from "./tokenService";
import { ApiResponse } from "../types/global";

export class AuthService {
    static async login(
        credentials: { login_id: string; password: string },
        endpoint: "/auth/admin-login" | "/auth/teacher-login"
    ): Promise<ApiResponse<{ token: string }>> {
        try {
            const response = await apiClient.post<{ token: string }>(endpoint, credentials, false);
            if (response.success && response.data?.token) {
                TokenService.updateToken(response.data.token);
                return {
                    success: true,
                    data: { token: response.data.token },
                    message: response.message,
                };
            }
            return {
                success: false,
                message: response.message,
            };
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Login failed",
            };
        }
    }

    static async logout(): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await apiClient.post("/auth/logout", {}, true);
            TokenService.clearToken();
            return { success: response.success, message: response.message };
        } catch (error) {
            console.error("Logout API error:", error);
            TokenService.clearToken();
            return {
                success: false,
                message: error instanceof Error ? error.message : "Logout failed",
            };
        }
    }

    static isAuthenticated(): boolean {
        return TokenService.hasValidToken();
    }
}