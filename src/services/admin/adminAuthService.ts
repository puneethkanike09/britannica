import { TokenService } from "../tokenService";
import { ApiResponse } from "../../types/global";
import { apiClient } from "../../utils/apiClient";

export class AdminAuthService {
    static async login(credentials: { login_id: string; password: string }): Promise<ApiResponse> {
        try {
            const response = await apiClient.post("/auth/admin-login", credentials, false);
            if (response.error === false || response.error === "false") {
                if (response.token) {
                    TokenService.updateToken(response.token);
                }
                return response;
            }
            return response;
        } catch (error) {
            console.error("Admin Login error:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Login failed",
            };
        }
    }

    static async logout(): Promise<{ error: boolean | string; message?: string }> {
        try {
            const response = await apiClient.post("/auth/logout", {}, true);
            TokenService.clearToken();
            return { error: response.error, message: response.message };
        } catch (error) {
            console.error("Logout API error:", error);
            TokenService.clearToken();
            return {
                error: true,
                message: error instanceof Error ? error.message : "Logout failed",
            };
        }
    }

    static isAuthenticated(): boolean {
        return TokenService.hasValidToken();
    }
} 