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
        // Nếu lỗi là 401 và chưa thử refresh
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            // Lấy refresh_token từ localStorage
            const refreshToken = localStorage.getItem("refresh_token");
            if (refreshToken) {
                try {
                    // Gọi API refresh
                    const res = await api.post("/refresh-token", { refresh_token: refreshToken });
                    const newToken = res.data.token;
                    // Lưu lại token mới vào localStorage và Redux
                    localStorage.setItem("token", newToken);
                    store.dispatch(setUser({ token: newToken }));
                    // Gắn token mới vào header và retry lại request cũ
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Refresh token failed:", refreshError);
                    // Nếu refresh cũng lỗi thì logout
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
