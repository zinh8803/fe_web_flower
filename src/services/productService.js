import api from "./api";

export const getProducts = (page = 1) => api.get(`/products?page=${page}`);

export const getProductById = (id) => api.get(`/products/${id}`);
export const getProductsByCategory = (category) => api.get(`/products/category/${category}`);
export const getProductsBySearch = (keyword) => api.get(`/products/search`, { params: { product: keyword } });

export const createProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) => api.post(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const hideProduct = (id) => api.put(`/products/${id}/hide`, { status: false });

export const checkAllStock = () => api.get("/products/stock");

export const checkStockById = (id) => api.get(`/products/${id}/stock`);