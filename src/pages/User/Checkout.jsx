import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../../services/orderService";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, TextField, Button, MenuItem, Divider } from "@mui/material";
import { clearCart } from "../../store/cartSlice";
import { showNotification } from "../../store/notificationSlice";
import { getPayments } from "../../services/paymentService";

const Checkout = () => {
    const cartItems = useSelector(state => state.cart.items);
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        note: "",
        payment_method: "cod",
        discount_id: null,
    });
    const [discountCode, setDiscountCode] = useState("");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountId, setDiscountId] = useState(null);

    useEffect(() => {
        document.title = 'Thanh toán đơn hàng';
        if (location.state) {
            setDiscountId(location.state.discountId || null);
            setDiscountAmount(location.state.discountAmount || 0);
            setDiscountCode(location.state.discountCode || "");
            setForm(prevForm => ({
                ...prevForm,
                discount_id: location.state.discountId || null,
            }));
        }
    }, [location.state]);

    useEffect(() => {
        if (user) {
            setForm(prevForm => ({
                ...prevForm,
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
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

    const total = subtotal - discountAmount;

    const handlePlaceOrder = async () => {
        setLoading(true);
        if (form.payment_method === "cod") {
            try {
                const orderData = {
                    ...form,
                    user_id: user?.id || null,
                    products: cartItems.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        product_size_id: item.product_size_id,
                    })),
                    discount_id: discountId || null,
                };

                const res = await createOrder(orderData);

                if (res.data && res.data.data) {
                    dispatch(clearCart());
                    dispatch(showNotification({ message: "Đặt hàng thành công!", severity: "success" }));
                    navigate("/");
                }
            } catch (err) {
                if (err.response && err.response.data) {
                    console.log("Lỗi đặt hàng:", err.response.data);
                    alert(JSON.stringify(err.response.data.errors));
                }
                dispatch(showNotification({ message: "Lỗi khi đặt hàng!", severity: "error" }));
            } finally {
                setLoading(false);
            }
        } else if (form.payment_method === "vnpay") {
            try {
                const orderData = {
                    ...form,
                    user_id: user?.id || null,
                    products: cartItems.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        product_size_id: item.product_size_id,
                    })),
                    discount_id: discountId || null,
                };
                localStorage.setItem("pendingOrder", JSON.stringify(orderData));

                const amount = total;
                const res = await getPayments({ amount });
                if (res.data && res.data.payment_url) {
                    window.location.href = res.data.payment_url;
                } else {
                    dispatch(showNotification({ message: "Không lấy được link thanh toán!", severity: "error" }));
                }
            } catch (err) {
                console.error("Error creating VNPAY payment:", err);
                dispatch(showNotification({ message: "Lỗi khi tạo thanh toán VNPAY!", severity: "error" }));
            } finally {
                setLoading(false);
            }
        }
    };

    console.log("user in checkout:", user);

    // Đảm bảo total không nhỏ hơn 0
    const displayTotal = total < 0 ? 0 : total;

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
                <MenuItem value="vnpay">Thanh toán VNPAY</MenuItem>
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

            {/* Hiển thị giảm giá nếu có */}
            {discountAmount > 0 && (
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography fontWeight={600} color="green">
                        Giảm giá ({discountCode}):
                    </Typography>
                    <Typography fontWeight={600} color="green">
                        -{discountAmount.toLocaleString()}đ
                    </Typography>
                </Box>
            )}

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography fontWeight={700}>Tổng cộng:</Typography>
                <Typography fontWeight={700} color="error" fontSize={20}>
                    {displayTotal.toLocaleString()}đ
                </Typography>
            </Box>

            <Button
                variant="contained"
                color="error"
                size="large"
                fullWidth
                sx={{ borderRadius: 2, fontWeight: 600, fontSize: "1.1rem" }}
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0 || loading}
            >
                {loading ? "Đang gửi đơn hàng..." : "Đặt hàng"}
            </Button>
        </Box>
    );
};

export default Checkout;