import api from "./api";

export const getProducts = (page = 1, search = "") =>
    api.get("/products", {
        params: { page, name: search },
        withCredentials: true
    });

export const getAllProductTrash = (page = 1) => {
    return api.get("/products/trash", {
        params: { page },
        withCredentials: true
    });
};

export const restoreProduct = (id) => {
    return api.put(`/products/${id}/restore`, {}, { withCredentials: true });
};
export const getProductById = (id) => api.get(`/products/${id}`);

export const getProductDetailById = (id) => api.get(`/products/detailId/${id}`);

export const getProductBySlug = (slug) => api.get(`/products/${slug}`);
export const getProductsByCategory = (category) => api.get(`/products/category/id=${category}`);
export const getProductsByCategorySlug = (slug) => api.get(`/products/category/${slug}`);
export const getProductsBySearch = (keyword) => api.get(`/products/search`, { params: { product: keyword } });

export const createProduct = (data) => api.post("/products", data, { withCredentials: true });
export const updateProduct = (id, data) => api.post(`/products/${id}`, data, { withCredentials: true });
export const deleteProduct = (id) => api.delete(`/products/${id}`, { withCredentials: true });

export const hideProduct = (id) => api.put(`/products/${id}/hide`, { status: false });

export const checkAllStock = () => api.get("/products/stock");

export const checkStockById = (id) => api.get(`/products/${id}/stock`);

export const checkStockAvailable = (data) => api.get(`/products/check-available-products`, { params: data });

export const getStockWarning = (page = 1) =>
    api.get(`/products/stock-warning?page=${page}`);
// export const searchStockWarning = (q = "", page = 1) =>
//     api.get(`/products/stock-warning/search?q=${encodeURIComponent(q)}&page=${page}`);
export const searchStockWarning = (q = "", page = 1, date = null) => {
    let params = { q, page };
    if (date) params.date = date;

    return api.get('/products/stock-warning/search', { params });
};
export const filterProducts = (params) =>
    api.get("/products/filter", {
        params: params,
        withCredentials: true
    });


