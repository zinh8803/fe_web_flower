import { createSlice } from "@reduxjs/toolkit";
import { clearCart } from "./cartSlice"; 
const storedUser = JSON.parse(localStorage.getItem("user")) || null;
const storedToken = localStorage.getItem("token") || null;
const storedRefreshToken = localStorage.getItem("refresh_token") || null;

const initialState = {
    user: storedUser,
    token: storedToken,
    refresh_token: storedRefreshToken,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { user, token, refresh_token } = action.payload;
            state.user = user;
            state.token = token;
            state.refresh_token = refresh_token;
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
            if (refresh_token) {
                localStorage.setItem("refresh_token", refresh_token);
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refresh_token = null;
            localStorage.removeItem("cart");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
        },
    },
});
export const logoutAndClearCart = () => (dispatch) => {
    dispatch(userSlice.actions.logout());
    dispatch(clearCart());
};
export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
