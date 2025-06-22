import React from "react";
import { Box, Typography, Button, TextField } from "@mui/material";

const ProductInfo = ({ product, quantity, onQuantityChange, onAddToCart }) => {
    const total = Number(product.price) * quantity;

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
                    inputProps={{ min: 1 }}
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
            {/* Hiển thị chi tiết hoa nếu có */}
            {product.receipt_details && product.receipt_details.length > 0 && (
                <Box mb={2}>
                    <Typography fontWeight={600}>Chi tiết hoa:</Typography>
                    <ul>
                        {product.receipt_details.map((f, idx) => (
                            <li key={idx}>
                                {f.flower_name} - SL: {f.quantity} ({Number(f.import_price).toLocaleString()}đ)
                            </li>
                        ))}
                    </ul>
                </Box>
            )}
            <Button
                variant="contained"
                color="error"
                sx={{ borderRadius: 5 }}
                onClick={onAddToCart}
            >
                Thêm vào giỏ hàng
            </Button>
        </Box>
    );
};

export default ProductInfo;