import api from "./api";

export const getEmployee = () => api.get("/admin/employees", { withCredentials: true });
export const getEmployeeById = (id) => api.get(`/employee/${id}`);
export const createEmployee = (data) => api.post("/admin/create-employee", data,
    { withCredentials: true });

export const updateEmployee = (id, data) => api.put(`/admin/update-employee/${id}`, data,
    { withCredentials: true });

export const changePasswordAdmin = (old_password, new_password, new_password_confirmation) =>
    api.put("/change-password",
        {
            old_password,
            new_password,
            new_password_confirmation
        },
        {
            withCredentials: true,
        }
    );