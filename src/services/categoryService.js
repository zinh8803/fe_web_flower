import api from "./api";

export const getCategory = () => api.get("/categories");

export const getCategoryId = (id) => api.get(`/categories/${id}`);

export const createCategory = (data) => api.post("/categories", data);
export const updateCategory = (id, data) => api.post(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
