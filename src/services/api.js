import axios from "axios";
import store from "../store"; // import store để dispatch
import { setUser, logout } from "../store/userSlice";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    timeout: 5000,
});
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/refresh-token")
        ) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refresh_token");
            if (refreshToken) {
                try {
                    const res = await api.post("/refresh-token", { refresh_token: refreshToken });
                    const newToken = res.data.token;
                    const user = JSON.parse(localStorage.getItem("user"));
                    store.dispatch(setUser({
                        user,
                        token: newToken,
                        refresh_token: refreshToken,
                    }));
                    localStorage.setItem("token", newToken);
                    if (res.data.refresh_token) {
                        localStorage.setItem("refresh_token", res.data.refresh_token);
                    }
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Refresh token failed:", refreshError);
                    store.dispatch(logout());
                    localStorage.removeItem("refresh_token");
                }
            } else {
                store.dispatch(logout());
            }
        }
        return Promise.reject(error);
    }
);

export default api;
