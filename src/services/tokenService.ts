export class TokenService {
    static updateToken(token: string | null) {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }

    static getToken(): string | null {
        return localStorage.getItem("token");
    }

    static clearToken() {
        localStorage.removeItem("token");
    }

    // Remove user-related methods
    // static setUser, static getUser, static clearUser are no longer needed
}