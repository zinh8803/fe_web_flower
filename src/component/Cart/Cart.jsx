import React, { useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    TextField,
    Button,
    Paper,
    Divider,
    Link
} from "@mui/material";
import { Minus, Plus, Trash2, MapPin } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../store/cartSlice";
import { useNavigate } from "react-router-dom";
import { checkCodeValidity } from "../../services/discountService";


const Cart = () => {
    document.title = 'Giỏ hàng';
    const cartItems = useSelector(state => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [discountCode, setDiscountCode] = useState("");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountId, setDiscountId] = useState(null);

    const handleQuantityChange = (id, delta) => {
        const item = cartItems.find(i => i.id === id);
        if (!item) return;
        const newQty = Math.max(1, item.quantity + delta);
        dispatch(updateQuantity({ id, quantity: newQty }));
    };

    const handleRemoveItem = (id) => {
        dispatch(removeFromCart(id));
    };

    const handleApplyDiscount = async () => {
        try {
            const res = await checkCodeValidity(discountCode);
            const discount = res.data.data;
            if (discount && discount.id) {
                setDiscountId(discount.id);
                let amount = 0;
                if (discount.type === "percent") {
                    amount = subtotal * (parseFloat(discount.value) / 100);
                } else {
                    amount = parseFloat(discount.value);
                }
                setDiscountAmount(amount);
                alert("Áp dụng mã giảm giá thành công!");
            }
        } catch (err) {

            console.error("Error checking discount code:", err);
            setDiscountAmount(0);
            setDiscountId(null);
            alert("Mã giảm giá không hợp lệ!");
        }
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const total = Math.max(0, subtotal - discountAmount);

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '100vh',
                bgcolor: '#f8f9fa',
                py: 4,
                px: { xs: 2, md: 4 }
            }}
        >
            {/* Breadcrumb */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                    <Link sx={{
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        '&:hover': {
                            textDecoration: 'underline'
                        }
                    }}
                        href="/"
                    >Trang chủ</Link> / <span style={{ color: '#333' }}>Giỏ hàng</span>
                </Typography>
            </Box>

            {cartItems.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h5" color="text.secondary">
                        Chưa có sản phẩm trong giỏ hàng
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 4
                    }}
                >
                    {/* SẢN PHẨM BÊN TRÁI */}
                    <Box sx={{ flex: '1 1 70%' }}>
                        <Paper
                            elevation={2}
                            sx={{
                                borderRadius: 2,
                                overflow: 'hidden'
                            }}
                        >
                            <Box sx={{ p: 3, bgcolor: '#fff' }}>
                                <Typography variant="h5" fontWeight="600" mb={3}>
                                    Giỏ hàng của bạn ({cartItems.length} sản phẩm)
                                </Typography>

                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                                            <TableCell sx={{ fontWeight: 600, py: 2 }}>Sản phẩm</TableCell>
                                            <TableCell sx={{ fontWeight: 600, py: 2 }}>Đơn giá</TableCell>
                                            <TableCell sx={{ fontWeight: 600, py: 2 }}>Số lượng</TableCell>
                                            <TableCell sx={{ fontWeight: 600, py: 2 }}>Tổng cộng</TableCell>
                                            <TableCell sx={{ fontWeight: 600, py: 2 }}></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cartItems.map((item) => (
                                            <TableRow key={item.id} sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                                                <TableCell sx={{ py: 3 }}>
                                                    <Box display="flex" alignItems="center" gap={3}>
                                                        <Box
                                                            component="img"
                                                            src={item.image}
                                                            alt={item.name}
                                                            sx={{
                                                                width: 80,
                                                                height: 80,
                                                                objectFit: 'cover',
                                                                borderRadius: 2,
                                                                border: '1px solid #e0e0e0'
                                                            }}
                                                        />
                                                        <Box>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    maxWidth: 300,
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                {item.name}
                                                            </Typography>
                                                            {/* Hiển thị kích thước nếu có */}
                                                            {item.size && (
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Kích thước: <b>{item.size}</b>
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body1" fontWeight="500" color="primary">
                                                        {item.price.toLocaleString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box
                                                        display="flex"
                                                        alignItems="center"
                                                        sx={{
                                                            border: '1px solid #e0e0e0',
                                                            borderRadius: 1,
                                                            width: 'fit-content'
                                                        }}
                                                    >
                                                        <IconButton
                                                            onClick={() => handleQuantityChange(item.id, -1)}
                                                            size="small"
                                                            sx={{ p: 0.5 }}
                                                        >
                                                            <Minus size={16} />
                                                        </IconButton>
                                                        <Typography
                                                            sx={{
                                                                px: 2,
                                                                py: 0.5,
                                                                minWidth: 40,
                                                                textAlign: 'center',
                                                                fontWeight: 500
                                                            }}
                                                        >
                                                            {item.quantity}
                                                        </Typography>
                                                        <IconButton
                                                            onClick={() => handleQuantityChange(item.id, 1)}
                                                            size="small"
                                                            sx={{ p: 0.5 }}
                                                        >
                                                            <Plus size={16} />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body1" fontWeight="600" color="error">
                                                        {((item.price) * item.quantity).toLocaleString()}đ
                                                        {console.log(item.price * item.quantity)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        color="error"
                                                        sx={{
                                                            '&:hover': {
                                                                bgcolor: 'error.light',
                                                                color: 'white'
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 size={18} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Paper>
                    </Box>

                    {/* THANH TOÁN BÊN PHẢI */}
                    <Box sx={{ flex: '0 0 30%', minWidth: { md: '350px' } }}>
                        <Paper
                            elevation={2}
                            sx={{
                                borderRadius: 2,
                                position: 'sticky',
                                top: 24,
                                overflow: 'hidden'
                            }}
                        >
                            <Box sx={{ p: 3, bgcolor: '#fff' }}>
                                {/* Thông tin giao hàng */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" color="success.main" fontWeight="600">
                                        <MapPin size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                        Giao hàng tới
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1, ml: 3 }}>
                                        TP Hồ Chí Minh
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                {/* Tóm tắt đơn hàng */}
                                <Typography variant="h6" fontWeight="600" color="primary" mb={3}>
                                    Tóm tắt đơn hàng
                                </Typography>

                                <Box sx={{ mb: 3 }}>
                                    <Box display="flex" justifyContent="space-between" mb={2}>
                                        <Typography variant="body2">Tạm tính:</Typography>
                                        <Typography variant="body2" fontWeight="500">
                                            {subtotal.toLocaleString()}đ
                                        </Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between" mb={2}>
                                        <Typography variant="body2">Phí giao hàng:</Typography>
                                        <Typography variant="body2" color="success.main" fontWeight="600">
                                            Miễn phí
                                        </Typography>
                                    </Box>
                                    {discountAmount > 0 && (
                                        <Box display="flex" justifyContent="space-between" mb={2}>
                                            <Typography variant="body2">Giảm giá:</Typography>
                                            <Typography variant="body2" color="success.main" fontWeight="500">
                                                -{discountAmount.toLocaleString()}đ
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                {/* Mã giảm giá */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" mb={2} fontWeight="600">
                                        Mã giảm giá
                                    </Typography>
                                    <Box display="flex" gap={1}>
                                        <TextField
                                            size="small"
                                            placeholder="Nhập mã giảm giá"
                                            fullWidth
                                            value={discountCode}
                                            onChange={(e) => setDiscountCode(e.target.value)}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2
                                                }
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleApplyDiscount}
                                            sx={{
                                                borderRadius: 2,
                                                minWidth: 80
                                            }}
                                        >
                                            Áp dụng
                                        </Button>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                {/* Tổng cộng */}
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{
                                        mb: 3,
                                        p: 2,
                                        bgcolor: '#f8f9fa',
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="700">
                                        Tổng cộng:
                                    </Typography>
                                    <Typography variant="h5" fontWeight="700" color="error">
                                        {total.toLocaleString()}đ
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    color="error"
                                    fullWidth
                                    size="large"
                                    sx={{
                                        py: 2,
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        fontSize: '1.1rem'
                                    }}
                                    onClick={() => navigate("/checkout", {
                                        state: {
                                            discountId,
                                            discountAmount,
                                            discountCode
                                        }
                                    })}
                                >
                                    Tiến hành thanh toán
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default Cart;