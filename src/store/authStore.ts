import { create } from 'zustand';
import { AdminAuthService } from '../services/admin/adminAuthService';
import { EducatorAuthService } from '../services/educator/educatorAuthService';
import { TokenService } from '../services/tokenService';

interface AuthState {
    isAuthenticated: boolean;
    isInitialized: boolean;
    login: (
        login_id: string,
        password: string,
        endpoint: '/auth/admin-login' | '/auth/teacher-login'
    ) => Promise<void>;
    logout: () => Promise<{ error: boolean | string; message?: string }>;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    isInitialized: false,

    initialize: async () => {
        const isAuth = AdminAuthService.isAuthenticated() || EducatorAuthService.isAuthenticated();
        set({ isAuthenticated: isAuth, isInitialized: true });
    },

    login: async (login_id, password, endpoint) => {
        let response;
        if (endpoint === '/auth/admin-login') {
            response = await AdminAuthService.login({ login_id, password });
        } else {
            response = await EducatorAuthService.login({ login_id, password });
        }
        if (response.error === false || response.error === 'false') {
            set({ isAuthenticated: true });
        } else {
            throw new Error(response.message || 'Login failed');
        }
    },

    logout: async () => {
        try {
            await AdminAuthService.logout();
            await EducatorAuthService.logout();
            set({ isAuthenticated: false });
            return { error: false };
        } catch (error: any) {
            set({ isAuthenticated: false });
            throw error;
        }
    },
}));

// Listen for token changes and update isAuthenticated accordingly
TokenService.addTokenUpdateListener(() => {
    const isAuth = AdminAuthService.isAuthenticated() || EducatorAuthService.isAuthenticated();
    useAuthStore.setState({ isAuthenticated: isAuth });
});

// Optionally, initialize auth state on import
useAuthStore.getState().initialize(); 