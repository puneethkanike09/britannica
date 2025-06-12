import { apiClient } from "../utils/apiClient";

interface AuthResponse {
    token: string;
    message: string;
}

interface User {
    id: string;
    login_id: string;
    role: "admin" | "educator";
    name: string;
    email?: string;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

export class AuthService {
    static decodeToken(token: string): any {
        try {
            const payload = token.split(".")[1];
            const decoded = atob(payload);
            return JSON.parse(decoded);
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    }

    static async login(credentials: {
        login_id: string;
        password: string;
    }): Promise<ApiResponse<AuthResponse & { user: User }>> {
        try {
            const response = await apiClient.post<AuthResponse>(
                "https://pbl.4edgeit.com/britanica/pbl_api/auth/login",
                credentials,
                false // No token for login
            );

            if (response.success && response.data?.token) {
                const token = response.data.token;
                localStorage.setItem("token", token);

                const tokenPayload = this.decodeToken(token);
                if (tokenPayload) {
                    const userRole =
                        tokenPayload.roles?.[0]?.toLowerCase() === "admin"
                            ? ("admin" as const)
                            : ("educator" as const);
                    const user: User = {
                        id: tokenPayload.sub || tokenPayload.username,
                        login_id: tokenPayload.username || tokenPayload.sub,
                        role: userRole,
                        name: tokenPayload.username,
                        email: tokenPayload.email || "",
                    };
                    localStorage.setItem("user", JSON.stringify(user));

                    return {
                        success: true,
                        data: {
                            token,
                            user,
                            message: response.data.message,
                        },
                        message: response.data.message,
                    };
                } else {
                    // Handle invalid token payload
                    return {
                        success: false,
                        message: "Invalid token payload",
                    };
                }
            }

            // Return a failure response if login was not successful
            return {
                success: false,
                message: response.message || "Login failed",
            };
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Login failed",
            };
        }
    }

    static logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    static isAuthenticated(): boolean {
        const token = localStorage.getItem("token");
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
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }
}