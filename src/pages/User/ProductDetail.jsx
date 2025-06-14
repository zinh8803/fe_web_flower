import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { getProductById, getProductsByCategory } from "../../services/productService";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [related, setRelated] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        setLoading(true);
        getProductById(id)
            .then(res => {
                setProduct(res.data.data);
                setQuantity(1);
            })
            .finally(() => setLoading(false));
    }, [id]);

    // Lấy sản phẩm liên quan khi đã có product và product.category_id
    useEffect(() => {
        if (product && product.category_id) {
            console.log("Gọi API lấy sản phẩm liên quan với category_id:", product.category_id);
            getProductsByCategory(product.category_id).then(res => {
                console.log("Kết quả API sản phẩm liên quan:", res.data.data);
                const filtered = res.data.data.filter(p => p.id !== product.id);
                console.log("Danh sách sản phẩm liên quan sau khi lọc:", filtered);
                setRelated(filtered);
            }).catch(err => {
                console.error("Lỗi khi lấy sản phẩm liên quan:", err);
            });
        } else {
            console.log("Chưa có product hoặc category_id");
        }
    }, [product]);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0) setQuantity(value);
    };

    if (loading) return <Typography>Đang tải sản phẩm...</Typography>;
    if (!product) return <Typography>Không tìm thấy sản phẩm.</Typography>;

    const total = Number(product.price) * quantity;

    return (
        <Box sx={{ p: 4, maxWidth: "1200px", mx: "auto" }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                    <img
                        src={product.image_url}
                        alt={product.name}
                        style={{ width: "100%", maxWidth: "400px", objectFit: "contain", borderRadius: 10 }}
                    />
                </Box>

                <Box sx={{ flex: 2 }}>
                    <Typography variant="h5" fontWeight={700} mb={2}>
                        {product.name}
                    </Typography>

                    <Typography variant="h6" color="error" mb={2}>
                        {Number(product.price).toLocaleString()}đ
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

                    <Button
                        variant="contained"
                        color="error"
                        sx={{ borderRadius: 5 }}
                        onClick={() =>
                            dispatch(
                                addToCart({
                                    id: product.id,
                                    name: product.name,
                                    price: Number(product.price),
                                    image: product.image_url,
                                    quantity: quantity,
                                })
                            )
                        }
                    >
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
            {related.length > 0 && (
                <Box sx={{ mt: 8 }}>
                    <Typography variant="h6" fontWeight={700} mb={3}>
                        Sản phẩm liên quan
                    </Typography>
                    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                        {related.map(item => (
                            <Link
                                key={item.id}
                                to={`/detail/${item.id}`}
                                style={{ textDecoration: "none", color: "inherit" }}
                            >
                                <Box
                                    sx={{
                                        width: 220,
                                        border: "1px solid #eee",
                                        borderRadius: 2,
                                        p: 2,
                                        textAlign: "center",
                                        transition: "box-shadow 0.2s",
                                        "&:hover": { boxShadow: 3 },
                                    }}
                                >
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        style={{ width: "100%", height: 120, objectFit: "contain", borderRadius: 8 }}
                                    />
                                    <Typography fontWeight={600} mt={1}>
                                        {item.name}
                                    </Typography>
                                    <Typography color="error" fontWeight={700}>
                                        {Number(item.price).toLocaleString()}đ
                                    </Typography>
                                </Box>
                            </Link>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default ProductDetail;
