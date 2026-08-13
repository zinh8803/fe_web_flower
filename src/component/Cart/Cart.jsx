import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
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
  Select,
  MenuItem,
  Chip,
  Container
} from "@mui/material";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, CheckCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../store/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import { checkCodeValidity } from "../../services/discountService";
import { fetchStockAvailability } from "../../store/stockSlice";
import { showNotification } from "../../store/notificationSlice";
import Breadcrumb from "../breadcrumb/Breadcrumb";

const Cart = () => {
  document.title = "Giỏ hàng";
  const cartItems = useSelector((state) => state.cart.items);
  const stockState = useSelector((state) => state.stock);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountId, setDiscountId] = useState(null);
  const [loadingItemId, setLoadingItemId] = useState(null);

  const [totalMaxQuantities, setTotalMaxQuantities] = useState({});
  const [currentQuantities, setCurrentQuantities] = useState({});
  const [needsStockUpdate, setNeedsStockUpdate] = useState(false);
  const [stockLoaded, setStockLoaded] = useState(false);

  const [checkedInvalidItems, setCheckedInvalidItems] = useState(false);
  const [hasInvalid, setHasInvalid] = useState(true);
  const lastInvalidKeyRef = useRef("");
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (cartItems.length > 0) {
      dispatch(
        fetchStockAvailability(
          cartItems.map((item) => ({
            product_size_id: item.product_size_id,
            quantity: 0,
          })),
        ),
      );
    }
  }, [dispatch, cartItems]);

  useEffect(() => {
    if (cartItems.length > 0 && stockState.availableProducts.length > 0) {
      const maxQuantities = {};
      cartItems.forEach((item) => {
        const product = stockState.availableProducts.find(
          (p) => p.id === item.product_id,
        );
        if (product) {
          const sizeInfo = product.sizes.find(
            (s) => s.size_id === item.product_size_id,
          );
          if (sizeInfo) {
            maxQuantities[`${item.product_id}-${item.product_size_id}`] =
              sizeInfo.max_quantity;
          }
        }
      });
      setTotalMaxQuantities(maxQuantities);
      setStockLoaded(true);

      const invalid = cartItems.some((item) => {
        const maxQty = getMaxQuantity(item.product_id, item.product_size_id);
        const isAvailable = isProductAvailable(
          item.product_id,
          item.product_size_id,
        );
        return !isAvailable || item.quantity > maxQty;
      });

      setHasInvalid(invalid);
      setCheckedInvalidItems(true);
    }
  }, [cartItems, stockState.availableProducts]);

  const isProductAvailable = (productId, sizeId) => {
    const product = stockState.availableProducts.find(
      (p) => p.id === productId,
    );
    if (!product) return false;

    const sizeInfo = product.sizes.find((s) => s.size_id === sizeId);
    return sizeInfo && sizeInfo.in_stock && sizeInfo.max_quantity > 0;
  };

  const getMaxQuantity = (productId, sizeId) => {
    const totalMaxQty = totalMaxQuantities[`${productId}-${sizeId}`];
    if (totalMaxQty !== undefined) return totalMaxQty;

    const product = stockState.availableProducts.find(
      (p) => p.id === productId,
    );
    if (!product) return 0;

    const sizeInfo = product.sizes.find((s) => s.size_id === sizeId);
    if (!sizeInfo) return 0;

    return sizeInfo.max_quantity;
  };

  useEffect(() => {
    const quantities = {};
    cartItems.forEach((item) => {
      quantities[item.id] = item.quantity;
    });
    setCurrentQuantities(quantities);
  }, [cartItems]);

  useEffect(() => {
    if (needsStockUpdate && cartItems.length > 0) {
      dispatch(
        fetchStockAvailability(
          cartItems.map((item) => ({
            product_size_id: item.product_size_id,
            quantity: 0,
          })),
        ),
      ).then(() => {
        setNeedsStockUpdate(false);
      });
    }
  }, [needsStockUpdate, dispatch, cartItems]);

  const handleQuantityChange = useCallback(
    (id, delta) => {
      const item = cartItems.find((i) => i.id === id);
      if (!item) return;

      const currentQty = currentQuantities[id] || item.quantity;
      const newQty = Math.max(1, currentQty + delta);
      const maxQty = getMaxQuantity(item.product_id, item.product_size_id);

      if (delta > 0 && newQty > maxQty) {
        dispatch(
          showNotification({
            message: `Không thể tăng số lượng. Tối đa: ${maxQty}`,
            severity: "warning",
          }),
        );
        return;
      }

      setCurrentQuantities((prev) => ({
        ...prev,
        [id]: newQty,
      }));

      setLoadingItemId(id);
      dispatch(updateQuantity({ id, quantity: newQty }));

      setTimeout(() => {
        setLoadingItemId(null);
        setNeedsStockUpdate(true);
      }, 300);
    },
    [currentQuantities, totalMaxQuantities, cartItems, stockState.availableProducts, dispatch]
  );

  const handleQuantityInputChange = useCallback(
    (id, event) => {
      const item = cartItems.find((i) => i.id === id);
      if (!item) return;

      let newQty = parseInt(event.target.value);

      if (isNaN(newQty) || newQty < 1) {
        setCurrentQuantities((prev) => ({
          ...prev,
          [id]: item.quantity,
        }));
        return;
      }

      const maxQty = getMaxQuantity(item.product_id, item.product_size_id);

      if (newQty > maxQty) {
        newQty = maxQty;
        dispatch(
          showNotification({
            message: `Không thể vượt quá số lượng. Tối đa: ${maxQty}`,
            severity: "warning",
          }),
        );
      }

      setCurrentQuantities((prev) => ({
        ...prev,
        [id]: newQty,
      }));

      setLoadingItemId(id);
      dispatch(updateQuantity({ id, quantity: newQty }));

      setTimeout(() => {
        setLoadingItemId(null);
        setNeedsStockUpdate(true);
      }, 300);
    },
    [currentQuantities, totalMaxQuantities, cartItems, stockState.availableProducts, dispatch]
  );

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleChangeSize = (cartItemId, newSizeId) => {
    const item = cartItems.find((i) => i.id === cartItemId);
    if (!item || !item.sizes) return;

    const newSize = item.sizes.find((s) => s.id === parseInt(newSizeId));
    if (!newSize) return;

    dispatch(
      updateQuantity({
        id: cartItemId,
        quantity: item.quantity,
        newSizeId: newSize.id,
        newSize: newSize.size,
        newPrice: Number(newSize.price),
      }),
    );
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    try {
      const res = await checkCodeValidity(discountCode, user?.id || null);
      const discount = res.data.data;
      if (discount && discount.id) {
        if (subtotal < (discount.min_total || 0)) {
          setDiscountAmount(0);
          setDiscountId(null);
          dispatch(
            showNotification({
              message: `Đơn hàng cần tối thiểu ${Number(discount.min_total).toLocaleString()}đ để áp dụng mã này!`,
              severity: "warning",
            }),
          );
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
        dispatch(
          showNotification({
            message: "Áp dụng mã giảm giá thành công!",
            severity: "success",
          }),
        );
      }
    } catch (err) {
      console.error("Error checking discount code:", err);
      setDiscountAmount(0);
      setDiscountId(null);
      const errorMessage = err.response?.data?.message || "Mã giảm giá không hợp lệ!";
      dispatch(
        showNotification({
          message: errorMessage,
          severity: "error",
        }),
      );
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3, mb: 4 }}>
      <Breadcrumb
        items={[{ label: "Trang chủ", href: "/" }, { label: "Giỏ hàng" }]}
      />

      {cartItems.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            textAlign: "center",
            py: 10,
            px: 3,
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            bgcolor: "#fff",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
            maxWidth: 600,
            mx: "auto",
            mt: 4
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "rgba(22, 163, 74, 0.1)",
              color: "#16a34a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2.5
            }}
          >
            <ShoppingBag size={40} />
          </Box>
          <Typography variant="h5" fontWeight={700} color="#1e293b" mb={1}>
            Giỏ hàng của bạn đang trống
          </Typography>
          <Typography color="#64748b" mb={4} fontSize="0.95rem">
            Hãy chọn cho mình những lẵng hoa tươi đẹp nhất để dành tặng người thân yêu nhé!
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            disableElevation
            size="large"
            sx={{
              borderRadius: "999px",
              px: 4,
              py: 1.2,
              fontWeight: 700,
              textTransform: "none",
              bgcolor: "#16a34a",
              color: "#fff",
              "&:hover": {
                bgcolor: "#15803d",
                boxShadow: "0 6px 20px rgba(22, 163, 74, 0.3)"
              }
            }}
          >
            Khám phá sản phẩm ngay
          </Button>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 3.5,
            mt: 2
          }}
        >
          {/* SẢN PHẨM BÊN TRÁI */}
          <Box sx={{ flex: 1 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                bgcolor: "#fff",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                overflow: "hidden"
              }}
            >
              <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" fontWeight={700} color="#1e293b" mb={3}>
                  Giỏ hàng của bạn ({cartItems.length} sản phẩm)
                </Typography>

                <Box sx={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f8fafc" }}>
                        <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8, borderBottom: "1px solid #e2e8f0" }}>
                          Sản phẩm
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8, borderBottom: "1px solid #e2e8f0", display: { xs: "none", sm: "table-cell" } }}>
                          Đơn giá
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8, borderBottom: "1px solid #e2e8f0" }}>
                          Số lượng
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8, borderBottom: "1px solid #e2e8f0" }}>
                          Thành tiền
                        </TableCell>
                        <TableCell sx={{ py: 1.8, borderBottom: "1px solid #e2e8f0" }} />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item) => {
                        const maxQty = getMaxQuantity(
                          item.product_id,
                          item.product_size_id
                        );
                        const isAvailable = isProductAvailable(
                          item.product_id,
                          item.product_size_id
                        );
                        const currentQty = currentQuantities[item.id] || item.quantity;
                        const isQuantityExceeded = currentQty > maxQty;
                        const canIncrease = currentQty < maxQty && isAvailable;
                        const isLoading = loadingItemId === item.id;

                        return (
                          <TableRow
                            key={item.id}
                            sx={{
                              transition: "background-color 0.2s ease",
                              "&:hover": { bgcolor: "#f8fafc" },
                              opacity: !isAvailable ? 0.6 : 1
                            }}
                          >
                            {/* Thông tin sản phẩm */}
                            <TableCell sx={{ py: 2.5 }}>
                              <Box display="flex" alignItems="center" gap={2}>
                                <Box
                                  component="img"
                                  src={item.image}
                                  alt={item.name}
                                  sx={{
                                    width: { xs: 60, sm: 76 },
                                    height: { xs: 60, sm: 76 },
                                    objectFit: "cover",
                                    borderRadius: "12px",
                                    border: "1px solid #f1f5f9",
                                    bgcolor: "#f8fafc",
                                    flexShrink: 0
                                  }}
                                />
                                <Box>
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight={700}
                                    color="#1e293b"
                                    sx={{
                                      maxWidth: 220,
                                      lineHeight: 1.3,
                                      fontSize: { xs: "0.875rem", sm: "0.95rem" }
                                    }}
                                  >
                                    {item.name}
                                  </Typography>

                                  {/* Dropdown chọn size */}
                                  {item.sizes && item.sizes.length > 0 ? (
                                    <Box mt={1} display="flex" alignItems="center" gap={1}>
                                      <Typography variant="caption" color="#64748b">
                                        Size:
                                      </Typography>
                                      <Select
                                        size="small"
                                        value={item.product_size_id || ""}
                                        onChange={(e) => handleChangeSize(item.id, e.target.value)}
                                        sx={{
                                          height: 30,
                                          fontSize: "0.8rem",
                                          borderRadius: "6px",
                                          "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#cbd5e1"
                                          }
                                        }}
                                      >
                                        {item.sizes.map((size) => (
                                          <MenuItem key={size.id} value={size.id} sx={{ fontSize: "0.85rem" }}>
                                            {size.size} - {Number(size.price).toLocaleString()}đ
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </Box>
                                  ) : item.size ? (
                                    <Typography variant="caption" color="#64748b" display="block" mt={0.5}>
                                      Size: <b>{item.size}</b>
                                    </Typography>
                                  ) : null}

                                  {!isAvailable && (
                                    <Chip
                                      label="Hết hàng"
                                      color="error"
                                      size="small"
                                      sx={{ mt: 1, height: 22, fontSize: "0.7rem", fontWeight: 700 }}
                                    />
                                  )}
                                  {isQuantityExceeded && (
                                    <Chip
                                      label={`Tối đa: ${maxQty}`}
                                      color="warning"
                                      size="small"
                                      sx={{ mt: 1, height: 22, fontSize: "0.7rem", fontWeight: 700 }}
                                    />
                                  )}
                                </Box>
                              </Box>
                            </TableCell>

                            {/* Đơn giá */}
                            <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                              <Typography variant="body2" fontWeight={600} color="#16a34a">
                                {item.price.toLocaleString()}đ
                              </Typography>
                            </TableCell>

                            {/* Tăng giảm Số lượng */}
                            <TableCell>
                              <Box
                                display="flex"
                                alignItems="center"
                                sx={{
                                  border: "1.5px solid #cbd5e1",
                                  borderRadius: "8px",
                                  width: "fit-content",
                                  bgcolor: "#fff",
                                  px: 0.5
                                }}
                              >
                                <IconButton
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  size="small"
                                  sx={{ p: 0.5, color: "#475569" }}
                                  disabled={currentQty <= 1 || isLoading}
                                >
                                  <Minus size={14} />
                                </IconButton>

                                <TextField
                                  value={currentQty}
                                  onChange={(e) => handleQuantityInputChange(item.id, e)}
                                  inputProps={{
                                    min: 1,
                                    max: maxQty,
                                    style: {
                                      textAlign: "center",
                                      width: "36px",
                                      padding: "4px 0",
                                      fontWeight: 700,
                                      fontSize: "0.875rem",
                                      color: isQuantityExceeded ? "#ef4444" : "#1e293b"
                                    }
                                  }}
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      "& fieldset": { border: "none" }
                                    }
                                  }}
                                  disabled={isLoading}
                                />

                                <IconButton
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  size="small"
                                  sx={{ p: 0.5, color: "#475569" }}
                                  disabled={!canIncrease || isLoading}
                                >
                                  <Plus size={14} />
                                </IconButton>
                              </Box>
                            </TableCell>

                            {/* Tổng cộng mỗi dòng */}
                            <TableCell>
                              <Typography variant="subtitle2" fontWeight={700} color="#16a34a">
                                {(item.price * currentQty).toLocaleString()}đ
                              </Typography>
                            </TableCell>

                            {/* Nút xóa */}
                            <TableCell>
                              <IconButton
                                onClick={() => handleRemoveItem(item.id)}
                                sx={{
                                  color: "#94a3b8",
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    bgcolor: "#fef2f2",
                                    color: "#ef4444"
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
              </Box>
            </Paper>
          </Box>

          {/* TÓM TẮT ĐƠN HÀNG BÊN PHẢI */}
          <Box sx={{ width: { xs: "100%", lg: 380 }, flexShrink: 0 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                bgcolor: "#fff",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                p: 3,
                position: "sticky",
                top: 90
              }}
            >
              <Typography variant="h6" fontWeight={700} color="#1e293b" mb={2.5}>
                Tóm tắt đơn hàng
              </Typography>

              <Box sx={{ mb: 2.5 }}>
                <Box display="flex" justifyContent="space-between" mb={1.5}>
                  <Typography variant="body2" color="#64748b">Tạm tính:</Typography>
                  <Typography variant="body2" fontWeight={600} color="#1e293b">
                    {subtotal.toLocaleString()}đ
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1.5}>
                  <Typography variant="body2" color="#64748b">Phí giao hàng:</Typography>
                  <Typography variant="body2" fontWeight={700} color="#16a34a">
                    Miễn phí
                  </Typography>
                </Box>
                {discountAmount > 0 && (
                  <Box display="flex" justifyContent="space-between" mb={1.5}>
                    <Typography variant="body2" color="#64748b">Giảm giá:</Typography>
                    <Typography variant="body2" fontWeight={700} color="#16a34a">
                      -{discountAmount.toLocaleString()}đ
                    </Typography>
                  </Box>
                )}
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight={700} color="#1e293b">
                    Tổng tiền:
                  </Typography>
                  <Typography variant="h5" fontWeight={800} color="#16a34a">
                    {total.toLocaleString()}đ
                  </Typography>
                </Box>
              </Box>

              {/* Mã giảm giá Input */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" fontWeight={700} color="#475569" mb={1} display="flex" alignItems="center" gap={0.5}>
                  <Tag size={14} color="#16a34a" /> Mã giảm giá
                </Typography>
                <Box display="flex" gap={1} mt={0.5}>
                  <TextField
                    size="small"
                    placeholder="Nhập mã (VD: HOA350)"
                    fullWidth
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "0.875rem",
                        bgcolor: "#f8fafc",
                        "&.Mui-focused fieldset": {
                          borderColor: "#16a34a"
                        }
                      }
                    }}
                    disabled={!!discountId}
                  />
                  {!discountId ? (
                    <Button
                      variant="contained"
                      disableElevation
                      onClick={handleApplyDiscount}
                      sx={{
                        borderRadius: "10px",
                        minWidth: 85,
                        fontWeight: 700,
                        textTransform: "none",
                        bgcolor: "#16a34a",
                        "&:hover": { bgcolor: "#15803d" }
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
                        borderRadius: "10px",
                        minWidth: 80,
                        fontWeight: 700,
                        textTransform: "none"
                      }}
                    >
                      Gỡ mã
                    </Button>
                  )}
                </Box>
                {discountId && (
                  <Typography variant="caption" color="#16a34a" display="flex" alignItems="center" gap={0.5} mt={1} fontWeight={600}>
                    <CheckCircle size={14} /> Đã áp dụng mã giảm giá!
                  </Typography>
                )}
              </Box>

              {/* CTA Checkout Button */}
              <Button
                variant="contained"
                fullWidth
                size="large"
                disableElevation
                disabled={hasInvalid || cartItems.length === 0}
                onClick={() => navigate("/checkout", { state: { discountId, discountAmount } })}
                endIcon={<ArrowRight size={20} />}
                sx={{
                  borderRadius: "12px",
                  py: 1.4,
                  fontWeight: 700,
                  fontSize: "1rem",
                  textTransform: "none",
                  bgcolor: "#16a34a",
                  boxShadow: "0 4px 14px rgba(22, 163, 74, 0.3)",
                  "&:hover": {
                    bgcolor: "#15803d",
                    boxShadow: "0 6px 20px rgba(22, 163, 74, 0.4)"
                  },
                  "&:disabled": {
                    bgcolor: "#cbd5e1",
                    color: "#94a3b8"
                  }
                }}
              >
                Tiến hành thanh toán
              </Button>
            </Paper>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Cart;
