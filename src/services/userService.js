import api from "./api";

export const login = (email, password) =>
    api.post("/login", { email, password });

export const getProfile = (token) =>
    api.get("/profile", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

// export const getOrderUser = (token) =>
//     api.get("/orders/details", {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });

export const getOrderUserdetail = (token, id) =>
    api.get(`orders/user/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

export const getOrderHistory = (token) =>
    api.get("/orders/details", {
        headers: { Authorization: `Bearer ${token}` }
    });
export const getUpdateProfile = (token, data) =>
    api.post("/user/update", data, {
        headers: { Authorization: `Bearer ${token}` }
    });


export const getUsers = () => api.get("/users");

export const register = (data) => api.post("/register", data);
