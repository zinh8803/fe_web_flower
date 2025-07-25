import React, { useState, useEffect } from "react";
import { Box, Typography, Button, ButtonGroup, Container, CircularProgress } from "@mui/material";
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
    // const { id } = useParams();
    const location = useLocation();
    const id = location.state?.id;
    const fromCategory = location.state?.fromCategory;
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [related, setRelated] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const dispatch = useDispatch();

    const stockState = useSelector(state => state.stock);
    const cartItems = useSelector(state => state.cart.items);

    console.log("id:", id);
    // console.log("productId:", productId);
    useEffect(() => {
        dispatch(fetchStockAvailability(cartItems.map(item => ({
            product_size_id: item.product_size_id,
            quantity: item.quantity
        }))));
    }, [dispatch, cartItems]);

    useEffect(() => {
        document.title = 'Chi tiết sản phẩm';
        setLoading(true);
        getProductDetailById(id)
            .then(res => {
                setProduct(res.data.data);
                setQuantity(1);
                if (res.data.data.sizes && res.data.data.sizes.length > 0) {
                    const small = res.data.data.sizes.find(s => s.size.toLowerCase() === "nhỏ");
                    setSelectedSize(small || res.data.data.sizes[0]);
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

    const isProductAvailable = (productId, sizeId, requestedQuantity = 1) => {
        const product = stockState.availableProducts.find(p => p.id === productId);
        if (!product) return true;
        const sizeInfo = product.sizes.find(s => s.size_id === sizeId);
        return sizeInfo && sizeInfo.in_stock && sizeInfo.max_quantity >= requestedQuantity;
    };

    const getLimitingFlowerInfo = (productId, sizeId) => {
        const product = stockState.availableProducts.find(p => p.id === productId);
        if (!product) return null;
        const sizeInfo = product.sizes.find(s => s.size_id === sizeId);
        return sizeInfo ? sizeInfo.limiting_flower : null;
    };

    const stockStatus = selectedSize ?
        isProductAvailable(Number(id), selectedSize.id, quantity) :
        false;

    const limitingFlower = selectedSize ?
        getLimitingFlowerInfo(Number(id), selectedSize.id) :
        null;

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

    const handleAddToCart = () => {
        if (!selectedSize) {
            dispatch(showNotification({ message: "Vui lòng chọn kích thước!", severity: "warning" }));
            return;
        }
        if (!stockStatus) {
            dispatch(showNotification({
                message: limitingFlower ?
                    `Không đủ hoa ${limitingFlower.name} trong kho` :
                    "Sản phẩm đã hết hàng",
                severity: "error"
            }));
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
            sizes: product.sizes,
        }));
        dispatch(showNotification({ message: "Thêm vào giỏ hàng thành công!", severity: "success" }));

        const updatedCartItems = [...cartItems, {
            product_size_id: selectedSize.id,
            quantity: quantity
        }];
        dispatch(fetchStockAvailability(updatedCartItems));
        setQuantity(1);
    };

    if (loading)
        return (<Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
        </Box>);
    if (!product) return <Typography>Không tìm thấy sản phẩm.</Typography>;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Breadcrumb
                items={
                    fromCategory
                        ? [
                            { label: "Trang chủ", href: "/" },
                            { label: "Danh mục", href: "/category" },
                            { label: "Sản phẩm" }
                        ]
                        : [
                            { label: "Trang chủ", href: "/" },
                            { label: "Sản phẩm" }
                        ]
                }
            />
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                    <img
                        src={product.image_url}
                        alt={product.name}
                        style={{ width: "100%", maxWidth: "400px", objectFit: "contain", borderRadius: 10 }}
                    />
                </Box>
                <Box sx={{ flex: 2 }}>
                    {product.sizes && product.sizes.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography fontWeight={600} mb={1}>Kích thước</Typography>
                            <ButtonGroup variant="outlined" color="primary">
                                {product.sizes.map(size => {
                                    const isSizeAvailable = isProductAvailable(Number(id), size.id, quantity);
                                    return (
                                        <Button
                                            key={size.id}
                                            variant={selectedSize && selectedSize.id === size.id ? "contained" : "outlined"}
                                            color={isSizeAvailable ? "primary" : "error"}
                                            onClick={() => handleSizeChange(size)}
                                            disabled={!isSizeAvailable}
                                            sx={{
                                                minWidth: 100,
                                                fontWeight: 600,
                                                opacity: isSizeAvailable ? 1 : 0.6,
                                                borderRadius: 2,
                                                mx: 0.5
                                            }}
                                        >
                                            {size.size} - {Number(size.price).toLocaleString()}đ
                                            {!isSizeAvailable && " (Hết hàng)"}
                                        </Button>
                                    );
                                })}
                            </ButtonGroup>
                        </Box>
                    )}

                    <ProductInfo
                        product={{
                            ...product,
                            price: selectedSize ? selectedSize.price : 0,
                            size: selectedSize ? selectedSize.size : "",
                            receipt_details: selectedSize ? selectedSize.receipt_details : [],
                            max_quantity: selectedSize && selectedSize.max_quantity ? selectedSize.max_quantity : 99 // truyền max_quantity nếu có
                        }}
                        quantity={quantity}
                        onQuantityChange={handleQuantityChange}
                        onAddToCart={handleAddToCart}
                        disableAddToCart={!stockStatus}
                    />
                </Box>
            </Box>
            <ProductDescription description={product.description} />
            <RelatedProducts related={related} />
        </Container>
    );
};

export default ProductDetail;
