import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { useParams, Link } from "react-router-dom";

// Giả lập dữ liệu sản phẩm
const fakeProductData = {
    1: {
        id: 1,
        name: "Hộp Hoa Yêu Thương Rực Rỡ 681",
        image: "https://storage.googleapis.com/cdn_dlhf_vn/public/products/AFFM/AFFMIXD681/1746704852_681c99d42f087.png",
        price: 1000000,
        unit: "Hộp",
        description: `
            <p>Mỗi ngày là một dịp đặc biệt để bạn thể hiện sự quan tâm...</p>
            <ul>
                <li>Hoa hồng, cẩm chướng, tulip...</li>
                <li>Giao hàng nhanh toàn quốc.</li>
            </ul>
        `,
        relatedIds: [2, 3, 4],
    },
    2: {
        id: 2,
        name: "Giỏ Hoa Yêu Thương Rực Rỡ 682",
        image: "https://storage.googleapis.com/cdn_dlhf_vn/public/products/AFFM/AFFMIXD681/1746704852_681c99d42f087.png",
        price: 1200000,
        unit: "Giỏ",
    },
    3: {
        id: 4,
        name: "Giỏ Hoa Yêu Thương Rực Rỡ 674",
        image: "https://storage.googleapis.com/cdn_dlhf_vn/public/products/AFFM/AFFMIXD681/1746704852_681c99d42f087.png",
        price: 1300000,
        unit: "Giỏ",
    },
    4: {
        id: 4,
        name: "Giỏ Hoa Yêu Thương Rực Rỡ 674",
        image: "https://storage.googleapis.com/cdn_dlhf_vn/public/products/AFFM/AFFMIXD681/1746704852_681c99d42f087.png",
        price: 1300000,
        unit: "Giỏ",
    },

};

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const prod = fakeProductData[id];
        setProduct(prod);
        setQuantity(1);
    }, [id]);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0) setQuantity(value);
    };

    if (!product) return <Typography>Đang tải sản phẩm...</Typography>;

    const total = product.price * quantity;

    return (
        <Box sx={{ p: 4, maxWidth: "1200px", mx: "auto" }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                    <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: "100%", maxWidth: "400px", objectFit: "contain", borderRadius: 10 }}
                    />
                </Box>

                <Box sx={{ flex: 2 }}>
                    <Typography variant="h5" fontWeight={700} mb={2}>
                        {product.name}
                    </Typography>

                    <Typography variant="h6" color="error" mb={2}>
                        {product.price.toLocaleString()}đ / {product.unit}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Typography mr={2}>Số lượng:</Typography>
                        <TextField
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
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

                    <Button variant="contained" color="error" sx={{ borderRadius: 5 }}>
                        Thêm vào giỏ hàng
                    </Button>
                </Box>
            </Box>

            {/* Mô tả chi tiết */}
            {product.description && (
                <Box sx={{ mt: 6 }}>
                    <Typography variant="h6" fontWeight={700} mb={2}>
                        Mô tả sản phẩm
                    </Typography>
                    <Box
                        sx={{ lineHeight: 1.8 }}
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                </Box>
            )}

            {/* Sản phẩm liên quan */}
            {product.relatedIds && (
                <Box sx={{ mt: 6 }}>
                    <Typography variant="h6" fontWeight={700} mb={2}>
                        Sản phẩm tương tự
                    </Typography>
                    <Grid container spacing={2}>
                        {product.relatedIds.map((rid) => {
                            const related = fakeProductData[rid];
                            if (!related) return null;
                            return (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={rid}>
                                    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                        <Link to={`/chi-tiet/${related.id}`} style={{ textDecoration: "none", color: "inherit", height: "100%", display: "flex", flexDirection: "column" }}>
                                            <CardMedia
                                                component="img"
                                                height="180"
                                                image={related.image}
                                                alt={related.name}
                                            />
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Typography variant="body1" fontWeight={600}>
                                                    {related.name}
                                                </Typography>
                                                <Typography color="error" fontWeight={500}>
                                                    {related.price.toLocaleString()}đ
                                                </Typography>
                                            </CardContent>
                                        </Link>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            )}
        </Box>
    );
};

export default ProductDetail;
