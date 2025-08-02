import api from "./api";

export const getColor = () => api.get("/colors");

export const getColorId = (id) => api.get(`/colors/${id}`);

export const createColor = (data) => api.post("/colors", data, { withCredentials: true });
export const updateColor = (id, data) => api.put(`/colors/${id}`, data, { withCredentials: true });
export const deleteColor = (id) => api.delete(`/colors/${id}`, { withCredentials: true });
