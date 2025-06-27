import api from "./api";

export const importReceipts = (data) => api.post("/import-receipts", data);
export const getImportReceipts = (page = 1) =>
    api.get("/import-receipts", { params: { page }, withCredentials: true });
export const getImportReceiptById = (id) => api.get(`/import-receipts/${id}`);
export const updateImportReceipt = (id, data) => api.put(`/import-receipts/${id}`, data);
export const deleteImportReceipt = (id) => api.delete(`/import-receipts/${id}`);