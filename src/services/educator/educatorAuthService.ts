import { TokenService } from "../tokenService";
import { ApiResponse } from "../../types/global";
import { apiClient } from "../../utils/apiClient";
import { ForgotPasswordRequest, ForgotPasswordResponse, ResetPasswordRequest, ResetPasswordResponse } from "../../types/educator";

export class EducatorAuthService {
    static async login(credentials: { login_id: string; password: string }): Promise<ApiResponse> {
        try {
            const response = await apiClient.post("/auth/teacher-login", credentials, false);
            if (response.error === false || response.error === "false") {
                if (response.token) {
                    TokenService.updateToken(response.token);
                }
                return response;
            }
            return response;
        } catch (error) {
            console.error("Educator Login error:", error);
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

    static async forgotPassword(emailData: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
        try {
            const response = await apiClient.post("/auth/forgot-password", emailData, false);
            return {
                error: response.error,
                message: response.message,
            };
        } catch (error) {
            console.error("Forgot password error:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Failed to send password reset link",
            };
        }
    }

    static async resetPassword(passwordData: ResetPasswordRequest): Promise<ResetPasswordResponse> {
        try {
            const response = await apiClient.put("/auth/reset-password", passwordData, false);
            return {
                error: response.error,
                message: response.message,
            };
        } catch (error) {
            console.error("Reset password error:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Failed to reset password",
            };
        }
    }
} 