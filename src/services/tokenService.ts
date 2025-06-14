import { User } from "../types/global/user";

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

    // User helpers
    static setUser(user: User | null) {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }

    static getUser(): User | null {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }

    static clearUser() {
        localStorage.removeItem("user");
    }
}