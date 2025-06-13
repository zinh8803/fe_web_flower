import api from "./api";

export const getProducts = () => api.get("/products");

export const getProductById = (id) => api.get(`/products/${id}`);
export const getProductsByCategory = (category) =>
    api.get(`/products/category/${category}`);