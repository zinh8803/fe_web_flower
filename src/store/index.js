import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import cartReducer from "./cartSlice";
import notificationReducer from "./notificationSlice"; // Thêm dòng này

const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
        notification: notificationReducer, // Thêm dòng này
    },
});

export default store;
