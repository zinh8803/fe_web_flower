import React, { useState, useEffect, useCallback } from "react";
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
    Link,
    Select,
    MenuItem,
    Tooltip,
    Chip,
} from "@mui/material";
import { Minus, Plus, Trash2, MapPin } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../store/cartSlice";
import { useNavigate } from "react-router-dom";
import { checkCodeValidity } from "../../services/discountService";
import { fetchStockAvailability } from "../../store/stockSlice";
import { showNotification } from "../../store/notificationSlice";
import Breadcrumb from "../breadcrumb/Breadcrumb";
const Cart = () => {
    document.title = 'Giỏ hàng';
    const cartItems = useSelector(state => state.cart.items);
    const stockState = useSelector(state => state.stock);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [discountCode, setDiscountCode] = useState("");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountId, setDiscountId] = useState(null);
    const [loadingItemId, setLoadingItemId] = useState(null);

    const [totalMaxQuantities, setTotalMaxQuantities] = useState({});

    const [currentQuantities, setCurrentQuantities] = useState({});
    const [needsStockUpdate, setNeedsStockUpdate] = useState(false);
    const user = useSelector((state) => state.user.user);
    useEffect(() => {
        if (cartItems.length > 0) {
            dispatch(fetchStockAvailability(cartItems.map(item => ({
                product_size_id: item.product_size_id,
                quantity: 0
            })))).then(() => {
                const maxQuantities = {};
                cartItems.forEach(item => {
                    const product = stockState.availableProducts.find(p => p.id === item.product_id);
                    if (product) {
                        const sizeInfo = product.sizes.find(s => s.size_id === item.product_size_id);
                        if (sizeInfo) {
                            maxQuantities[`${item.product_id}-${item.product_size_id}`] = sizeInfo.max_quantity;
                        }
                    }
                });
                setTotalMaxQuantities(maxQuantities);
            });
        }
    }, [dispatch, cartItems]);

    const isProductAvailable = (productId, sizeId) => {
        const product = stockState.availableProducts.find(p => p.id === productId);
        if (!product) return true;

        const sizeInfo = product.sizes.find(s => s.size_id === sizeId);
        return sizeInfo && sizeInfo.in_stock && sizeInfo.max_quantity > 0;
    };

    const getMaxQuantity = (productId, sizeId) => {
        const totalMaxQty = totalMaxQuantities[`${productId}-${sizeId}`];
        if (totalMaxQty) return totalMaxQty;

        const product = stockState.availableProducts.find(p => p.id === productId);
        if (!product) return 999;

        const sizeInfo = product.sizes.find(s => s.size_id === sizeId);
        if (!sizeInfo) return 999;

        const currentQty = cartItems.find(
            i => i.product_id === productId && i.product_size_id === sizeId
        )?.quantity || 0;

        return sizeInfo.max_quantity + currentQty;
    };



    useEffect(() => {
        const quantities = {};
        cartItems.forEach(item => {
            quantities[item.id] = item.quantity;
        });
        setCurrentQuantities(quantities);
    }, [cartItems]);

    useEffect(() => {
        if (needsStockUpdate && cartItems.length > 0) {
            dispatch(fetchStockAvailability(cartItems.map(item => ({
                product_size_id: item.product_size_id,
                quantity: 0
            })))).then(() => {
                setNeedsStockUpdate(false);
            });
        }
    }, [needsStockUpdate, dispatch, cartItems]);

    const handleQuantityChange = useCallback((id, delta) => {
        const item = cartItems.find(i => i.id === id);
        if (!item) return;

        const currentQty = currentQuantities[id] || item.quantity;
        const newQty = Math.max(1, currentQty + delta);
        const maxQty = getMaxQuantity(item.product_id, item.product_size_id);

        if (delta > 0 && newQty > maxQty) {
            dispatch(showNotification({
                message: `Không thể tăng số lượng. Tối đa: ${maxQty}`,
                severity: "warning"
            }));
            return;
        }

        setCurrentQuantities(prev => ({
            ...prev,
            [id]: newQty
        }));

        setLoadingItemId(id);

        dispatch(updateQuantity({ id, quantity: newQty }));

        setTimeout(() => {
            setLoadingItemId(null);
            setNeedsStockUpdate(true);
        }, 300);
    }, [currentQuantities, totalMaxQuantities, cartItems, stockState.availableProducts, dispatch]);

    const handleQuantityInputChange = useCallback((id, event) => {
        const item = cartItems.find(i => i.id === id);
        if (!item) return;

        let newQty = parseInt(event.target.value);

        if (isNaN(newQty) || newQty < 1) {
            setCurrentQuantities(prev => ({
                ...prev,
                [id]: item.quantity
            }));
            return;
        }

        const maxQty = getMaxQuantity(item.product_id, item.product_size_id);

        if (newQty > maxQty) {
            newQty = maxQty;
            dispatch(showNotification({
                message: `Không thể vượt quá số lượng. Tối đa: ${maxQty}`,
                severity: "warning"
            }));
        }

        setCurrentQuantities(prev => ({
            ...prev,
            [id]: newQty
        }));

        setLoadingItemId(id);

        dispatch(updateQuantity({ id, quantity: newQty }));

        setTimeout(() => {
            setLoadingItemId(null);
            setNeedsStockUpdate(true);
        }, 300);
    }, [currentQuantities, totalMaxQuantities, cartItems, stockState.availableProducts, dispatch]);

    const handleRemoveItem = (id) => {
        dispatch(removeFromCart(id));
    };

    const handleChangeSize = (cartItemId, newSizeId) => {
        const item = cartItems.find(i => i.id === cartItemId);
        if (!item || !item.sizes) return;

        const newSize = item.sizes.find(s => s.id === parseInt(newSizeId));
        if (!newSize) return;

        dispatch(updateQuantity({
            id: cartItemId,
            quantity: item.quantity,
            newSizeId: newSize.id,
            newSize: newSize.size,
            newPrice: Number(newSize.price)
        }));
    };

    const handleApplyDiscount = async () => {
        try {
            const res = await checkCodeValidity(discountCode, user?.id || null);
            const discount = res.data.data;
            if (discount && discount.id) {
                if (subtotal < (discount.min_total || 0)) {
                    setDiscountAmount(0);
                    setDiscountId(null);
                    dispatch(showNotification({
                        message: `Đơn hàng cần tối thiểu ${Number(discount.min_total).toLocaleString()}đ mới được áp dụng mã giảm giá này!`,
                        severity: "warning"
                    }));
                    return;
                }
                setDiscountId(discount.id);
                let amount = 0;
                if (discount.type === "percent") {
                    amount = subtotal * (parseFloat(discount.value) / 100);
                } else {
                    amount = parseFloat(discount.value);
                }
                setDiscountAmount(amount);
                dispatch(showNotification({
                    message: "Áp dụng mã giảm giá thành công!",
                    severity: "success"
                }));
            }
        } catch (err) {
            console.error("Error checking discount code:", err);
            setDiscountAmount(0);
            setDiscountId(null);
            const errorMessage = err.response?.data?.message;
            dispatch(showNotification({
                message: errorMessage,
                severity: "error"
            }));
        }
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const total = Math.max(0, subtotal - discountAmount);

    const hasInvalidItems = cartItems.some(item => {
        const maxQty = getMaxQuantity(item.product_id, item.product_size_id);
        const isAvailable = isProductAvailable(item.product_id, item.product_size_id);
        return !isAvailable || item.quantity > maxQty;
    });

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
            <Breadcrumb
                items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Giỏ hàng" }
                ]}
            />

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
                                        {cartItems.map((item) => {
                                            const maxQty = getMaxQuantity(item.product_id, item.product_size_id);
                                            const isAvailable = isProductAvailable(item.product_id, item.product_size_id);
                                            const currentQty = currentQuantities[item.id] || item.quantity;
                                            const isQuantityExceeded = currentQty > maxQty;
                                            const canIncrease = currentQty < maxQty && isAvailable;
                                            const isLoading = loadingItemId === item.id;

                                            return (
                                                <TableRow
                                                    key={item.id}
                                                    sx={{
                                                        '&:hover': { bgcolor: '#f9f9fa' },
                                                        opacity: !isAvailable ? 0.6 : 1
                                                    }}
                                                >
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

                                                                {/* Dropdown chọn size */}
                                                                {item.sizes && item.sizes.length > 0 ? (
                                                                    <Box mt={1}>
                                                                        <Typography variant="body2" color="text.secondary" mb={0.5}>
                                                                            Kích thước:
                                                                        </Typography>
                                                                        <Select
                                                                            size="small"
                                                                            value={item.product_size_id || ''}
                                                                            onChange={(e) => handleChangeSize(item.id, e.target.value)}
                                                                            sx={{
                                                                                minWidth: 120,
                                                                                fontSize: '0.875rem'
                                                                            }}
                                                                        >
                                                                            {item.sizes.map(size => (
                                                                                <MenuItem key={size.id} value={size.id}>
                                                                                    {size.size} - {Number(size.price).toLocaleString()}đ
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </Box>
                                                                ) : item.size ? (
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        Kích thước: <b>{item.size}</b>
                                                                    </Typography>
                                                                ) : null}

                                                                {/* Hiển thị thông báo tồn kho */}
                                                                {!isAvailable && (
                                                                    <Chip
                                                                        label="Hết hàng"
                                                                        color="error"
                                                                        size="small"
                                                                        sx={{ mt: 1 }}
                                                                    />
                                                                )}
                                                                {isQuantityExceeded && (
                                                                    <Chip
                                                                        label={`Vượt quá số lượng (tối đa: ${maxQty})`}
                                                                        color="warning"
                                                                        size="small"
                                                                        sx={{ mt: 1 }}
                                                                    />
                                                                )}
                                                                {/* {limitingFlower && (
                                                                    <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                                                                        Còn tối đa: {maxQty} (thiếu {limitingFlower.name})
                                                                    </Typography>
                                                                )} */}
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body1" fontWeight="500" color="primary">
                                                            {item.price.toLocaleString()}đ
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
                                                                disabled={currentQty <= 1 || isLoading}
                                                            >
                                                                <Minus size={16} />
                                                            </IconButton>

                                                            {/*TextField */}
                                                            <TextField
                                                                value={currentQty}
                                                                onChange={(e) => handleQuantityInputChange(item.id, e)}
                                                                onBlur={(e) => {
                                                                    if (e.target.value === '' || isNaN(parseInt(e.target.value))) {
                                                                        setCurrentQuantities(prev => ({
                                                                            ...prev,
                                                                            [item.id]: item.quantity
                                                                        }));
                                                                    }
                                                                }}
                                                                inputProps={{
                                                                    min: 1,
                                                                    max: maxQty,
                                                                    style: {
                                                                        textAlign: 'center',
                                                                        width: '40px',
                                                                        padding: '4px 0',
                                                                        color: isQuantityExceeded ? '#d32f2f' : 'inherit'
                                                                    }
                                                                }}
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                        '& fieldset': { border: 'none' }
                                                                    },
                                                                    '& .MuiOutlinedInput-input': {
                                                                        p: 0
                                                                    }
                                                                }}
                                                                disabled={isLoading}
                                                            />

                                                            <IconButton
                                                                onClick={() => handleQuantityChange(item.id, 1)}
                                                                size="small"
                                                                sx={{ p: 0.5 }}
                                                                disabled={!canIncrease || isLoading}
                                                            >
                                                                <Plus size={16} />
                                                            </IconButton>
                                                        </Box>

                                                        {isQuantityExceeded && (
                                                            <Typography variant="caption" color="error" display="block" mt={1}>
                                                                Vượt quá số lượng tối đa ({maxQty})
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body1" fontWeight="600" color="error">
                                                            {(item.price * currentQty).toLocaleString()}đ
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
                                            );
                                        })}
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
                                {/* <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" color="success.main" fontWeight="600">
                                        <MapPin size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                        Giao hàng tới
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1, ml: 3 }}>
                                        TP Hồ Chí Minh
                                    </Typography>
                                </Box> */}

                                {/* <Divider sx={{ my: 3 }} /> */}

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
                                            disabled={!!discountId} // Không cho nhập khi đã áp dụng
                                        />
                                        {!discountId ? (
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
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                color="warning"
                                                onClick={() => {
                                                    setDiscountId(null);
                                                    setDiscountAmount(0);
                                                    setDiscountCode("");
                                                }}
                                                sx={{
                                                    borderRadius: 2,
                                                    minWidth: 80
                                                }}
                                            >
                                                Gỡ mã
                                            </Button>
                                        )}
                                    </Box>
                                    {discountId && (
                                        <Typography variant="body2" color="success.main" mt={1}>
                                            Đã áp dụng mã giảm giá!
                                        </Typography>
                                    )}
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
                                    disabled={hasInvalidItems}
                                    onClick={() => navigate("/checkout", {
                                        state: {
                                            discountId,
                                            discountAmount,
                                            discountCode
                                        }
                                    })}
                                >
                                    {hasInvalidItems
                                        ? "Vui lòng kiểm tra lại giỏ hàng"
                                        : "Tiến hành thanh toán"
                                    }
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