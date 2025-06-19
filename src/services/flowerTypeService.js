import api from "./api";
export const getFlowerTypes = () => api.get("/flower-types");
export const getFlowerTypeById = (id) => api.get(`/flower-types/${id}`);
export const createFlowerType = (data) => api.post("/flower-types", data);
export const updateFlowerType = (id, data) => api.put(`/flower-types/${id}`, data);
export const deleteFlowerType = (id) => api.delete(`/flower-types/${id}`);