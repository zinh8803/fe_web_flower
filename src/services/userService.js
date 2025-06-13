import api from "./api";

export const login = (email, password) =>
    api.post("/login", { email, password });

export const getProfile = (token) =>
    api.get("/profile", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

export const getUsers = () => api.get("/users");

export const register = (data) => api.post("/register", data);
