import { apiClient } from '../../utils/apiClient';

export class GradeService {
    static async createGrade(payload: { grade_name: string; description?: string; token?: string }): Promise<{ error: boolean | string; token?: string; message?: string }> {
        try {
            const response = await apiClient.post('/grade/create', payload);
            return response;
        } catch (error) {
            console.error('Error creating grade:', error);
            return {
                error: true,
                message: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
} 