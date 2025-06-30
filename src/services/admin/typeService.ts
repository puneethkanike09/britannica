import { apiClient } from '../../utils/apiClient';

export class TypeService {
    static async createType(payload: { user_access_type_name: string; description?: string }): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            const response = await apiClient.post('/user_access_type/create', payload);
            return response;
        } catch (error) {
            console.error('Error creating type:', error);
            return {
                error: true,
                message: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
} 