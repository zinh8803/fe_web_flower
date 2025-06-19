import api from "./api";

export const createOrder = (orderData) => api.post("/orders", orderData);

export const getOrders = (page = 1) => api.get(`/orders?page=${page}`);