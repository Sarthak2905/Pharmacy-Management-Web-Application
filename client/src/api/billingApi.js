import api from './axiosInstance';

export const createBill = async (payload) => (await api.post('/bills', payload)).data;
export const getBills = async () => (await api.get('/bills')).data;
