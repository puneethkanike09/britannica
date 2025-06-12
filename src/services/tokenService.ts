export class TokenService {
    static updateToken(token: string | null) {
        if (token) {
            localStorage.setItem("token", token);
        }
    }

    static getToken(): string | null {
        return localStorage.getItem("token");
    }

    static clearToken() {
        localStorage.removeItem("token");
    }
}