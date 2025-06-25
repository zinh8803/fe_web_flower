import { createSlice } from "@reduxjs/toolkit";
import { clearCart } from "./cartSlice"; 
const storedUser = JSON.parse(localStorage.getItem("user")) || null;

const initialState = {
    user: storedUser,
    token: null,
    refresh_token: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { user } = action.payload;
            state.user = user;
            localStorage.setItem("user", JSON.stringify(user));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refresh_token = null;
            localStorage.removeItem("cart");
            localStorage.removeItem("user");
        },
    },
});
export const logoutAndClearCart = () => (dispatch) => {
    dispatch(userSlice.actions.logout());
    dispatch(clearCart());
};
export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
