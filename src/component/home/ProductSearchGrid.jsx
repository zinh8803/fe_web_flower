import React, { useEffect } from "react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
    Tooltip,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import { showNotification } from "../../store/notificationSlice";
import { fetchStockAvailability } from "../../store/stockSlice";

const ProductSearchGrid = ({ products, title }) => {
    const dispatch = useDispatch();

    const stockState = useSelector(state => state.stock);
    const cartItems = useSelector(state => state.cart.items);

    useEffect(() => {
        dispatch(fetchStockAvailability(cartItems.map(item => ({
            product_size_id: item.product_size_id,
            quantity: item.quantity
        }))));
    }, [dispatch]);

    const isProductAvailable = (productId, sizeId) => {
        const product = stockState.availableProducts.find(p => p.id === productId);
        if (!product) return true; // Nếu chưa có thông tin, mặc định là có sẵn

        const sizeInfo = product.sizes.find(s => s.size_id === sizeId);
        return sizeInfo && sizeInfo.in_stock && sizeInfo.max_quantity > 0;
    };

    const getLimitingFlowerInfo = (productId, sizeId) => {
        const product = stockState.availableProducts.find(p => p.id === productId);
        if (!product) return null;

        const sizeInfo = product.sizes.find(s => s.size_id === sizeId);
        return sizeInfo ? sizeInfo.limiting_flower : null;
    };

    const handleAddToCart = (item) => {
        dispatch(addToCart(item));
        dispatch(showNotification({
            message: "Thêm vào giỏ hàng thành công!",
            severity: "success"
        }));

        const updatedCartItems = [...cartItems, item].map(cartItem => ({
            product_size_id: cartItem.product_size_id,
            quantity: cartItem.quantity
        }));

        dispatch(fetchStockAvailability(updatedCartItems));
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ p: 3, borderRadius: 2, bgcolor: "#fff" }}>
                <Typography variant="h6" fontWeight={700} color="green" mb={4}>
                    {title}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "flex-start",
                        gap: {
                            xs: "10px",
                            sm: "15px",
                            md: "20px"
                        }
                    }}
                >
                    {products.map((item) => {
                        const smallSize = item.sizes.find(s => s.size.toLowerCase() === "nhỏ") || item.sizes[0];
                        const isAvailable = isProductAvailable(item.id, smallSize?.id);
                        const limitingFlower = getLimitingFlowerInfo(item.id, smallSize?.id);

                        return (
                            <Box
                                key={item.id}
                                sx={{
                                    width: {
                                        xs: "calc(50% - 5px)",
                                        sm: "calc(50% - 10px)",
                                        md: "calc(33.33% - 15px)",
                                        lg: "calc(25% - 16px)"
                                    },
                                    height: {
                                        xs: 320,
                                        sm: 350,
                                        md: 380
                                    }
                                }}
                            >
                                <Link
                                    to={`/detail/${item.id}`}
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                        display: "block",
                                        height: "100%"
                                    }}
                                >
                                    <Card
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            borderRadius: 2,
                                            boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                                            transition: "transform 0.2s",
                                            "&:hover": {
                                                transform: "translateY(-4px)",
                                            },
                                        }}
                                    >
                                        {/* Image container */}
                                        <Box
                                            sx={{
                                                height: {
                                                    xs: 160,
                                                    sm: 170,
                                                    md: 180
                                                },
                                                overflow: "hidden",
                                                position: "relative",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                image={item.image_url}
                                                alt={item.name}
                                                sx={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "contain",
                                                    p: 1
                                                }}
                                            />
                                        </Box>
                                        {/* Content */}
                                        <CardContent
                                            sx={{
                                                textAlign: "center",
                                                flex: "1 0 auto",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                height: {
                                                    xs: 90,
                                                    sm: 100,
                                                    md: 120
                                                },
                                                p: {
                                                    xs: 1,
                                                    md: 2
                                                },
                                                overflow: "hidden"
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                                sx={{
                                                    mb: 1,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    lineHeight: 1.2,
                                                    minHeight: {
                                                        xs: 36,
                                                        sm: 38,
                                                        md: 40
                                                    }
                                                }}
                                            >
                                                {item.name}
                                            </Typography>
                                            <Typography color="error" fontWeight={700}>
                                                {item.sizes && item.sizes.length > 0
                                                    ? Number(smallSize.price).toLocaleString() + "đ"
                                                    : "Liên hệ"}
                                            </Typography>
                                            {!isAvailable && (
                                                <Typography
                                                    variant="caption"
                                                    color="error"
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    Hết hàng
                                                </Typography>
                                            )}
                                        </CardContent>
                                        <CardActions
                                            sx={{
                                                justifyContent: "center",
                                                height: {
                                                    xs: 50,
                                                    sm: 60,
                                                    md: 60
                                                },
                                                p: 0,
                                                flexShrink: 0
                                            }}
                                        >
                                            <Tooltip
                                                title={!isAvailable && limitingFlower
                                                    ? `Thiếu hoa ${limitingFlower.name}`
                                                    : ""}
                                            >
                                                <span>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="error"
                                                        endIcon={<ShoppingCartIcon />}
                                                        sx={{
                                                            borderRadius: 5,
                                                            px: {
                                                                xs: 1,
                                                                md: 2
                                                            }
                                                        }}
                                                        disabled={!isAvailable || !item.sizes || item.sizes.length === 0}
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            if (!item.sizes || item.sizes.length === 0) {
                                                                dispatch(showNotification({
                                                                    message: "Sản phẩm chưa có size!",
                                                                    severity: "warning"
                                                                }));
                                                                return;
                                                            }

                                                            const smallSize = item.sizes.find(s => s.size.toLowerCase() === "nhỏ") || item.sizes[0];
                                                            handleAddToCart({
                                                                id: item.id + '-' + smallSize.id,
                                                                name: item.name,
                                                                price: Number(smallSize.price),
                                                                image: item.image_url,
                                                                product_id: item.id,
                                                                quantity: 1,
                                                                size: smallSize.size,
                                                                product_size_id: smallSize.id,
                                                                sizes: item.sizes
                                                            });
                                                        }}
                                                    >
                                                        Mua Ngay
                                                    </Button>
                                                </span>
                                            </Tooltip>
                                        </CardActions>
                                    </Card>
                                </Link>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
};

export default ProductSearchGrid;