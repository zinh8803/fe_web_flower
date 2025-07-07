import api from "./api";

export const createOrder = (orderData) => api.post("/orders", orderData, {
    withCredentials: true,
});

export const getOrders = (page = 1, filters = {}) => api.get("/orders", {
    params: {
        page,
        from_date: filters.from_date,
        to_date: filters.to_date,
        status: filters.status
    },
    withCredentials: true,
});

export const getOrderDetailAdmin = (id) =>
    api.get(`/admin/orders/details/${id}`, { withCredentials: true });

export const updateOrder = (id, data) =>
    api.put(`/orders/${id}`, data, { withCredentials: true });