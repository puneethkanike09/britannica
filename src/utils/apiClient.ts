import { API_KEY } from "../config/constants/global";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

// Optimized Token Service with better concurrency handling
export class TokenService {
    private static token: string | null = null;
    private static initialized = false;
    private static updateListeners: Set<(token: string | null) => void> = new Set();

    // Use a single promise for token updates to prevent race conditions
    private static updatePromise: Promise<void> | null = null;

    // Initialize token from localStorage once
    private static initialize() {
        if (!this.initialized) {
            this.token = localStorage.getItem("token");
            this.initialized = true;
        }
    }

    static async updateToken(newToken: string | null): Promise<void> {
        // If there's already an update in progress, wait for it
        if (this.updatePromise) {
            await this.updatePromise;
        }

        // Create new update promise
        this.updatePromise = this.performUpdate(newToken);

        try {
            await this.updatePromise;
        } finally {
            this.updatePromise = null;
        }
    }

    private static async performUpdate(newToken: string | null): Promise<void> {
        this.initialize();

        // Only update if token actually changed
        if (this.token === newToken) {
            return;
        }

        this.token = newToken;

        // Update localStorage
        try {
            if (newToken) {
                localStorage.setItem("token", newToken);
            } else {
                localStorage.removeItem("token");
            }
        } catch (error) {
            console.error('Failed to update localStorage:', error);
            // Don't throw - continue with in-memory token
        }

        // Notify listeners (using Set for better performance)
        this.notifyListeners(newToken);
    }

    static getToken(): string | null {
        this.initialize();
        return this.token;
    }

    static clearToken(): Promise<void> {
        return this.updateToken(null);
    }

    static addTokenUpdateListener(listener: (token: string | null) => void): () => void {
        this.updateListeners.add(listener);

        // Return cleanup function
        return () => {
            this.updateListeners.delete(listener);
        };
    }

    private static notifyListeners(token: string | null): void {
        this.updateListeners.forEach(listener => {
            try {
                listener(token);
            } catch (error) {
                console.error('Error in token update listener:', error);
            }
        });
    }

    static hasValidToken(): boolean {
        const token = this.getToken();
        return !!(token && token.trim());
    }

    static getTokenSafely(): string {
        return this.getToken() || '';
    }
}

// Simplified Request Queue with better error handling
class RequestQueue {
    private queue: Array<() => Promise<any>> = [];
    private processing = false;
    private readonly maxConcurrent = 5; // Limit concurrent requests
    private activeRequests = 0;

    async enqueue<T>(request: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            const wrappedRequest = async () => {
                try {
                    const result = await request();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };

            this.queue.push(wrappedRequest);
            this.processQueue();
        });
    }

    private async processQueue(): Promise<void> {
        if (this.processing || this.activeRequests >= this.maxConcurrent) {
            return;
        }

        this.processing = true;

        while (this.queue.length > 0 && this.activeRequests < this.maxConcurrent) {
            const request = this.queue.shift()!;
            this.activeRequests++;

            // Process request without awaiting (allows concurrency)
            request().finally(() => {
                this.activeRequests--;
                this.processQueue(); // Process next batch
            });
        }

        this.processing = false;
    }
}

// Optimized Token Manager with better retry logic
class TokenManager {
    private refreshPromise: Promise<void> | null = null;

    async executeWithTokenRetry<T>(
        requestFn: () => Promise<Response>
    ): Promise<ApiResponse<T>> {
        try {
            let response = await requestFn();
            let result = await this.parseResponse(response);

            // Update token if present in response
            if (result.token) {
                await TokenService.updateToken(result.token);
            }

            // Handle 401 with single retry
            if (response.status === 401) {
                const retryResult = await this.handleTokenRefresh(requestFn);
                if (retryResult) {
                    response = retryResult.response;
                    result = retryResult.result;
                }
            }

            // Handle 403 - clear token and redirect
            if (response.status === 403) {
                await TokenService.clearToken();
                this.redirectToLogin();
                return {
                    success: false,
                    message: "Access forbidden. Please login again.",
                };
            }

            return {
                success: response.ok,
                data: response.ok ? result : undefined,
                message: result.message || (response.ok ? undefined : "Request failed"),
            };

        } catch (error) {
            console.error("Error in request:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    private async handleTokenRefresh(
        requestFn: () => Promise<Response>
    ): Promise<{ response: Response; result: any } | null> {
        // Use single refresh promise to prevent multiple refresh attempts
        if (this.refreshPromise) {
            await this.refreshPromise;
        } else {
            this.refreshPromise = this.performTokenRefresh();
            await this.refreshPromise;
            this.refreshPromise = null;
        }

        // Retry request with refreshed token
        try {
            const response = await requestFn();
            const result = await this.parseResponse(response);

            if (result.token) {
                await TokenService.updateToken(result.token);
            }

            return { response, result };
        } catch (error) {
            console.error("Retry request failed:", error);
            return null;
        }
    }

    private async performTokenRefresh(): Promise<void> {
        // Small delay to allow other requests to queue up
        await new Promise(resolve => setTimeout(resolve, 50));

        // Check if we still have a valid token after delay
        if (!TokenService.hasValidToken()) {
            await TokenService.clearToken();
            this.redirectToLogin();
            throw new Error("No valid token available");
        }
    }

    private async parseResponse(response: Response): Promise<any> {
        const contentType = response.headers.get("content-type");

        if (contentType?.includes("application/json")) {
            return await response.json();
        } else {
            const text = await response.text();
            return { message: text };
        }
    }

    private redirectToLogin(): void {
        // Use replace to prevent back button issues
        window.location.replace("/");
    }
}

// Create singleton instances
const requestQueue = new RequestQueue();
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
};