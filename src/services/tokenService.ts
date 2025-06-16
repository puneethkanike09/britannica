export class TokenService {
    private static tokenLock = false;

    private static updateQueue: Array<{
        token: string | null;
        resolve: () => void;
    }> = [];
    private static updateListeners: Array<(token: string | null) => void> = [];

    static async updateToken(token: string | null) {
        if (this.tokenLock) {
            // Queue the token update
            return new Promise<void>(resolve => {
                this.updateQueue.push({ token, resolve });
            });
        }

        this.tokenLock = true;

        try {
            if (token) {
                localStorage.setItem("token", token);
            } else {
                localStorage.removeItem("token");
            }

            // Notify listeners
            this.notifyListeners(token);

            // Process queued updates
            while (this.updateQueue.length > 0) {
                const { token: queuedToken, resolve } = this.updateQueue.shift()!;
                if (queuedToken) {
                    localStorage.setItem("token", queuedToken);
                } else {
                    localStorage.removeItem("token");
                }
                this.notifyListeners(queuedToken);
                resolve();
            }
        } finally {
            this.tokenLock = false;
        }
    }

    static getToken(): string | null {
        return localStorage.getItem("token");
    }

    static clearToken() {
        this.updateToken(null);
    }

    // Add listener for token updates
    static addTokenUpdateListener(listener: (token: string | null) => void) {
        this.updateListeners.push(listener);

        // Return cleanup function
        return () => {
            const index = this.updateListeners.indexOf(listener);
            if (index > -1) {
                this.updateListeners.splice(index, 1);
            }
        };
    }

    private static notifyListeners(token: string | null) {
        this.updateListeners.forEach(listener => {
            try {
                listener(token);
            } catch (error) {
                console.error('Error in token update listener:', error);
            }
        });
    }

    // Check if token exists and is not empty
    static hasValidToken(): boolean {
        const token = this.getToken();
        return !!(token && token.trim());
    }

    // Get token with fallback
    static getTokenSafely(): string {
        return this.getToken() || '';
    }
}