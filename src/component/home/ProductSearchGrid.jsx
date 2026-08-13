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
    Chip
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import { showNotification } from "../../store/notificationSlice";
import { fetchStockAvailability } from "../../store/stockSlice";

const ProductSearchGrid = ({ products }) => {
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
    }, [dispatch]);

    const isProductAvailable = (productId, sizeId) => {
        const product = stockState.availableProducts.find((p) => p.id === productId);
        if (!product) return true;

        const sizeInfo = product.sizes.find((s) => s.size_id === sizeId);
        return sizeInfo && sizeInfo.in_stock && sizeInfo.max_quantity > 0;
    };

    const getLimitingFlowerInfo = (productId, sizeId) => {
        const product = stockState.availableProducts.find((p) => p.id === productId);
        if (!product) return null;

        const sizeInfo = product.sizes.find((s) => s.size_id === sizeId);
        return sizeInfo ? sizeInfo.limiting_flower : null;
    };

    const handleAddToCart = async (item) => {
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

        dispatch(
            showNotification({
                message: "Thêm vào giỏ hàng thành công!",
                severity: "success"
            })
        );

        const updatedCartItems = [...cartItems, item].map((cartItem) => ({
            product_size_id: cartItem.product_size_id,
            quantity: cartItem.quantity
        }));

        dispatch(fetchStockAvailability(updatedCartItems));
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ p: { xs: 2, sm: 3 }, borderRadius: "16px", bgcolor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: {
                            xs: "12px",
                            sm: "16px",
                            md: "20px"
                        }
                    }}
                >
                    {products
                        .filter((item) => Array.isArray(item.sizes) && item.sizes.length > 0)
                        .map((item) => {
                            const smallSize = item.sizes.find((s) => s.size && s.size.toLowerCase() === "nhỏ") || item.sizes[0];
                            const isAvailable = isProductAvailable(item.id, smallSize?.id);
                            const limitingFlower = getLimitingFlowerInfo(item.id, smallSize?.id);

                            return (
                                <Box
                                    key={item.id}
                                    sx={{
                                        width: {
                                            xs: "calc(50% - 6px)",
                                            sm: "calc(50% - 8px)",
                                            md: "calc(33.33% - 14px)",
                                            lg: "calc(25% - 15px)"
                                        },
                                        height: {
                                            xs: 340,
                                            sm: 360,
                                            md: 390
                                        }
                                    }}
                                >
                                    <Link
                                        to={`/detail/${item.slug}`}
                                        state={{ id: item.id }}
                                        style={{
                                            textDecoration: "none",
                                            color: "inherit",
                                            display: "block",
                                            height: "100%"
                                        }}
                                    >
                                        <Card
                                            elevation={0}
                                            sx={{
                                                width: "100%",
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                borderRadius: "16px",
                                                border: "1px solid #f1f5f9",
                                                bgcolor: "#ffffff",
                                                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                                                transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                                                position: "relative",
                                                overflow: "hidden",
                                                "&:hover": {
                                                    transform: "translateY(-6px)",
                                                    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.08)",
                                                    borderColor: "rgba(22, 163, 74, 0.3)",
                                                    "& .product-img": {
                                                        transform: "scale(1.07)"
                                                    }
                                                }
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    height: {
                                                        xs: 170,
                                                        sm: 185,
                                                        md: 200
                                                    },
                                                    overflow: "hidden",
                                                    position: "relative",
                                                    bgcolor: "#f8fafc",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    p: 1.5
                                                }}
                                            >
                                                {!isAvailable && (
                                                    <Chip
                                                        label="Hết hàng"
                                                        color="error"
                                                        size="small"
                                                        sx={{
                                                            position: "absolute",
                                                            top: 10,
                                                            left: 10,
                                                            zIndex: 2,
                                                            fontWeight: 700,
                                                            fontSize: "0.75rem"
                                                        }}
                                                    />
                                                )}
                                                <CardMedia
                                                    className="product-img"
                                                    component="img"
                                                    image={item.image_url}
                                                    alt={item.name}
                                                    sx={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "contain",
                                                        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                                                    }}
                                                />
                                            </Box>

                                            <CardContent
                                                sx={{
                                                    textAlign: "left",
                                                    flex: "1 0 auto",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "space-between",
                                                    p: { xs: 1.5, md: 2 },
                                                    pb: "8px !important"
                                                }}
                                            >
                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={600}
                                                        color="#1e293b"
                                                        sx={{
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: "vertical",
                                                            lineHeight: 1.3,
                                                            fontSize: { xs: "0.875rem", md: "0.95rem" },
                                                            minHeight: { xs: 36, md: 40 }
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Typography>
                                                </Box>

                                                <Box mt={1}>
                                                    <Typography
                                                        variant="h6"
                                                        fontWeight={700}
                                                        color="#16a34a"
                                                        sx={{ fontSize: { xs: "1rem", md: "1.15rem" } }}
                                                    >
                                                        {smallSize ? Number(smallSize.price).toLocaleString() + "đ" : "Liên hệ"}
                                                    </Typography>
                                                </Box>
                                            </CardContent>

                                            <CardActions sx={{ p: 1.5, pt: 0, flexShrink: 0 }}>
                                                <Tooltip title={!isAvailable && limitingFlower ? `Thiếu hoa ${limitingFlower.name}` : ""}>
                                                    <Box width="100%">
                                                        <Button
                                                            fullWidth
                                                            size="small"
                                                            variant="contained"
                                                            disableElevation
                                                            startIcon={<ShoppingCartIcon sx={{ fontSize: 16 }} />}
                                                            sx={{
                                                                borderRadius: "10px",
                                                                py: 0.8,
                                                                fontWeight: 700,
                                                                fontSize: "0.8rem",
                                                                textTransform: "none",
                                                                bgcolor: "#16a34a",
                                                                color: "#fff",
                                                                "&:hover": {
                                                                    bgcolor: "#15803d",
                                                                    boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)"
                                                                },
                                                                "&:disabled": {
                                                                    bgcolor: "#e2e8f0",
                                                                    color: "#94a3b8"
                                                                }
                                                            }}
                                                            disabled={!isAvailable || !item.sizes || item.sizes.length === 0}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                if (!item.sizes || item.sizes.length === 0) {
                                                                    dispatch(
                                                                        showNotification({
                                                                            message: "Sản phẩm chưa có size!",
                                                                            severity: "warning"
                                                                        })
                                                                    );
                                                                    return;
                                                                }

                                                                const smallSize = item.sizes.find((s) => s.size.toLowerCase() === "nhỏ") || item.sizes[0];
                                                                handleAddToCart({
                                                                    id: item.id + "-" + smallSize.id,
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
                                                            Thêm vào giỏ
                                                        </Button>
                                                    </Box>
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