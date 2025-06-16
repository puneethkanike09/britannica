import { API_KEY } from "../config/constants/global";
import { TokenService } from "../services/tokenService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

// Request queue to handle concurrent requests
class RequestQueue {
    private queue: Array<{
        request: () => Promise<any>;
        resolve: (value: any) => void;
        reject: (error: any) => void;
    }> = [];
    private processing = false;

    async enqueue<T>(request: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push({ request, resolve, reject });
            this.processQueue();
        });
    }

    private async processQueue() {
        if (this.processing || this.queue.length === 0) return;

        this.processing = true;

        while (this.queue.length > 0) {
            const { request, resolve, reject } = this.queue.shift()!;
            try {
                const result = await request();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }

        this.processing = false;
    }
}

// Create a single instance of the request queue
const requestQueue = new RequestQueue();

// Helper function to handle 401 errors consistently
const handle401Error = (): void => {
    TokenService.clearToken();
    window.location.href = "/";
};

// Token management for handling 401 retries
class TokenManager {
    async executeWithTokenRetry<T>(
        requestFn: () => Promise<Response>
    ): Promise<ApiResponse<T>> {
        try {
            // First attempt
            const response = await requestFn();
            const result = await response.json();

            // Update token if present in response
            if (result.token) {
                TokenService.updateToken(result.token);
            }

            if (response.status === 401) {
                // Always handle 401 by clearing token and redirecting
                handle401Error();
                return {
                    success: false,
                    message: "Authentication failed. Redirecting to login.",
                };
            }

            if (!response.ok) {
                if (response.status === 403) {
                    TokenService.clearToken();
                }
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
            console.error("Error in request:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
}

const tokenManager = new TokenManager();

export const apiClient = {
    async post<T, D = unknown>(
        endpoint: string,
        data: D,
        includeToken: boolean = true,
        customHeaders: Record<string, string> = {}
    ): Promise<ApiResponse<T>> {
        return requestQueue.enqueue(async () => {
            const createRequest = () => {
                const headers: HeadersInit = {
                    "Content-Type": "application/json",
                    "API-KEY": API_KEY,
                    ...customHeaders,
                };

                if (includeToken) {
                    const token = TokenService.getToken();
                    if (token) {
                        headers["Authorization"] = `Bearer ${token}`;
                    }
                }

                return fetch(`${API_BASE_URL}${endpoint}`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify(data),
                });
            };

            return tokenManager.executeWithTokenRetry<T>(createRequest);
        });
    },

    async get<T>(
        endpoint: string,
        includeToken: boolean = true
    ): Promise<ApiResponse<T>> {
        return requestQueue.enqueue(async () => {
            const createRequest = () => {
                const headers: HeadersInit = {
                    "API-KEY": API_KEY,
                };

                if (includeToken) {
                    const token = TokenService.getToken();
                    if (token) {
                        headers["Authorization"] = `Bearer ${token}`;
                    }
                }

                return fetch(`${API_BASE_URL}${endpoint}`, {
                    method: "GET",
                    headers,
                });
            };

            return tokenManager.executeWithTokenRetry<T>(createRequest);
        });
    },

    async getFileViewUrl(
        filePath: string,
        includeToken: boolean = true
    ): Promise<ApiResponse<string>> {
        return requestQueue.enqueue(async () => {
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
                    `${API_BASE_URL}/file/view?filePath=${encodeURIComponent(filePath)}`,
                    {
                        method: "GET",
                        headers,
                    }
                );

                if (!response.ok) {
                    // Handle 401 errors
                    if (response.status === 401) {
                        handle401Error();
                        return {
                            success: false,
                            message: "Authentication failed. Redirecting to login.",
                        };
                    }

                    const contentType = response.headers.get("Content-Type") || "";
                    let errorMessage: string;

                    if (contentType.includes("application/json")) {
                        const result = await response.json();
                        errorMessage = result.message || "Failed to get file view URL";
                    } else {
                        const text = await response.text();
                        errorMessage = text || "Failed to get file view URL";
                    }

                    if (response.status === 403) {
                        TokenService.clearToken();
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
        });
    },

    async getFileDownloadUrl(
        filePath: string,
        includeToken: boolean = true
    ): Promise<ApiResponse<string>> {
        return requestQueue.enqueue(async () => {
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
                    `${API_BASE_URL}/file/download?filePath=${encodeURIComponent(filePath)}`,
                    {
                        method: "GET",
                        headers,
                    }
                );

                if (!response.ok) {
                    // Handle 401 errors
                    if (response.status === 401) {
                        handle401Error();
                        return {
                            success: false,
                            message: "Authentication failed. Redirecting to login.",
                        };
                    }

                    const contentType = response.headers.get("Content-Type") || "";
                    let errorMessage: string;

                    if (contentType.includes("application/json")) {
                        const result = await response.json();
                        errorMessage = result.message || "Failed to get file download URL";
                    } else {
                        const text = await response.text();
                        errorMessage = text || "Failed to get file download URL";
                    }

                    if (response.status === 403) {
                        TokenService.clearToken();
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
        });
    },
};