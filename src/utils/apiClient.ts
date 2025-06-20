import { API_KEY } from "../config/constants/global";
import { TokenService } from "../services/tokenService";
import { ApiResponse } from "../types/global";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface QueueItem<T> {
    request: () => Promise<T>;
    resolve: (value: T) => void;
    reject: (error: unknown) => void;
}

class RequestQueue {
    private queue: QueueItem<unknown>[] = [];
    private processing = false;

    async enqueue<T>(request: () => Promise<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.queue.push({
                request: request as () => Promise<unknown>,
                resolve: resolve as (value: unknown) => void,
                reject
            });
            this.processQueue();
        });
    }

    private async processQueue(): Promise<void> {
        if (this.processing || this.queue.length === 0) return;

        this.processing = true;

        while (this.queue.length > 0) {
            const item = this.queue.shift();
            if (!item) break;

            const { request, resolve, reject } = item;
            try {
                const result = await request();
                resolve(result);
            } catch (error: unknown) {
                reject(error);
            }
        }

        this.processing = false;
    }
}

const requestQueue = new RequestQueue();

const handle401Error = (endpoint: string): void => {
    TokenService.clearToken();
    // Redirect based on endpoint
    if (endpoint.includes('/school') || endpoint.includes('/teacher')) {
        window.location.href = '/admin-login';
    } else {
        window.location.href = '/educator-login';
    }
};

export const apiClient = {
    async post<T, D = unknown>(
        endpoint: string,
        data: D,
        includeToken: boolean = true,
        customHeaders: Record<string, string> = {}
    ): Promise<ApiResponse<T>> {
        return requestQueue.enqueue(async () => {
            try {
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

                const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (result.token) {
                    TokenService.updateToken(result.token);
                }

                if (response.status === 401) {
                    handle401Error(endpoint);
                    return {
                        success: false,
                        message: "Authentication failed. Redirecting to login.",
                    } as ApiResponse<T>;
                }

                if (!response.ok) {
                    if (response.status === 403) {
                        TokenService.clearToken();
                    }
                    return {
                        success: false,
                        message: result.message || "Request failed",
                    } as ApiResponse<T>;
                }

                return {
                    success: true,
                    data: result,
                    message: result.message,
                } as ApiResponse<T>;
            } catch (error: unknown) {
                console.error("Error in request:", error);
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Unknown error",
                } as ApiResponse<T>;
            }
        });
    },

    async get<T>(
        endpoint: string,
        includeToken: boolean = true
    ): Promise<ApiResponse<T>> {
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

                const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                    method: "GET",
                    headers,
                });

                const result = await response.json();

                if (result.token) {
                    TokenService.updateToken(result.token);
                }

                if (response.status === 401) {
                    handle401Error(endpoint);
                    return {
                        success: false,
                        message: "Authentication failed. Redirecting to login.",
                    } as ApiResponse<T>;
                }

                if (!response.ok) {
                    if (response.status === 403) {
                        TokenService.clearToken();
                    }
                    return {
                        success: false,
                        message: result.message || "Request failed",
                    } as ApiResponse<T>;
                }

                return {
                    success: true,
                    data: result,
                    message: result.message,
                } as ApiResponse<T>;
            } catch (error: unknown) {
                console.error("Error in request:", error);
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Unknown error",
                } as ApiResponse<T>;
            }
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

                const endpoint = `/file/view?filePath=${encodeURIComponent(filePath)}`;
                const response = await fetch(
                    `${API_BASE_URL}${endpoint}`,
                    {
                        method: "GET",
                        headers,
                    }
                );

                if (!response.ok) {
                    if (response.status === 401) {
                        handle401Error(endpoint);
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
            } catch (error: unknown) {
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

                const endpoint = `/file/download?filePath=${encodeURIComponent(filePath)}`;
                const response = await fetch(
                    `${API_BASE_URL}${endpoint}`,
                    {
                        method: "GET",
                        headers,
                    }
                );

                if (!response.ok) {
                    if (response.status === 401) {
                        handle401Error(endpoint);
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
            } catch (error: unknown) {
                console.error(`Error in GET file/download?filePath=${filePath}:`, error);
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Unknown error",
                };
            }
        });
    },
};