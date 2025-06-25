import api from "./api";

export const login = (email, password) =>
    api.post("/login", { email, password }, {
        withCredentials: true,
    });

export const refreshToken = (refreshToken) =>
    api.post("/refresh-token", { refresh_token: refreshToken }, {
        headers: { withCredentials: true },
    });

export const getProfile = () =>
    api.get("/profile",
        {
            withCredentials: true,
        }
    );

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

export const getOrderHistory = (token, page = 1) =>
    api.get(`/orders/details?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
export const getUpdateProfile = (token, data) =>
    api.post("/user/update", data, {
        headers: { Authorization: `Bearer ${token}` }
    });


export const getUsers = () => api.get("/users");

export const register = (data) => api.post("/register", data);

export const getAllUsers = (page = 1) =>
    api.get(`/users/getall?page=${page}`);