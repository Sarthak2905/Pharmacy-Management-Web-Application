import api from './axiosInstance';

export const login = async (payload) => (await api.post('/auth/login', payload)).data;
export const getMe = async () => (await api.get('/auth/me')).data;
export const logout = async () => (await api.post('/auth/logout')).data;
