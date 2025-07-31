import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../../store/cartSlice";
import { showNotification } from "../../store/notificationSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { createOrder } from "../../services/orderService";
import { CircularProgress, Box, Typography } from "@mui/material";

const VnpayReturn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const responseCode = params.get("vnp_ResponseCode");
        if (responseCode === "00") {
            const orderData = JSON.parse(localStorage.getItem("pendingOrder"));
            const sentFlag = localStorage.getItem("pendingOrderSent");
            if (orderData && !sentFlag) {
                localStorage.setItem("pendingOrderSent", "1");
                createOrder(orderData)
                    .then(() => {
                        dispatch(clearCart());
                        setTimeout(() => {
                            dispatch(showNotification({ message: "Thanh toán thành công!", severity: "success" }));
                            localStorage.removeItem("pendingOrder");
                            localStorage.removeItem("pendingOrderSent");
                            navigate("/");
                        }, 2000);
                    })
                    .catch(() => {
                        setTimeout(() => {
                            dispatch(showNotification({ message: "Không đủ tồn kho cho sản phẩm này!", severity: "error" }));
                            localStorage.removeItem("pendingOrderSent");
                            navigate("/checkout");
                        }, 2000);
                    });
            } else if (!orderData) {
                setTimeout(() => {
                    dispatch(showNotification({ message: "Không tìm thấy thông tin đơn hàng!", severity: "error" }));
                    navigate("/checkout");
                }, 2000);
            }
        } else {
            setTimeout(() => {
                dispatch(showNotification({ message: "Thanh toán thất bại!", severity: "error" }));
                navigate("/checkout");
            }, 2000);
        }
    }, [dispatch, navigate, location.search]);

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography>Đang xử lý thanh toán...</Typography>
        </Box>
    );
};

export default VnpayReturn;