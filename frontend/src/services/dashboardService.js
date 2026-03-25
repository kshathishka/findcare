import api from '../lib/api';

export const dashboardService = {
  getAdminStats: () => api.get('/api/dashboard/admin/stats').then((r) => r.data),
};
