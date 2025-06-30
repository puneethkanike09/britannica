import { apiClient } from '../../utils/apiClient';

export class ThemeService {
    static async createTheme(payload: { theme_name: string; description?: string; status?: string }): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            const response = await apiClient.post('/theme/create', payload);
            return response;
        } catch (error) {
            console.error('Error creating theme:', error);
            return {
                error: true,
                message: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
} 