import api from "./api";
export const getFlower = () => api.get("/flower");
export const getFlowerById = (id) => api.get(`/flower/${id}`);
export const createFlower = (data) => api.post("/flower", data);
export const updateFlower = (id, data) => api.put(`/flower/${id}`, data);
export const deleteFlower = (id) => api.delete(`/flower/${id}`);