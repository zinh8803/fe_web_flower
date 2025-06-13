import api from "./api";

export const createOrder = (orderData) => api.post("/orders", orderData);