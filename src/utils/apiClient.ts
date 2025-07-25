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

export const apiClient = {
    async post<D = unknown>(
        endpoint: string,
        data: D,
        includeToken: boolean = true,
        customHeaders: Record<string, string> = {}
    ): Promise<ApiResponse> {
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


                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        TokenService.clearToken();
                        return {
                            error: true,
                            message: "Authentication failed. Please login again.",
                        } as ApiResponse;
                    }
                    return {
                        error: true,
                        message: result.message || "Request failed",
                    } as ApiResponse;
                }

                return result as ApiResponse;
            } catch (error: unknown) {
                console.error("Error in request:", error);
                return {
                    error: true,
                    message: error instanceof Error ? error.message : "Unknown error",
                } as ApiResponse;
            }
        });
    },

    async get(
        endpoint: string,
        includeToken: boolean = true
    ): Promise<ApiResponse> {
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


                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        TokenService.clearToken();
                        return {
                            error: true,
                            message: "Authentication failed. Please login again.",
                        } as ApiResponse;
                    }
                    return {
                        error: true,
                        message: result.message || "Request failed",
                    } as ApiResponse;
                }

                return result as ApiResponse;
            } catch (error: unknown) {
                console.error("Error in request:", error);
                return {
                    error: true,
                    message: error instanceof Error ? error.message : "Unknown error",
                } as ApiResponse;
            }
        });
    },

    async getFileViewUrl(
        filePath: string,
        includeToken: boolean = true
    ): Promise<ApiResponse> {
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
                        TokenService.clearToken();
                        return {
                            error: true,
                            message: "Authentication failed, redirecting to login page",
                        } as ApiResponse;
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
                        error: true,
                        message: errorMessage,
                    } as ApiResponse;
                }

                const result = await response.text();
                return {
                    error: false,
                    data: result,
                    message: "File view URL retrieved successfully",
                } as ApiResponse;
            } catch (error: unknown) {
                console.error(`Error in GET file/view?filePath=${filePath}:`, error);
                return {
                    error: true,
                    message: error instanceof Error ? error.message : "Unknown error",
                } as ApiResponse;
            }
        });
    },

    async getFileDownloadUrl(
        filePath: string,
        includeToken: boolean = true
    ): Promise<ApiResponse> {
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
                        TokenService.clearToken();
                        return {
                            error: true,
                            message: "Authentication failed, redirecting to login page",
                        } as ApiResponse;
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
                        error: true,
                        message: errorMessage,
                    } as ApiResponse;
                }

                const result = await response.text();
                return {
                    error: false,
                    data: result,
                    message: "File download URL retrieved successfully",
                } as ApiResponse;
            } catch (error: unknown) {
                console.error(`Error in GET file/download?filePath=${filePath}:`, error);
                return {
                    error: true,
                    message: error instanceof Error ? error.message : "Unknown error",
                } as ApiResponse;
            }
        });
    },

    async delete<D = unknown>(
        endpoint: string,
        data?: D,
        includeToken: boolean = true,
        customHeaders: Record<string, string> = {}
    ): Promise<ApiResponse> {
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

                const requestOptions: RequestInit = {
                    method: "DELETE",
                    headers,
                };

                if (data) {
                    requestOptions.body = JSON.stringify(data);
                }

                const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

                const result = await response.json();

                if (result.token) {
                    TokenService.updateToken(result.token);
                }

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        TokenService.clearToken();
                        return {
                            error: true,
                            message: "Authentication failed. Please login again.",
                        } as ApiResponse;
                    }
                    return {
                        error: true,
                        message: result.message || "Request failed",
                    } as ApiResponse;
                }

                return result as ApiResponse;
            } catch (error: unknown) {
                console.error("Error in DELETE request:", error);
                return {
                    error: true,
                    message: error instanceof Error ? error.message : "Unknown error",
                } as ApiResponse;
            }
        });
    },

    async put<D = unknown>(
        endpoint: string,
        data: D,
        includeToken: boolean = true,
        customHeaders: Record<string, string> = {}
    ): Promise<ApiResponse> {
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
                    method: "PUT",
                    headers,
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (result.token) {
                    TokenService.updateToken(result.token);
                }

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        TokenService.clearToken();
                        return {
                            error: true,
                            message: "Authentication failed. Please login again.",
                        } as ApiResponse;
                    }
                    return {
                        error: true,
                        message: result.message || "Request failed",
                    } as ApiResponse;
                }

                return result as ApiResponse;
            } catch (error: unknown) {
                console.error("Error in PUT request:", error);
                return {
                    error: true,
                    message: error instanceof Error ? error.message : "Unknown error",
                } as ApiResponse;
            }
        });
    },

    async postFormData(
        endpoint: string,
        formData: FormData,
        includeToken: boolean = true,
        customHeaders: Record<string, string> = {}
    ): Promise<ApiResponse> {
        return requestQueue.enqueue(async () => {
            try {
                const headers: HeadersInit = {
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
                    body: formData,
                });

                const result = await response.json();

                if (result.token) {
                    TokenService.updateToken(result.token);
                }

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        TokenService.clearToken();
                        return {
                            error: true,
                            message: "Authentication failed. Please login again.",
                        } as ApiResponse;
                    }
                    return {
                        error: true,
                        message: result.message || "Request failed",
                    } as ApiResponse;
                }

                return result as ApiResponse;
            } catch (error: unknown) {
                console.error("Error in multipart/form-data request:", error);
                return {
                    error: true,
                    message: error instanceof Error ? error.message : "Unknown error",
                } as ApiResponse;
            }
        });
    },

    async putFormData(
        endpoint: string,
        formData: FormData,
        includeToken: boolean = true,
        customHeaders: Record<string, string> = {}
    ): Promise<ApiResponse> {
        return requestQueue.enqueue(async () => {
            try {
                const headers: HeadersInit = {
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
                    method: "PUT",
                    headers,
                    body: formData,
                });

                const result = await response.json();

                if (result.token) {
                    TokenService.updateToken(result.token);
                }

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        TokenService.clearToken();
                        return {
                            error: true,
                            message: "Authentication failed. Please login again.",
                        } as ApiResponse;
                    }
                    return {
                        error: true,
                        message: result.message || "Request failed",
                    } as ApiResponse;
                }

                return result as ApiResponse;
            } catch (error: unknown) {
                console.error("Error in multipart/form-data PUT request:", error);
                return {
                    error: true,
                    message: error instanceof Error ? error.message : "Unknown error",
                } as ApiResponse;
            }
        });
    },

    async fetchPdfBlob(endpoint: string, payload: any): Promise<Blob> {
        const headers: HeadersInit = {
            "API-KEY": API_KEY,
            "Content-Type": "application/json",
        };
        const token = TokenService.getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to fetch PDF");
        return await response.blob();
    },

    async fetchPdfBlobGet(endpoint: string, params: Record<string, string>): Promise<Blob> {
        const headers: HeadersInit = {
            "API-KEY": API_KEY,
        };
        const token = TokenService.getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;

        // Build query string
        const query = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}${endpoint}?${query}`;

        const response = await fetch(url, {
            method: "GET",
            headers,
        });

        if (!response.ok) throw new Error("Failed to fetch PDF");
        return await response.blob();
    },
};