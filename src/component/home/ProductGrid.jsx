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
    Tooltip,
    Drawer,
    IconButton,
    useMediaQuery,
    useTheme,
    Skeleton,
    Chip
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import { filterProducts, getProducts } from "../../services/productService";
import { showNotification } from "../../store/notificationSlice";
import { fetchStockAvailability } from "../../store/stockSlice";
import Filter from "./Filter";

const ProductGrid = ({ filterParams = {} }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [filtering, setFiltering] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);

    const stockState = useSelector((state) => state.stock);
    const cartItems = useSelector((state) => state.cart.items);

    useEffect(() => {
        fetchProducts(1);
        dispatch(
            fetchStockAvailability(
                cartItems.map((item) => ({
                    product_size_id: item.product_size_id,
                    quantity: item.quantity
                }))
            )
        );
    }, [dispatch]);

    useEffect(() => {
        handleFilter(filterParams);
    }, [filterParams]);

    const fetchProducts = async (page) => {
        try {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const hasActiveFilter = filterParams.color || filterParams.flower_type_id || filterParams.price;
            const res = hasActiveFilter
                ? await filterProducts({ ...filterParams, page })
                : await getProducts(page);

            const newItems = Array.isArray(res.data?.data)
                ? res.data.data
                : Array.isArray(res.data)
                ? res.data
                : [];

            // Supports both ResourceCollection (res.data.meta) and direct Paginator (res.data)
            const currPage = res.data?.meta?.current_page ?? res.data?.current_page ?? page;
            const lPage = res.data?.meta?.last_page ?? res.data?.last_page ?? 1;

            if (page === 1) {
                setProducts(newItems);
            } else {
                setProducts((prev) => [...prev, ...newItems]);
            }

            setCurrentPage(currPage);
            setLastPage(lPage);
        } catch (error) {
            console.error("Error fetching products:", error);
            dispatch(
                showNotification({
                    message: "Lỗi khi tải sản phẩm!",
                    severity: "error"
                })
            );
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleFilter = async (params) => {
        try {
            setFiltering(true);
            setIsFiltering(true);

            if (params.color || params.flower_type_id || params.price) {
                const res = await filterProducts({ ...params, page: 1 });
                const newItems = Array.isArray(res.data?.data) ? res.data.data : [];
                setProducts(newItems);
                setCurrentPage(res.data?.meta?.current_page ?? res.data?.current_page ?? 1);
                setLastPage(res.data?.meta?.last_page ?? res.data?.last_page ?? 1);
            } else {
                setIsFiltering(false);
                fetchProducts(1);
            }
        } catch (error) {
            console.error("Error filtering products:", error);
            dispatch(
                showNotification({
                    message: "Lỗi khi lọc sản phẩm!",
                    severity: "error"
                })
            );
        } finally {
            setFiltering(false);
        }
    };

    const handleLoadMore = () => {
        if (currentPage < lastPage && !loadingMore) {
            fetchProducts(currentPage + 1);
        }
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

    const [drawerOpen, setDrawerOpen] = useState(false);

    // Skeleton Loaders Placeholder
    const renderSkeletons = () => (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: { xs: "12px", sm: "16px", md: "20px" },
                width: "100%"
            }}
        >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                <Box
                    key={idx}
                    sx={{
                        width: {
                            xs: "calc(50% - 6px)",
                            sm: "calc(50% - 8px)",
                            md: "calc(33.33% - 14px)",
                            lg: "calc(25% - 15px)"
                        },
                        height: 380
                    }}
                >
                    <Skeleton variant="rounded" height="100%" sx={{ borderRadius: "16px" }} />
                </Box>
            ))}
        </Box>
    );

    return (
        <Box sx={{ width: "100%" }}>
            {/* Mobile Filter Drawer */}
            {isMobile && (
                <Drawer
                    anchor="bottom"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    PaperProps={{
                        sx: {
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            maxHeight: "85vh",
                            pb: 2
                        }
                    }}
                >
                    <Box sx={{ p: 2.5, maxHeight: "80vh", overflowY: "auto" }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" fontWeight={700}>
                                Bộ lọc sản phẩm
                            </Typography>
                            <IconButton onClick={() => setDrawerOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Filter
                            onFilter={(params) => {
                                setDrawerOpen(false);
                                handleFilter(params);
                            }}
                        />
                    </Box>
                </Drawer>
            )}

            {/* Floating Mobile Filter Button */}
            {isMobile && (
                <Box sx={{ position: "fixed", bottom: 24, right: 20, zIndex: 1000 }}>
                    <Button
                        variant="contained"
                        onClick={() => setDrawerOpen(true)}
                        startIcon={<FilterListIcon />}
                        sx={{
                            borderRadius: "999px",
                            bgcolor: "#16a34a",
                            color: "#fff",
                            boxShadow: "0 6px 20px rgba(22, 163, 74, 0.4)",
                            px: 3,
                            py: 1.2,
                            fontWeight: 700,
                            "&:hover": { bgcolor: "#15803d" }
                        }}
                    >
                        Bộ lọc
                    </Button>
                </Box>
            )}

            <Box sx={{ p: { xs: 1.5, sm: 3 }, borderRadius: "16px", bgcolor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
                {loading || filtering ? (
                    renderSkeletons()
                ) : products.length > 0 ? (
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
                        {products.map((item) => {
                            const smallSize = item.sizes?.find((s) => s.size.toLowerCase() === "nhỏ") || item.sizes?.[0] || item.product_sizes?.find((s) => s.size.toLowerCase() === "nhỏ") || item.product_sizes?.[0];
                            if (!smallSize) return null;

                            const isAvailable = isProductAvailable(item.id, smallSize.id);
                            const limitingFlower = getLimitingFlowerInfo(item.id, smallSize.id);

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
                                            {/* Image container */}
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

                                            {/* Content */}
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
                                                        {Number(smallSize.price).toLocaleString() + "đ"}
                                                    </Typography>
                                                </Box>
                                            </CardContent>

                                            {/* Action Button */}
                                            <CardActions
                                                sx={{
                                                    p: 1.5,
                                                    pt: 0,
                                                    flexShrink: 0
                                                }}
                                            >
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
                                                            disabled={!isAvailable || smallSize.max_quantity <= 0}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleAddToCart({
                                                                    id: item.id + "-" + smallSize.id,
                                                                    name: item.name,
                                                                    price: Number(smallSize.price),
                                                                    image: item.image_url,
                                                                    product_id: item.id,
                                                                    quantity: 1,
                                                                    size: smallSize.size,
                                                                    product_size_id: smallSize.id,
                                                                    sizes: item.sizes || item.product_sizes
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
                ) : (
                    <Box textAlign="center" width="100%" py={8}>
                        <Typography color="text.secondary" variant="h6">
                            Không tìm thấy sản phẩm phù hợp
                        </Typography>
                    </Box>
                )}

                {/* Load More Button */}
                {currentPage < lastPage && !filtering && (
                    <Box textAlign="center" mt={5}>
                        <Button
                            variant="outlined"
                            color="success"
                            size="large"
                            sx={{
                                borderRadius: "999px",
                                px: 4,
                                py: 1,
                                fontWeight: 700,
                                borderWidth: 2,
                                "&:hover": { borderWidth: 2, bgcolor: "rgba(22, 163, 74, 0.06)" }
                            }}
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                        >
                            {loadingMore ? <CircularProgress size={24} color="success" /> : "Xem thêm sản phẩm"}
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ProductGrid;
