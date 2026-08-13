import React, { useState, useEffect } from "react";
import { Box, Typography, Container, CircularProgress, Paper } from "@mui/material";
import { useLocation } from "react-router-dom";
import { getProductsByCategory, getProductDetailById } from "../../services/productService";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import { showNotification } from "../../store/notificationSlice";
import { fetchStockAvailability } from "../../store/stockSlice";
import ProductInfo from "../../component/product/ProductInfo";
import ProductDescription from "../../component/product/ProductDescription";
import RelatedProducts from "../../component/product/RelatedProducts";
import Breadcrumb from "../../component/breadcrumb/Breadcrumb";

const ProductDetail = () => {
    const location = useLocation();
    const id = location.state?.id;
    const fromCategory = location.state?.fromCategory;
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [related, setRelated] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const dispatch = useDispatch();

    const stockState = useSelector((state) => state.stock);
    const cartItems = useSelector((state) => state.cart.items);

    useEffect(() => {
        dispatch(
            fetchStockAvailability(
                cartItems.map((item) => ({
                    product_size_id: item.product_size_id,
                    quantity: item.quantity
                }))
            )
        );
    }, [dispatch, cartItems]);

    useEffect(() => {
        document.title = "Chi tiết sản phẩm";
        setLoading(true);
        getProductDetailById(id)
            .then((res) => {
                setProduct(res.data.data);
                setQuantity(1);
                if (res.data.data.sizes && res.data.data.sizes.length > 0) {
                    const small = res.data.data.sizes.find((s) => s.size.toLowerCase() === "nhỏ");
                    setSelectedSize(small || res.data.data.sizes[0]);
                }
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (product && product.category_id) {
            getProductsByCategory(product.category_id).then((res) => {
                const filtered = res.data.data.filter((p) => p.id !== product.id);
                setRelated(filtered);
            });
        }
    }, [product]);

    const isProductAvailable = (productId, sizeId, requestedQuantity = 1) => {
        const product = stockState.availableProducts.find((p) => p.id === productId);
        if (!product) return true;
        const sizeInfo = product.sizes.find((s) => s.size_id === sizeId);
        return sizeInfo && sizeInfo.in_stock && sizeInfo.max_quantity >= requestedQuantity;
    };

    const getLimitingFlowerInfo = (productId, sizeId) => {
        const product = stockState.availableProducts.find((p) => p.id === productId);
        if (!product) return null;
        const sizeInfo = product.sizes.find((s) => s.size_id === sizeId);
        return sizeInfo ? sizeInfo.limiting_flower : null;
    };

    const stockStatus = selectedSize ? isProductAvailable(Number(id), selectedSize.id, quantity) : false;

    const limitingFlower = selectedSize ? getLimitingFlowerInfo(Number(id), selectedSize.id) : null;

    const handleQuantityChange = (e) => {
        let value = parseInt(e.target.value);
        const maxQuantity = selectedSize && selectedSize.max_quantity ? selectedSize.max_quantity : 99;
        if (isNaN(value) || value < 1) value = 1;
        if (value > maxQuantity) value = maxQuantity;
        setQuantity(value);
    };

    const handleSizeChange = (size) => {
        setSelectedSize(size);
    };

    const handleAddToCart = async () => {
        if (!selectedSize) {
            dispatch(showNotification({ message: "Vui lòng chọn kích thước!", severity: "warning" }));
            return;
        }
        if (!stockStatus) {
            dispatch(
                showNotification({
                    message: limitingFlower ? `Không đủ hoa ${limitingFlower.name} trong kho` : "Sản phẩm đã hết hàng",
                    severity: "error"
                })
            );
            return;
        }
        const item = {
            id: product.id + "-" + selectedSize.id,
            product_id: product.id,
            product_size_id: selectedSize.id,
            name: product.name,
            price: Number(selectedSize.price),
            image: product.image_url,
            quantity: quantity,
            size: selectedSize.size,
            sizes: product.sizes
        };

        const resultAction = await dispatch(addToCart(item));
        if (!addToCart.fulfilled.match(resultAction)) {
            dispatch(
                showNotification({
                    message: resultAction.payload || "Không thể thêm sản phẩm vào giỏ hàng",
                    severity: "error"
                })
            );
            return;
        }

        dispatch(showNotification({ message: "Thêm vào giỏ hàng thành công!", severity: "success" }));

        const updatedCartItems = [
            ...cartItems,
            {
                product_size_id: selectedSize.id,
                quantity: quantity
            }
        ];
        dispatch(fetchStockAvailability(updatedCartItems));
        setQuantity(1);
    };

    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress color="success" />
            </Box>
        );

    if (!product) return <Typography color="text.secondary">Không tìm thấy sản phẩm.</Typography>;

    return (
        <Container maxWidth="xl" sx={{ py: 3, mb: 4 }}>
            <Breadcrumb
                items={
                    fromCategory
                        ? [
                              { label: "Trang chủ", href: "/" },
                              { label: "Danh mục", href: "/category" },
                              { label: product.name }
                          ]
                        : [{ label: "Trang chủ", href: "/" }, { label: product.name }]
                }
            />

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, md: 4 },
                    borderRadius: "20px",
                    border: "1px solid #e2e8f0",
                    bgcolor: "#fff",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                    mt: 2,
                    mb: 4
                }}
            >
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 3, md: 5 } }}>
                    {/* Main Image */}
                    <Box
                        sx={{
                            flex: 1,
                            bgcolor: "#f8fafc",
                            borderRadius: "16px",
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #f1f5f9",
                            maxHeight: 460
                        }}
                    >
                        <Box
                            component="img"
                            src={product.image_url}
                            alt={product.name}
                            sx={{
                                width: "100%",
                                maxHeight: 420,
                                objectFit: "contain",
                                transition: "transform 0.3s ease",
                                "&:hover": {
                                    transform: "scale(1.03)"
                                }
                            }}
                        />
                    </Box>

                    {/* Product Details Info */}
                    <ProductInfo
                        product={{
                            ...product,
                            price: selectedSize ? selectedSize.price : 0,
                            size: selectedSize ? selectedSize.size : "",
                            receipt_details: selectedSize ? selectedSize.receipt_details : [],
                            max_quantity: selectedSize && selectedSize.max_quantity ? selectedSize.max_quantity : 99
                        }}
                        quantity={quantity}
                        onQuantityChange={handleQuantityChange}
                        onAddToCart={handleAddToCart}
                        disableAddToCart={!stockStatus}
                        sizes={product.sizes}
                        selectedSize={selectedSize}
                        onSizeChange={handleSizeChange}
                        isProductAvailable={isProductAvailable}
                        productId={Number(id)}
                    />
                </Box>
            </Paper>

            <ProductDescription description={product.description} />
            <RelatedProducts related={related} />
        </Container>
    );
};

export default ProductDetail;
