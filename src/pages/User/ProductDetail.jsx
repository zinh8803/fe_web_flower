import React, { useState, useEffect } from "react";
import { Box, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useParams } from "react-router-dom";
import { getProductById, getProductsByCategory } from "../../services/productService";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import { showNotification } from "../../store/notificationSlice";
import ProductInfo from "../../component/product/ProductInfo";
import ProductDescription from "../../component/product/ProductDescription";
import RelatedProducts from "../../component/product/RelatedProducts";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [related, setRelated] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        document.title = 'Chi tiết sản phẩm';
        setLoading(true);
        getProductById(id)
            .then(res => {
                setProduct(res.data.data);
                setQuantity(1);
                if (res.data.data.sizes && res.data.data.sizes.length > 0) {
                    setSelectedSize(res.data.data.sizes[0]);
                }
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (product && product.category_id) {
            getProductsByCategory(product.category_id).then(res => {
                const filtered = res.data.data.filter(p => p.id !== product.id);
                setRelated(filtered);
            });
        }
    }, [product]);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0) setQuantity(value);
    };

    const handleSizeChange = (e) => {
        const sizeId = e.target.value;
        const size = product.sizes.find(s => s.id === sizeId);
        setSelectedSize(size);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            dispatch(showNotification({ message: "Vui lòng chọn kích thước!", severity: "warning" }));
            return;
        }
        dispatch(addToCart({
            id: product.id + '-' + selectedSize.id,
            product_id: product.id,
            product_size_id: selectedSize.id,
            name: product.name,
            price: Number(selectedSize.price),
            image: product.image_url,
            quantity: quantity,
            size: selectedSize.size,
        }));
        dispatch(showNotification({ message: "Thêm vào giỏ hàng thành công!", severity: "success" }));
    };

    if (loading) return <Typography>Đang tải sản phẩm...</Typography>;
    if (!product) return <Typography>Không tìm thấy sản phẩm.</Typography>;

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
                    {/* Chọn size */}
                    {product.sizes && product.sizes.length > 0 && (
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="size-label">Kích thước</InputLabel>
                            <Select
                                labelId="size-label"
                                value={selectedSize ? selectedSize.id : ""}
                                label="Kích thước"
                                onChange={handleSizeChange}
                            >
                                {product.sizes.map(size => (
                                    <MenuItem key={size.id} value={size.id}>
                                        {size.size} - {Number(size.price).toLocaleString()}đ
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    <ProductInfo
                        product={{
                            ...product,
                            price: selectedSize ? selectedSize.price : 0,
                            size: selectedSize ? selectedSize.size : "",
                            receipt_details: selectedSize ? selectedSize.receipt_details : [],
                        }}
                        quantity={quantity}
                        onQuantityChange={handleQuantityChange}
                        onAddToCart={handleAddToCart}
                    />
                </Box>
            </Box>
            <ProductDescription description={product.description} />
            <RelatedProducts related={related} />
        </Box>
    );
};

export default ProductDetail;
