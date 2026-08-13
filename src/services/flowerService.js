import api from "./api";
export const getFlower = () => api.get("/flower");
export const getFlowerById = (id) => api.get(`/flower/${id}`);
export const createFlower = (data) => api.post("/flower", data, { withCredentials: true });
export const updateFlower = (id, data) => api.put(`/flower/${id}`, data, { withCredentials: true });
export const deleteFlower = (id) => api.delete(`/flower/${id}`, { withCredentials: true });

export const getFlowerLogs = (params = {}) => api.get("/flower-logs", { params, withCredentials: true });
export const getLogsByFlower = (id, params = {}) => api.get(`/flower/${id}/logs`, { params, withCredentials: true });