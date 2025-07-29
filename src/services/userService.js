import api from "./api";

export const login = (email, password) =>
    api.post("/login", { email, password }, {
        withCredentials: true,
    });

export const refreshToken = (refreshToken) =>
    api.post("/refresh-token", { refresh_token: refreshToken },
        { withCredentials: true },
    );

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
    api.get(`orders/user/${id}`,
        {
            withCredentials: true,
        }
    );

export const getOrderHistory = (token, page = 1) =>
    api.get(`/orders/details?page=${page}`,
        {
            withCredentials: true,
        }
    );
export const getUpdateProfile = (token, data) =>
    api.post("/user/update", data,
        {
            withCredentials: true,
        }
    );


export const getUsers = () => api.get("/users");

export const register = (data) => api.post("/register", data, {
    withCredentials: true,
});

export const getAllUsers = (page = 1) =>
    api.get(`/users/getall?page=${page}`,
        {
            withCredentials: true,
        }
    );

export const changePassword = (old_password, new_password, new_password_confirmation) =>
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

export const resetPassword = (email, otp, new_password, new_password_confirmation) =>
    api.put("/reset-password", { email, otp, new_password, new_password_confirmation }, {
    });

export const updateUserSubscribed = () =>
    api.put(`/users/update-subscribed`, {}, {
        withCredentials: true,
    });

export const updateUserStatus = (id) =>
    api.put(`/users/update-status/${id}`, {}, {
        withCredentials: true,
    });

export const getallUsersSubScriber = (page = 1) =>
    api.get(`users/getall-subscribed?page=${page}`, {
        withCredentials: true,
    });