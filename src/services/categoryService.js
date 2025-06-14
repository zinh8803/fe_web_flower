import api from "./api";

export const getCategory = () => api.get("/categories");

export const getCategoryId = (id) => api.get(`/categories/${id}`);
