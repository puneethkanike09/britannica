export class TokenService {
    private static tokenLock = false;
    private static updateListeners: Array<(token: string | null) => void> = [];

    static updateToken(token: string | null) {
        // Prevent concurrent token updates
        if (this.tokenLock) return;

        this.tokenLock = true;

        try {
            if (token) {
                localStorage.setItem("token", token);
            } else {
                localStorage.removeItem("token");
            }

            // Notify listeners about token update
            this.notifyListeners(token);
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