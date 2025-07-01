import { TokenService } from './tokenService';
import { vi } from 'vitest';

const mockLocalStorage = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();

global.localStorage = mockLocalStorage as any;

describe('TokenService', () => {
    const validPayload = { exp: Math.floor(Date.now() / 1000) + 60, iat: Math.floor(Date.now() / 1000) };
    const expiredPayload = { exp: Math.floor(Date.now() / 1000) - 60 };
    const base64 = (obj: object) => Buffer.from(JSON.stringify(obj)).toString('base64').replace(/=+$/, '');
    const makeToken = (payload: object) => `header.${base64(payload)}.sig`;

    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('stores and retrieves a valid token', () => {
        const token = makeToken(validPayload);
        TokenService.updateToken(token);
        expect(TokenService.getToken()).toBe(token);
    });

    it('removes token if expired on set', () => {
        const token = makeToken(expiredPayload);
        TokenService.updateToken(token);
        expect(TokenService.getToken()).toBeNull();
    });

    it('removes token if expired on get', () => {
        const token = makeToken(expiredPayload);
        localStorage.setItem('token', token);
        expect(TokenService.getToken()).toBeNull();
        expect(localStorage.getItem('token')).toBeNull();
    });

    it('clears token', () => {
        const token = makeToken(validPayload);
        TokenService.updateToken(token);
        TokenService.clearToken();
        expect(TokenService.getToken()).toBeNull();
    });

    it('decodes a valid token', () => {
        const token = makeToken(validPayload);
        const decoded = TokenService.decodeToken(token);
        expect(decoded).toMatchObject(validPayload);
    });

    it('returns null for invalid token format', () => {
        expect(TokenService.decodeToken('invalid')).toBeNull();
    });

    it('returns null for invalid base64', () => {
        expect(TokenService.decodeToken('a.b.c')).toBeNull();
    });

    it('isTokenExpired returns true for expired, false for valid', () => {
        const valid = makeToken(validPayload);
        const expired = makeToken(expiredPayload);
        expect(TokenService.isTokenExpired(valid)).toBe(false);
        expect(TokenService.isTokenExpired(expired)).toBe(true);
    });

    it('getTokenExpiration returns correct date', () => {
        const token = makeToken(validPayload);
        const date = TokenService.getTokenExpiration(token);
        expect(date).toBeInstanceOf(Date);
        expect(date!.getTime()).toBeCloseTo(validPayload.exp * 1000, -2);
    });

    it('getTimeUntilExpiration returns ms until expiration', () => {
        const token = makeToken(validPayload);
        const ms = TokenService.getTimeUntilExpiration(token)!;
        expect(ms).toBeGreaterThan(0);
    });

    it('willExpireSoon returns true if within threshold', () => {
        const soonExp = { exp: Math.floor(Date.now() / 1000) + 60 };
        const token = makeToken(soonExp);
        expect(TokenService.willExpireSoon(2, token)).toBe(true);
        expect(TokenService.willExpireSoon(0.01, token)).toBe(false);
    });

    it('addTokenUpdateListener and notifyListeners', () => {
        const token = makeToken(validPayload);
        const listener = vi.fn();
        const cleanup = TokenService.addTokenUpdateListener(listener);
        TokenService.updateToken(token);
        expect(listener).toHaveBeenCalledWith(token);
        cleanup();
        TokenService.updateToken(null);
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('hasValidToken returns true for valid, false for expired/empty', () => {
        const valid = makeToken(validPayload);
        TokenService.updateToken(valid);
        expect(TokenService.hasValidToken()).toBe(true);
        TokenService.clearToken();
        expect(TokenService.hasValidToken()).toBe(false);
        TokenService.updateToken(makeToken(expiredPayload));
        expect(TokenService.hasValidToken()).toBe(false);
    });

    it('getTokenSafely returns token or empty string', () => {
        expect(TokenService.getTokenSafely()).toBe('');
        const token = makeToken(validPayload);
        TokenService.updateToken(token);
        expect(TokenService.getTokenSafely()).toBe(token);
    });

    it('getDecodedToken returns decoded or null', () => {
        expect(TokenService.getDecodedToken()).toBeNull();
        const token = makeToken(validPayload);
        TokenService.updateToken(token);
        expect(TokenService.getDecodedToken()).toMatchObject(validPayload);
    });

    it('cleanupExpiredToken removes expired token', () => {
        const token = makeToken(expiredPayload);
        localStorage.setItem('token', token);
        expect(TokenService.cleanupExpiredToken()).toBe(true);
        expect(localStorage.getItem('token')).toBeNull();
    });

    it('cleanupExpiredToken does nothing for valid token', () => {
        const token = makeToken(validPayload);
        localStorage.setItem('token', token);
        expect(TokenService.cleanupExpiredToken()).toBe(false);
        expect(localStorage.getItem('token')).toBe(token);
    });

    it('isTokenExpired returns true if decodeToken returns null', () => {
        expect(TokenService.isTokenExpired('invalid.token')).toBe(true);
    });

    it('isTokenExpired returns true if decoded token has no exp', () => {
        // Create a valid JWT structure but no exp
        const payload = Buffer.from(JSON.stringify({})).toString('base64').replace(/=+$/, '');
        const token = `header.${payload}.sig`;
        expect(TokenService.isTokenExpired(token)).toBe(true);
    });

    it('willExpireSoon returns true if getTimeUntilExpiration returns null', () => {
        // No token in storage, so getTimeUntilExpiration returns null
        expect(TokenService.willExpireSoon(5)).toBe(true);
        // Or pass an invalid token
        expect(TokenService.willExpireSoon(5, 'invalid.token')).toBe(true);
    });
}); 