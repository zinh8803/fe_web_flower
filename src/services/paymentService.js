import api from './api';

export const getPayments = (data) => api.post('/payment', data);

export const getPaymentReturn = () => api.get(`/vnpay_return`);
