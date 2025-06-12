import { API_KEY } from "../config/constants/global";
import { TokenService } from "../services/tokenService";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

export const apiClient = {
    async post<T>(
        endpoint: string,
        data: any,
        includeToken: boolean = true
    ): Promise<ApiResponse<T>> {
        try {
            const headers: HeadersInit = {
                "Content-Type": "application/json",
                "API-KEY": API_KEY,
            };

            if (includeToken) {
                const token = TokenService.getToken();
                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }
            }

            const response = await fetch(`https://pbl.4edgeit.com/britanica/pbl_api${endpoint}`, {
                method: "POST",
                headers,
                body: JSON.stringify(data),
            });

            const result = await response.json();

            // Update token if present in response
            if (result.token) {
                TokenService.updateToken(result.token);
            }

            if (!response.ok) {
                return {
                    success: false,
                    message: result.message || "Request failed",
                };
            }

            return {
                success: true,
                data: result,
                message: result.message,
            };
        } catch (error) {
            console.error(`Error in POST ${endpoint}:`, error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    },

    async get<T>(
        endpoint: string,
        includeToken: boolean = true
    ): Promise<ApiResponse<T>> {
        try {
            const headers: HeadersInit = {
                "API-KEY": API_KEY,
            };

            if (includeToken) {
                const token = TokenService.getToken();
                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }
            }

            const response = await fetch(`https://pbl.4edgeit.com/britanica/pbl_api${endpoint}`, {
                method: "GET",
                headers,
            });

            const result = await response.json();

            // Update token if present in response
            if (result.token) {
                TokenService.updateToken(result.token);
            }

            if (!response.ok) {
                return {
                    success: false,
                    message: result.message || "Request failed",
                };
            }

            return {
                success: true,
                data: result,
                message: result.message,
            };
        } catch (error) {
            console.error(`Error in GET ${endpoint}:`, error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    },
};