import { apiClient } from "../utils/apiClient";
import { JwtPayload } from "../types/global/jwt";
import { TokenService } from "./tokenService";
import { User } from "../types/global/user";


interface AuthResponse {
    token: string;
    message: string;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

export class AuthService {
    static decodeToken(token: string): JwtPayload | null {
        try {
            const payload = token.split(".")[1];
            const decoded = atob(payload);
            return JSON.parse(decoded) as JwtPayload;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    }

    static async login(
        credentials: {
            login_id: string;
            password: string;
        },
        role: "admin" | "educator"
    ): Promise<ApiResponse<AuthResponse & { user: User }>> {
        try {
            // Use different endpoints based on role
            const endpoint = role === "admin" ? "/auth/admin-login" : "/auth/teacher-login";

            const response = await apiClient.post<AuthResponse>(
                endpoint,
                credentials,
                false // No token for login
            );

            if (response.success && response.data?.token) {
                const token = response.data.token;
                TokenService.updateToken(token);

                const tokenPayload = this.decodeToken(token);
                if (tokenPayload) {
                    const userRole =
                        tokenPayload.roles?.[0]?.toLowerCase() === "admin"
                            ? ("admin" as const)
                            : ("educator" as const);
                    const user: User = {
                        id: tokenPayload.sub || tokenPayload.username || "",
                        login_id: tokenPayload.username || tokenPayload.sub || "",
                        role: userRole,
                        name: tokenPayload.username || "",
                        email: tokenPayload.email || "",
                    };
                    TokenService.setUser(user);

                    return {
                        success: true,
                        data: {
                            token,
                            user,
                            message: response.data.message,
                        },
                        message: response.data.message,
                    };
                }
            }

            return {
                success: response.success,
                data: undefined,
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
            // Call the logout API
            const response = await apiClient.post("/auth/logout", {}, true); // true means include token
            // Always clear local storage regardless of API response
            TokenService.clearToken();
            TokenService.clearUser();
            return { success: response.success, message: response.message };
        } catch (error) {
            console.error("Logout API error:", error);
            TokenService.clearToken();
            TokenService.clearUser();
            return {
                success: false,
                message: error instanceof Error ? error.message : "Logout failed",
            };
        }
    }

    static isAuthenticated(): boolean {
        const token = TokenService.getToken();
        if (!token) return false;

        try {
            const payload = this.decodeToken(token);
            const exp = payload?.exp;
            if (exp) {
                const currentTime = Math.floor(Date.now() / 1000);
                return exp > currentTime;
            }
            return true;
        } catch (error) {
            console.error("Error checking token validity:", error);
            return false;
        }
    }

    static getUser(): User | null {
        return TokenService.getUser();
    }
}