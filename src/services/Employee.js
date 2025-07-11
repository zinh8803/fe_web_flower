import api from "./api";

export const getEmployee = () => api.get("/employee");
export const getEmployeeById = (id) => api.get(`/employee/${id}`);
export const createEmployee = (data) => api.post("/admin/create-employee", data,
    { withCredentials: true });

export const updateEmployee = (id, data) => api.put(`/admin/update-employee/${id}`, data,
    { withCredentials: true });