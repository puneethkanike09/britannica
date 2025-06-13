// JWT payload type for our app
export interface JwtPayload {
    sub?: string;
    username?: string;
    roles?: string[];
    email?: string;
    exp?: number;
    [key: string]: unknown;
}
