import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import cartReducer from "./cartSlice";
import notificationReducer from "./notificationSlice";
import stockReducer from "./stockSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
        notification: notificationReducer,
        stock: stockReducer, // Thêm reducer stock
    },
});

export default store;
