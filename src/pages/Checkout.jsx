import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../services/orderService";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, MenuItem, Divider } from "@mui/material";
import { clearCart } from "../store/cartSlice";
const Checkout = () => {
    const cartItems = useSelector(state => state.cart.items);
    const user = useSelector(state => state.user.user.data);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        note: "",
        payment_method: "cod",
        discount_id: null,
    });

    useEffect(() => {
        if (user) {
            setForm(prevForm => ({
                ...prevForm,
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handlePlaceOrder = async () => {
        try {
            const orderData = {
                ...form,
                user_id: user?.id || null,
                products: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                })),
            };

            console.log("Sending order data:", orderData);

            const res = await createOrder(orderData);
            console.log("Order success response:", res.data);

            if (res.data && res.data.data) {
                dispatch(clearCart());
                alert("Đặt hàng thành công!");
                navigate("/");
            }
        } catch (err) {
            console.error("Order failed:", err);

            if (err.response) {
                console.error("API Error Response:", err.response.data);
                console.error("API Error Status:", err.response.status);

                if (err.response.data && err.response.data.message) {
                    alert("Đặt hàng thất bại: " + err.response.data.message);
                } else if (err.response.data && err.response.data.errors) {
                    const errorMessages = Object.values(err.response.data.errors).flat();
                    alert("Đặt hàng thất bại:\n" + errorMessages.join("\n"));
                } else {
                    alert("Đặt hàng thất bại!");
                }
            } else if (err.request) {
                console.error("No response received:", err.request);
                alert("Không nhận được phản hồi từ server!");
            } else {
                console.error("Error setting up request:", err.message);
                alert("Lỗi khi gửi yêu cầu: " + err.message);
            }
        }
    };

    console.log("user in checkout:", user);

    return (
        <Box maxWidth={700} mx="auto" mt={5} p={4} bgcolor="#fff" borderRadius={3} boxShadow={2}>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Thanh toán đơn hàng
            </Typography>
            <TextField
                label="Tên"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Số điện thoại"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Địa chỉ"
                name="address"
                value={form.address}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Ghi chú"
                name="note"
                value={form.note}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                select
                label="Phương thức thanh toán"
                name="payment_method"
                value={form.payment_method}
                onChange={handleChange}
                fullWidth
                margin="normal"
            >
                <MenuItem value="cod">Thanh toán khi nhận hàng (COD)</MenuItem>
                <MenuItem value="bank">Chuyển khoản ngân hàng</MenuItem>
            </TextField>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight={600} mb={2}>Đơn hàng của bạn</Typography>
            {cartItems.map(item => (
                <Box key={item.id} display="flex" alignItems="center" mb={1}>
                    <img src={item.image} alt={item.name} width={60} style={{ marginRight: 12, borderRadius: 8 }} />
                    <Box flex={1}>
                        <Typography fontWeight={500}>{item.name}</Typography>
                        <Typography color="text.secondary">Số lượng: {item.quantity}</Typography>
                    </Box>
                    <Typography fontWeight={600} color="error">
                        {(item.price * item.quantity).toLocaleString()}đ
                    </Typography>
                </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography fontWeight={700}>Tổng cộng:</Typography>
                <Typography fontWeight={700} color="error" fontSize={20}>
                    {subtotal.toLocaleString()}đ
                </Typography>
            </Box>
            <Button
                variant="contained"
                color="error"
                size="large"
                fullWidth
                sx={{ borderRadius: 2, fontWeight: 600, fontSize: "1.1rem" }}
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0}
            >
                Đặt hàng
            </Button>
        </Box>
    );
};

export default Checkout;