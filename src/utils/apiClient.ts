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

// Token management for handling 401 retries
class TokenManager {
    private isRetrying = false;
    private retryQueue: Array<{
        resolve: (value: any) => void;
        reject: (error: any) => void;
    }> = [];

    async executeWithTokenRetry<T>(
        requestFn: () => Promise<Response>,
        endpoint: string
    ): Promise<ApiResponse<T>> {
        try {
            // First attempt
            const response = await requestFn();
            const result = await response.json();

            // Update token if present in response
            if (result.token) {
                TokenService.updateToken(result.token);
            }

            if (response.status === 401 && !this.isRetrying) {
                // Handle 401 with retry using fresh token
                return this.handleTokenRetry<T>(requestFn, endpoint);
            }

            if (!response.ok) {
                if (response.status === 403) {
                    TokenService.clearToken();
                    window.location.href = "/"; // Redirect to login
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
            console.error(`Error in ${endpoint}:`, error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    private async handleTokenRetry<T>(
        requestFn: () => Promise<Response>,
    ): Promise<ApiResponse<T>> {
        if (this.isRetrying) {
            // If already retrying, queue this request
            return new Promise((resolve, reject) => {
                this.retryQueue.push({ resolve, reject });
            });
        }

        this.isRetrying = true;

        try {
            // Wait a bit and get fresh token
            await new Promise(resolve => setTimeout(resolve, 100));
            const freshToken = TokenService.getToken();

            if (!freshToken) {
                TokenService.clearToken();
                window.location.href = "/";
                throw new Error("No token available");
            }

            // Retry the request with fresh token
            const retryResponse = await requestFn();
            const retryResult = await retryResponse.json();

            // Update token if present in retry response
            if (retryResult.token) {
                TokenService.updateToken(retryResult.token);
            }

            const result: ApiResponse<T> = {
                success: retryResponse.ok,
                data: retryResponse.ok ? retryResult : undefined,
                message: retryResult.message || (retryResponse.ok ? undefined : "Request failed"),
            };

            // Process queued requests
            this.retryQueue.forEach(({ resolve }) => resolve(result));
            this.retryQueue = [];

            return result;
        } catch (error) {
            const errorResult: ApiResponse<T> = {
                success: false,
                message: error instanceof Error ? error.message : "Retry failed",
            };

            // Reject queued requests
            this.retryQueue.forEach(({ reject }) => reject(errorResult));
            this.retryQueue = [];

            return errorResult;
        } finally {
            this.isRetrying = false;
        }
    }
}

const tokenManager = new TokenManager();

export const apiClient = {
    async post<T, D = unknown>(
        endpoint: string,
        data: D,
        includeToken: boolean = true
    ): Promise<ApiResponse<T>> {
        return requestQueue.enqueue(async () => {
            const createRequest = () => {
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

                return fetch(`${API_BASE_URL}${endpoint}`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify(data),
                });
            };

            return tokenManager.executeWithTokenRetry<T>(createRequest, `POST ${endpoint}`);
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

            return tokenManager.executeWithTokenRetry<T>(createRequest, `GET ${endpoint}`);
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
                        window.location.href = "/"; // Redirect to login
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
                        window.location.href = "/"; // Redirect to login
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

    /**
     * POST request with a custom token header (for password creation, etc.)
     * @param endpoint API endpoint
     * @param data Request body
     * @param customToken Token to send in the 'token' header
     */
    async postWithCustomToken<T, D = unknown>(
        endpoint: string,
        data: D,
        customToken: string
    ): Promise<ApiResponse<T>> {
        return requestQueue.enqueue(async () => {
            const headers: HeadersInit = {
                "Content-Type": "application/json",
                "API-KEY": API_KEY,
                "token": customToken,
            };
            try {
                const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify(data),
                });
                const result = await response.json();
                return {
                    success: response.ok && (result.error === false || result.error === "false"),
                    data: result,
                    message: result.message,
                };
            } catch (error) {
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Unknown error",
                };
            }
        });
    },
};