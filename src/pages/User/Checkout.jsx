import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../../services/orderService";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, TextField, Button, MenuItem, Divider, Container, InputLabel, FormControl, Select } from "@mui/material";
import { clearCart } from "../../store/cartSlice";
import { showNotification } from "../../store/notificationSlice";
import { getPayments } from "../../services/paymentService";
import codImg from "../../assets/img/cash.png";
import vnpayImg from "../../assets/img/vnpay.png";
import Breadcrumb from "../../component/breadcrumb/Breadcrumb";
import ConfirmDialog from "../../component/dialog/user/Confirm";
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
        delivery_date: "",
        delivery_time_slot: "",
        is_express: false
    });
    const [discountCode, setDiscountCode] = useState("");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountId, setDiscountId] = useState(null);
    const [errors, setErrors] = useState({ phone: "", email: "" });

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const timeSlots = [
        { value: "Buổi sáng", label: "Buổi sáng (8h - 12h)" },
        { value: "Buổi chiều", label: "Buổi chiều (13h - 18h)" }
    ];
    const phoneRegex = /^0\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

    // useEffect(() => {
    //     if (!isLoggedIn) {
    //         setForm(prev => ({ ...prev, payment_method: "vnpay" }));
    //     }
    // }, [isLoggedIn]);

    const handleOpenConfirmDialog = () => {
        setOpenConfirmDialog(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "delivery_date") {
            handleDateChange(e);
            return;
        }
        setForm({ ...form, [name]: value });

        // Kiểm tra lỗi realtime
        if (name === "phone") {
            setErrors(errors => ({
                ...errors,
                phone: value && !phoneRegex.test(value)
                    ? "Số điện thoại phải 10 số và bắt đầu bằng 0"
                    : ""
            }));
        }
        if (name === "email") {
            setErrors(errors => ({
                ...errors,
                email: value && !emailRegex.test(value)
                    ? "Email không đúng định dạng"
                    : ""
            }));
        }
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const total = subtotal - discountAmount;

    const isTimeSlotDisabled = (slotValue) => {
        if (form.is_express) return false;

        const selectedDate = form.delivery_date;
        if (!selectedDate) return false;

        const today = new Date().toISOString().split('T')[0];
        const currentHour = new Date().getHours();

        if (selectedDate === today) {
            if (slotValue === "Buổi sáng" && currentHour >= 12) {
                return true;
            }
            if (slotValue === "Buổi chiều" && currentHour >= 18) {
                return true;
            }
        }

        return false;
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => {
            const newForm = { ...prev, [name]: value };

            if (name === "delivery_date" && newForm.delivery_time_slot) {
                const today = new Date().toISOString().split('T')[0];
                const currentHour = new Date().getHours();

                if (value === today) {
                    if (newForm.delivery_time_slot === "Buổi sáng" && currentHour >= 12) {
                        newForm.delivery_time_slot = "";
                    }
                    if (newForm.delivery_time_slot === "Buổi chiều" && currentHour >= 18) {
                        newForm.delivery_time_slot = "";
                    }
                }
            }

            return newForm;
        });
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        if (form.payment_method === "cod") {
            try {
                if (!form.delivery_date) {
                    dispatch(showNotification({ message: "Vui lòng chọn ngày ", severity: "error" }));
                    setLoading(false);
                    return;
                }
                if (!form.is_express) {
                    if (!form.delivery_time_slot) {
                        dispatch(showNotification({ message: "Vui lòng chọn khung giờ giao hàng", severity: "error" }));
                        setLoading(false);
                        return;
                    }
                }
                const orderData = {
                    ...form,
                    user_id: user?.id || null,
                    products: cartItems.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        product_size_id: item.product_size_id,
                    })),
                    discount_id: discountId || null,
                    delivery_date: form.delivery_date,
                    delivery_time_slot: form.delivery_time_slot,
                    is_express: form.is_express
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
                }
                dispatch(showNotification({ message: err.response.data.message, severity: "error" }));
            } finally {
                setLoading(false);
            }
        } else if (form.payment_method === "vnpay") {
            try {

                if (!form.delivery_date) {
                    dispatch(showNotification({ message: "Vui lòng chọn ngày ", severity: "error" }));
                    setLoading(false);
                    return;
                }
                if (!form.is_express) {
                    if (!form.delivery_time_slot) {
                        dispatch(showNotification({ message: "Vui lòng chọn khung giờ giao hàng", severity: "error" }));
                        setLoading(false);
                        return;
                    }
                }
                const orderData = {
                    ...form,
                    user_id: user?.id || null,
                    products: cartItems.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        product_size_id: item.product_size_id,
                    })),
                    discount_id: discountId || null,
                    delivery_date: form.delivery_date,
                    delivery_time_slot: form.delivery_time_slot,
                    is_express: form.is_express
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

    const displayTotal = total < 0 ? 0 : total;

    return (
        <Container maxWidth={700} mx="auto" sx={{ pt: 2 }} mt={5} p={4} bgcolor="#fff" borderRadius={3} boxShadow={2} >
            <Breadcrumb
                items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Giỏ hàng", href: "/cart" },
                    { label: "Thanh toán" }
                ]}
            />
            <Typography variant="h5" fontWeight={700} mb={3}>
                Thanh toán đơn hàng
            </Typography>
            <Box display="flex" flexWrap={{ xs: "wrap", sm: "nowrap" }} gap={2} flexDirection="row" >
                <TextField
                    label="Họ Tên"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    error={!form.name}
                    helperText={!form.name ? "Họ tên không được để trống" : ""}
                />
                <TextField
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email}
                />
            </Box>
            <TextField
                label="Số điện thoại nhận hàng"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.phone}
                helperText={errors.phone}
            />
            <TextField
                label="Địa chỉ nhận hàng"
                name="address"
                value={form.address}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={!form.address}
                helperText={!form.address ? "Địa chỉ không được để trống" : ""}
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
                label="Ngày giao hàng"
                name="delivery_date"
                type="date"
                value={form.delivery_date}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}

                inputProps={{
                    min: new Date().toISOString().split('T')[0]
                }}

            />
            <FormControl fullWidth margin="normal" disabled={form.is_express}>
                <InputLabel>Khung giờ giao hàng</InputLabel>
                <Select
                    name="delivery_time_slot"
                    value={form.is_express ? "" : form.delivery_time_slot}
                    onChange={handleChange}
                    label="Khung giờ giao hàng"
                >
                    <MenuItem value="">
                        <>Chọn khung giờ</>
                    </MenuItem>
                    {timeSlots.map((slot) => {
                        const disabled = isTimeSlotDisabled(slot.value);
                        return (
                            <MenuItem
                                key={slot.value}
                                value={slot.value}
                                disabled={disabled}
                                sx={{
                                    opacity: disabled ? 0.5 : 1,
                                    color: disabled ? 'text.disabled' : 'text.primary'
                                }}
                            >
                                {slot.label}
                                {disabled && (
                                    <Typography variant="caption" color="error" ml={1}>
                                        (Không khả dụng)
                                    </Typography>
                                )}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
            <Box display="flex" alignItems="center" mb={2}>
                <Typography mr={2}>Giao nhanh (Tốc độ 2 tiếng):</Typography>
                <input
                    type="checkbox"
                    checked={form.is_express}
                    onChange={e => {
                        setForm({
                            ...form,
                            is_express: e.target.checked,
                            delivery_time_slot: e.target.checked ? "" : form.delivery_time_slot
                        });
                    }}
                />
            </Box>
            <Typography fontWeight={600} mb={1}>Phương thức thanh toán</Typography>
            <Box display="flex" gap={3} mb={2}>
                {user && (
                    <Box
                        onClick={() => setForm({ ...form, payment_method: "cod" })}
                        sx={{
                            border: form.payment_method === "cod" ? "2px solid #1976d2" : "1px solid #ccc",
                            borderRadius: 2,
                            p: 2,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            boxShadow: form.payment_method === "cod" ? 2 : 0,
                            bgcolor: form.payment_method === "cod" ? "#f5faff" : "#fff"
                        }}
                    >
                        <img src={codImg} alt="COD" width={48} style={{ marginRight: 12 }} />
                        <Typography fontWeight={500}>Thanh toán khi nhận hàng</Typography>
                    </Box>
                )}
                <Box
                    onClick={() => setForm({ ...form, payment_method: "vnpay" })}
                    sx={{
                        border: form.payment_method === "vnpay" ? "2px solid #1976d2" : "1px solid #ccc",
                        borderRadius: 2,
                        p: 2,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        boxShadow: form.payment_method === "vnpay" ? 2 : 0,
                        bgcolor: form.payment_method === "vnpay" ? "#f5faff" : "#fff"
                    }}
                >
                    <img src={vnpayImg} alt="VNPAY" width={48} style={{ marginRight: 12 }} />
                    <Typography fontWeight={500}>Thanh toán VNPAY</Typography>
                </Box>
            </Box>

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
            <Box display="flex" justifyContent="center" mt={3}>
                <Button
                    variant="contained"
                    color="error"
                    size="large"
                    sx={{ borderRadius: 2, fontWeight: 600, fontSize: "1.1rem" }}
                    onClick={handleOpenConfirmDialog}
                    disabled={cartItems.length === 0 || loading || !form.name || !form.address || !form.phone || errors.phone || errors.email}
                >
                    {loading ? "Đang gửi đơn hàng..." : "Đặt hàng"}
                </Button>
            </Box>
            <ConfirmDialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                onConfirm={handlePlaceOrder}
                title="Xác nhận đặt hàng"
                content="Bạn có chắc chắn muốn đặt hàng với thông tin đã nhập?"
            />
        </Container>


    );
};

export default Checkout;