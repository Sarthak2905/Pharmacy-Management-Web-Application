import api from './axiosInstance';

export const getDashboardStats = async () => (await api.get('/dashboard/stats')).data;
export const getDashboardAlerts = async () => (await api.get('/dashboard/alerts')).data;
