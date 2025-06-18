import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
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

    const handleAddToCart = () => {
        dispatch(addToCart({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image_url,
            quantity: quantity,
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
                <ProductInfo
                    product={product}
                    quantity={quantity}
                    onQuantityChange={handleQuantityChange}
                    onAddToCart={handleAddToCart}
                />
            </Box>
            <ProductDescription description={product.description} />
            <RelatedProducts related={related} />
        </Box>
    );
};

export default ProductDetail;
