import axios from "axios";
import store from "../store"; // import store để dispatch
import { setUser, logout } from "../store/userSlice";
const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
    baseURL: API_URL,
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
            try {
                const res = await api.post("/refresh-token", {}, { withCredentials: true });
                const newToken = res.data.data.access_token;
                const user = JSON.parse(localStorage.getItem("user"));
                store.dispatch(setUser({
                    user,
                }));
                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Refresh token failed:", refreshError);
                store.dispatch(logout());
            }
        }
        return Promise.reject(error);
    }
);

export default api;
