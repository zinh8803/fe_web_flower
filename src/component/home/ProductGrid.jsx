import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import { getProducts } from "../../services/productService";
import { showNotification } from "../../store/notificationSlice";

const ProductGrid = ({ title }) => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts(1);
    }, []);

    const fetchProducts = async (page) => {
        try {
            setLoading(true);
            const res = await getProducts(page);

            if (page === 1) {
                setProducts(res.data.data);
            } else {
                setProducts(prev => [...prev, ...res.data.data]);
            }

            setCurrentPage(res.data.meta.current_page);
            setLastPage(res.data.meta.last_page);
        } catch (error) {
            console.error("Error fetching products:", error);
            dispatch(showNotification({
                message: "Lỗi khi tải sản phẩm!",
                severity: "error"
            }));
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        if (currentPage < lastPage && !loading) {
            fetchProducts(currentPage + 1);
        }
    };

    const handleAddToCart = (item) => {
        dispatch(addToCart(item));
        dispatch(showNotification({
            message: "Thêm vào giỏ hàng thành công!",
            severity: "success"
        }));
    };

    return (
        <Box
            sx={{
                p: 4,
                borderRadius: 2,
                bgcolor: "#fff",
                width: "100%",
                maxWidth: "1400px",
                mx: "auto",
            }}
        >
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
                {products.map((item) => (
                    <Box
                        key={item.id}
                        sx={{
                            width: {
                                xs: "calc(50% - 5px)",
                                sm: "calc(33.33% - 10px)",
                                md: "calc(25% - 15px)",
                                lg: "calc(20% - 16px)"
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
                                {/* Image container với chiều cao cố định */}
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

                                {/* Content với chiều cao cố định */}
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
                                    <Typography
                                        color="error"
                                        fontWeight={700}
                                    >
                                        {item.sizes && item.sizes.length > 0
                                            ? Number(item.sizes[0].price).toLocaleString() + "đ"
                                            : "Liên hệ"}
                                    </Typography>
                                </CardContent>

                                {/* Button container với chiều cao cố định */}
                                <CardActions
                                    sx={{
                                        justifyContent: "center",
                                        height: {
                                            xs: 50,    // Mobile
                                            sm: 60,    // Tablet
                                            md: 60     // Desktop
                                        },
                                        p: 0,
                                        flexShrink: 0
                                    }}
                                >
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
                                            });
                                        }}
                                    >
                                        Mua Ngay
                                    </Button>
                                </CardActions>
                            </Card>
                        </Link>
                    </Box>
                ))}
            </Box>

            {/* Load More Button */}
            {currentPage < lastPage && (
                <Box textAlign="center" mt={4}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "orange",
                            borderRadius: 10,
                            minWidth: 120
                        }}
                        onClick={handleLoadMore}
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "Xem thêm"
                        )}
                    </Button>
                </Box>
            )}

            {/* Hiển thị thông tin trang */}
            <Box textAlign="center" mt={2}>
                <Typography variant="body2" color="text.secondary">
                    Đang hiển thị {products.length} sản phẩm
                    {currentPage < lastPage && ` (Trang ${currentPage}/${lastPage})`}
                </Typography>
            </Box>
        </Box>
    );
};

export default ProductGrid;
