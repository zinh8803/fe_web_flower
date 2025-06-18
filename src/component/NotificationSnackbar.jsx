import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Snackbar, Alert, Slide } from "@mui/material";
import { hideNotification } from "../store/notificationSlice";

// Hàm hiệu ứng trượt từ phải sang trái
function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
}

const NotificationSnackbar = () => {
    const dispatch = useDispatch();
    const { open, message, severity } = useSelector(state => state.notification);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;
        dispatch(hideNotification());
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Đổi sang góc phải
            TransitionComponent={SlideTransition} // Thêm hiệu ứng trượt
        >
            <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default NotificationSnackbar;