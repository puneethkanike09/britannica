import { API_KEY } from "../config/constants/global";
import { TokenService } from "../services/tokenService";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

export const apiClient = {
    async post<T, D = unknown>(
        endpoint: string,
        data: D,
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

            const response = await fetch(`https://pbl.4edgeit.com/britanica_pbl${endpoint}`, {
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

            const response = await fetch(`https://pbl.4edgeit.com/britanica_pbl${endpoint}`, {
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

    async getFileViewUrl(
        filePath: string,
        includeToken: boolean = true
    ): Promise<ApiResponse<string>> {
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

            const response = await fetch(
                `https://pbl.4edgeit.com/britanica_pbl/file/view?filePath=${encodeURIComponent(filePath)}`,
                {
                    method: "GET",
                    headers,
                }
            );

            if (!response.ok) {
                const contentType = response.headers.get("Content-Type") || "";
                let errorMessage: string;

                if (contentType.includes("application/json")) {
                    const result = await response.json();
                    errorMessage = result.message || "Failed to get file view URL";
                } else {
                    // Handle plain text or other content types
                    const text = await response.text();
                    errorMessage = text || "Failed to get file view URL";
                }

                return {
                    success: false,
                    message: errorMessage,
                };
            }

            const result = await response.text();
            return {
                success: true,
                data: result,
                message: "File view URL retrieved successfully",
            };
        } catch (error) {
            console.error(`Error in GET file/view?filePath=${filePath}:`, error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    },

    async getFileDownloadUrl(
        filePath: string,
        includeToken: boolean = true
    ): Promise<ApiResponse<string>> {
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

            const response = await fetch(
                `https://pbl.4edgeit.com/britanica_pbl/file/download?filePath=${encodeURIComponent(filePath)}`,
                {
                    method: "GET",
                    headers,
                }
            );

            if (!response.ok) {
                const contentType = response.headers.get("Content-Type") || "";
                let errorMessage: string;

                if (contentType.includes("application/json")) {
                    const result = await response.json();
                    errorMessage = result.message || "Failed to get file download URL";
                } else {
                    // Handle plain text or other content types
                    const text = await response.text();
                    errorMessage = text || "Failed to get file download URL";
                }

                return {
                    success: false,
                    message: errorMessage,
                };
            }

            const result = await response.text();
            return {
                success: true,
                data: result,
                message: "File download URL retrieved successfully",
            };
        } catch (error) {
            console.error(`Error in GET file/download?filePath=${filePath}:`, error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    },
};