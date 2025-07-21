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

export const cancelOrder = (id) =>
    api.put(`/orders/cancel/${id}`, {}, { withCredentials: true });

export const reportProduct = (data) =>
    api.post("/orders/product-reports", data, { withCredentials: true });

export const updateReport = (id, data) =>
    api.put(`/orders/product-reports/${id}`, data, { withCredentials: true });

export const deleteReport = (id) =>
    api.delete(`/orders/product-reports/${id}`, { withCredentials: true });