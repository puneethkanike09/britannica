import { apiClient } from '../../utils/apiClient';

export const DashboardService = {
    async fetchDashboardCounts() {
        return await apiClient.get('/dashboard/count');
    },
}; 