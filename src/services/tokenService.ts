export interface DecodedToken {
    exp: number;
    iat?: number;
    [key: string]: any;
}

export class TokenService {
    private static tokenLock = false;
    private static updateListeners: Array<(token: string | null) => void> = [];

    static updateToken(token: string | null) {
        if (this.tokenLock) return;

        this.tokenLock = true;

        try {
            if (token) {
                // Validate token before storing
                if (this.isTokenExpired(token)) {
                    console.warn('Attempted to store an expired token');
                    token = null;
                }
            }

            if (token) {
                localStorage.setItem("token", token);
            } else {
                localStorage.removeItem("token");
            }

            this.notifyListeners(token);
        } finally {
            this.tokenLock = false;
        }
    }

    static getToken(): string | null {
        const token = localStorage.getItem("token");

        if (token && this.isTokenExpired(token)) {
            // Token is expired, clear it automatically
            this.clearToken();
            return null;
        }

        return token;
    }

    static clearToken() {
        this.updateToken(null);
    }

    // Decode JWT token payload
    static decodeToken(token: string): DecodedToken | null {
        try {
            // JWT has 3 parts separated by dots: header.payload.signature
            const parts = token.split('.');
            if (parts.length !== 3) {
                return null;
            }

            // Decode the payload (second part)
            const payload = parts[1];

            // Add padding if needed for base64 decoding
            const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);

            // Decode base64
            const decodedPayload = atob(paddedPayload);

            return JSON.parse(decodedPayload);
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    // Check if token is expired
    static isTokenExpired(token: string): boolean {
        const decoded = this.decodeToken(token);

        if (!decoded || !decoded.exp) {
            // If we can't decode or no expiration, consider it invalid/expired
            return true;
        }

        // JWT exp is in seconds, Date.now() is in milliseconds
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    }

    // Get token expiration date
    static getTokenExpiration(token?: string): Date | null {
        const tokenToCheck = token || this.getToken();

        if (!tokenToCheck) return null;

        const decoded = this.decodeToken(tokenToCheck);

        if (!decoded || !decoded.exp) return null;

        // Convert from seconds to milliseconds
        return new Date(decoded.exp * 1000);
    }

    // Get time until token expires (in milliseconds)
    static getTimeUntilExpiration(token?: string): number | null {
        const expirationDate = this.getTokenExpiration(token);

        if (!expirationDate) return null;

        return expirationDate.getTime() - Date.now();
    }

    // Check if token will expire within specified minutes
    static willExpireSoon(minutes: number = 5, token?: string): boolean {
        const timeUntilExpiration = this.getTimeUntilExpiration(token);

        if (timeUntilExpiration === null) return true;

        return timeUntilExpiration <= (minutes * 60 * 1000);
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

    // Check if token exists, is not empty, and is not expired
    static hasValidToken(): boolean {
        const token = this.getToken(); // This already checks expiration
        return !!(token && token.trim());
    }

    // Get token with fallback
    static getTokenSafely(): string {
        return this.getToken() || '';
    }

    // Get decoded token payload
    static getDecodedToken(): DecodedToken | null {
        const token = this.getToken();
        return token ? this.decodeToken(token) : null;
    }

    // Auto-refresh helper - call this periodically to clean expired tokens
    static cleanupExpiredToken(): boolean {
        const token = localStorage.getItem("token");
        if (token && this.isTokenExpired(token)) {
            this.clearToken();
            return true; // Token was expired and removed
        }
        return false; // Token is still valid or doesn't exist
    }
}