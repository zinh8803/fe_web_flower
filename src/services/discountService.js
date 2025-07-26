import api from "./api";
export const createDiscount = (discountData) => api.post("/discounts", discountData, { withCredentials: true });
export const getDiscounts = (page = 1) => api.get(`/discounts?page=${page}`);
export const getDiscountById = (id) => api.get(`/discounts/${id}`);
export const updateDiscount = (id, discountData) => api.put(`/discounts/${id}`, discountData, { withCredentials: true });
export const deleteDiscount = (id) => api.delete(`/discounts/${id}`, { withCredentials: true });

export const checkCodeValidity = (code, user_id) => api.post("/discounts/check-code", { name: code, user_id: user_id });

export const sendDiscountToSubscribers = (data) =>
    api.post(`/discounts/send-discount`, data, { withCredentials: true });
// export const checkCodeValidity = (code) => api.post("/discounts/check-code", { code });
