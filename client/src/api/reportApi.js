import api from './axiosInstance';

export const getRevenueAnalytics = async () => (await api.get('/reports/revenue-analytics')).data;
