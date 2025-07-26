import api from "./api";

export const getCategory = () => api.get("/categories");

export const getCategoryId = (slug) => api.get(`/categories/${slug}`);

export const createCategory = (data) => api.post("/categories", data, { withCredentials: true });
export const updateCategory = (slug, data) => api.post(`/categories/${slug}`, data, { withCredentials: true });
export const deleteCategory = (slug) => api.delete(`/categories/${slug}`, { withCredentials: true });
