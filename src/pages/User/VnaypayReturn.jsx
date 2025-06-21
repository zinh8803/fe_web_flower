import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../../store/cartSlice";
import { showNotification } from "../../store/notificationSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { createOrder } from "../../services/orderService";

const VnpayReturn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const responseCode = params.get("vnp_ResponseCode");
        if (responseCode === "00") {
            const orderData = JSON.parse(localStorage.getItem("pendingOrder"));
            if (orderData) {
                createOrder(orderData)
                    .then(() => {

                        dispatch(clearCart());
                        dispatch(showNotification({ message: "Thanh toán thành công!", severity: "success" }));
                        localStorage.removeItem("pendingOrder");
                        setTimeout(() => navigate("/"), 2000);
                    })
                    .catch(() => {
                        console.error("Error creating order:", orderData);
                        dispatch(showNotification({ message: "Lỗi khi lưu đơn hàng!", severity: "error" }));
                        setTimeout(() => navigate("/checkout"), 2000);
                    });
            } else {
                console.error("Không tìm thấy thông tin đơn hàng trong localStorage");
                dispatch(showNotification({ message: "Không tìm thấy thông tin đơn hàng!", severity: "error" }));
                setTimeout(() => navigate("/checkout"), 2000);
            }
        } else {
            dispatch(showNotification({ message: "Thanh toán thất bại!", severity: "error" }));
            setTimeout(() => navigate("/checkout"), 2000);
        }
    }, [dispatch, navigate, location.search]);

    return <div>Đang xử lý thanh toán...</div>;
};

export default VnpayReturn;