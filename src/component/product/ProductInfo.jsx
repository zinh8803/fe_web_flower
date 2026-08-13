import React from "react";
import { Box, Typography, Button, TextField, Chip, Paper } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";

const ProductInfo = ({
    product,
    quantity,
    onQuantityChange,
    onAddToCart,
    disableAddToCart,
    sizes,
    selectedSize,
    onSizeChange,
    isProductAvailable,
    productId
}) => {
    const total = Number(product.price) * quantity;
    const maxQuantity = product.max_quantity || 99;

    return (
        <Box sx={{ flex: 2 }}>
            <Typography variant="h4" fontWeight={800} color="#1e293b" mb={2}>
                {product.name}
            </Typography>

            {/* Price display */}
            <Box display="flex" alignItems="baseline" gap={2} mb={3}>
                <Typography variant="h3" fontWeight={800} color="#16a34a">
                    {Number(product.price).toLocaleString()}đ
                </Typography>
            </Box>

            {/* Size options */}
            {sizes && sizes.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    <Typography fontWeight={700} color="#475569" mb={1.5} fontSize="0.95rem">
                        Chọn kích thước:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1.5}>
                        {sizes.map((size) => {
                            const isSizeAvailable = isProductAvailable(productId, size.id, quantity);
                            const isSelected = selectedSize && selectedSize.id === size.id;
                            return (
                                <Button
                                    key={size.id}
                                    variant={isSelected ? "contained" : "outlined"}
                                    disableElevation
                                    onClick={() => onSizeChange(size)}
                                    disabled={!isSizeAvailable}
                                    sx={{
                                        borderRadius: "10px",
                                        py: 1,
                                        px: 2.5,
                                        fontWeight: 700,
                                        fontSize: "0.9rem",
                                        textTransform: "none",
                                        bgcolor: isSelected ? "#16a34a" : "#fff",
                                        borderColor: isSelected ? "#16a34a" : "#cbd5e1",
                                        color: isSelected ? "#fff" : "#334155",
                                        "&:hover": {
                                            bgcolor: isSelected ? "#15803d" : "rgba(22, 163, 74, 0.08)",
                                            borderColor: "#16a34a"
                                        },
                                        "&:disabled": {
                                            bgcolor: "#f1f5f9",
                                            borderColor: "#e2e8f0",
                                            color: "#94a3b8"
                                        }
                                    }}
                                >
                                    {size.size} - {Number(size.price).toLocaleString()}đ
                                    {!isSizeAvailable && " (Hết hàng)"}
                                </Button>
                            );
                        })}
                    </Box>
                </Box>
            )}

            {/* Quantity */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Typography fontWeight={700} color="#475569" mr={2} fontSize="0.95rem">
                    Số lượng:
                </Typography>
                <TextField
                    type="number"
                    value={quantity}
                    onChange={onQuantityChange}
                    inputProps={{ min: 1, max: maxQuantity, style: { fontWeight: 700, textAlign: "center" } }}
                    size="small"
                    sx={{
                        width: 100,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            "&.Mui-focused fieldset": {
                                borderColor: "#16a34a"
                            }
                        }
                    }}
                />
                <Typography variant="caption" color="#64748b" ml={2}>
                  (Tồn kho tối đa: {maxQuantity})
                </Typography>
            </Box>

            {/* Total price highlight */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: "12px",
                    bgcolor: "rgba(22, 163, 74, 0.06)",
                    border: "1px solid rgba(22, 163, 74, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >
                <Typography variant="subtitle1" fontWeight={700} color="#334155">
                    Tổng thành tiền:
                </Typography>
                <Typography variant="h5" fontWeight={800} color="#16a34a">
                    {total.toLocaleString()}đ
                </Typography>
            </Paper>

            {/* Flower details list */}
            {product.receipt_details && product.receipt_details.length > 0 && (
                <Box mb={3.5}>
                    <Typography fontWeight={700} color="#475569" mb={1} fontSize="0.95rem" display="flex" alignItems="center" gap={1}>
                        <LocalFloristIcon sx={{ fontSize: 18, color: "#16a34a" }} /> Thành phần hoa gồm có:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {product.receipt_details.map((f, idx) => (
                            <Chip
                                key={idx}
                                label={`${f.flower_name}: ${f.quantity} bông`}
                                variant="outlined"
                                sx={{
                                    borderColor: "#cbd5e1",
                                    bgcolor: "#f8fafc",
                                    fontWeight: 600,
                                    color: "#334155"
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            {/* Add to cart CTA */}
            <Button
                variant="contained"
                size="large"
                disableElevation
                startIcon={<ShoppingCartIcon />}
                onClick={onAddToCart}
                disabled={disableAddToCart}
                sx={{
                    borderRadius: "12px",
                    px: 4,
                    py: 1.5,
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
                {disableAddToCart ? "Sản phẩm tạm hết hàng" : "Thêm vào giỏ hàng"}
            </Button>
        </Box>
    );
};

export default ProductInfo;