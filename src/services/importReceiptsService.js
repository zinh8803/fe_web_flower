import api from "./api";

export const importReceipts = (data) => api.post("/import-receipts", data);
export const getImportReceipts = (page = 1, from_date, to_date) =>
    api.get("/import-receipts", {
        params: { page, from_date, to_date },
        withCredentials: true
    });
export const getImportReceiptById = (id) => api.get(`/import-receipts/${id}`);
export const updateImportReceipt = (id, data) => api.put(`/import-receipts/${id}`, data);
export const deleteImportReceipt = (id) => api.delete(`/import-receipts/${id}`);
export const createAutoImportReceipt = (data) =>
    api.post(`/auto-import-receipts`, data, { withCredentials: true });

export const getAutoImportReceipts = () =>
    api.get("/auto-import-receipts", {
        withCredentials: true
    });