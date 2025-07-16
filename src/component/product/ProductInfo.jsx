import React from "react";
import { Box, Typography, Button, TextField } from "@mui/material";

const ProductInfo = ({ product, quantity, onQuantityChange, onAddToCart, disableAddToCart }) => {
    const total = Number(product.price) * quantity;
    const maxQuantity = product.max_quantity || 99;

    return (
        <Box sx={{ flex: 2 }}>
            <Typography variant="h5" fontWeight={700} mb={2}>
                {product.name}
            </Typography>
            {product.size && (
                <Typography variant="subtitle1" mb={1}>
                    Kích thước: <b>{product.size}</b>
                </Typography>
            )}
            <Typography variant="h6" color="error" mb={2}>
                {Number(product.price).toLocaleString()}đ
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography mr={2}>Số lượng:</Typography>
                <TextField
                    type="number"
                    value={quantity}
                    onChange={onQuantityChange}
                    inputProps={{ min: 1, max: maxQuantity }}
                    size="small"
                    sx={{ width: 100 }}
                />
            </Box>
            <Typography variant="body1" fontWeight={500} mb={2}>
                Tổng tiền:{" "}
                <span style={{ color: "green", fontWeight: "bold" }}>
                    {total.toLocaleString()}đ
                </span>
            </Typography>
            {product.receipt_details && product.receipt_details.length > 0 && (
                <Box mb={2}>
                    <Typography fontWeight={600}>Chi tiết hoa:</Typography>
                    {product.receipt_details.map((f, idx) => (
                        <Typography key={idx} sx={{ marginBottom: 1 }}>
                            {f.flower_name} - {f.quantity} bông
                        </Typography>
                    ))}
                </Box>
            )}
            <Button
                variant="contained"
                color="error"
                sx={{ borderRadius: 5 }}
                onClick={onAddToCart}
                disabled={disableAddToCart}
            >
                {disableAddToCart ? "Hết hàng" : "Thêm vào giỏ hàng"}
            </Button>
        </Box>
    );
};

export default ProductInfo;