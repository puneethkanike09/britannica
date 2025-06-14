export interface User {
    id: string;
    login_id: string;
    role: "admin" | "educator";
    name: string;
    email?: string;
}
