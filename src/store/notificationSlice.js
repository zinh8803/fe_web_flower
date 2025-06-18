import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        open: false,
        message: "",
        severity: "success", 
    },
    reducers: {
        showNotification: (state, action) => {
            state.open = true;
            state.message = action.payload.message;
            state.severity = action.payload.severity || "success";
        },
        hideNotification: (state) => {
            state.open = false;
            state.message = "";
        },
    },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;