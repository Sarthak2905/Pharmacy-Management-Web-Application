import api from './axiosInstance';

export const getMedicines = async (params) => (await api.get('/medicines', { params })).data;
export const getLowStockMedicines = async () => (await api.get('/medicines/low-stock')).data;
