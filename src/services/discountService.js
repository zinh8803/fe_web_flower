import api from "./api";
export const createDiscount = (discountData) => api.post("/discounts", discountData);
export const getDiscounts = () => api.get("/discounts");
export const getDiscountById = (id) => api.get(`/discounts/${id}`);
export const updateDiscount = (id, discountData) => api.put(`/discounts/${id}`, discountData);
export const deleteDiscount = (id) => api.delete(`/discounts/${id}`);

export const checkCodeValidity = (code) => api.post("/discounts/check-code", { name: code });
// export const checkCodeValidity = (code) => api.post("/discounts/check-code", { code });
