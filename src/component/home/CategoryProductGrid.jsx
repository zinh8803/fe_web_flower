import React from "react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import { showNotification } from "../../store/notificationSlice";

const CategoryProductGrid = ({ products, title }) => {
    const dispatch = useDispatch();

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
                        xs: "10px",   // Mobile: gap nhỏ
                        sm: "15px",   // Tablet: gap trung bình  
                        md: "20px"    // Desktop: gap lớn
                    }
                }}
            >
                {products.map((item) => (
                    <Box
                        key={item.id}
                        sx={{
                            // Kích thước container cố định
                            width: {
                                xs: "calc(50% - 5px)",    // Mobile: 2 sản phẩm/dòng
                                sm: "calc(33.33% - 10px)", // Tablet: 3 sản phẩm/dòng
                                md: "calc(25% - 15px)",    // Desktop: 4 sản phẩm/dòng
                                lg: "calc(20% - 16px)"     // Desktop large: 5 sản phẩm/dòng
                            },
                            // Chiều cao cố định cho toàn bộ container
                            height: {
                                xs: 320,   // Mobile 
                                sm: 350,   // Tablet
                                md: 380    // Desktop
                            }
                        }}
                    >
                        <Link
                            to={`/detail/${item.id}`}
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                                display: "block",
                                height: "100%"  // Link chiếm toàn bộ chiều cao container
                            }}
                        >
                            <Card
                                sx={{
                                    width: "100%",        // Chiếm toàn bộ chiều rộng container
                                    height: "100%",       // Chiếm toàn bộ chiều cao container
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
                                            xs: 160,   // Mobile
                                            sm: 170,   // Tablet
                                            md: 180    // Desktop
                                        },
                                        overflow: "hidden",  // Ẩn phần ảnh thừa
                                        position: "relative",
                                        flexShrink: 0,      // Không co lại
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={item.image_url}
                                        alt={item.name}
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",  // Giữ tỉ lệ ảnh
                                            p: 1
                                        }}
                                    />
                                </Box>

                                {/* Content với chiều cao cố định */}
                                <CardContent
                                    sx={{
                                        textAlign: "center",
                                        flex: "1 0 auto",  // Flex grow, không shrink
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        height: {
                                            xs: 90,    // Mobile
                                            sm: 100,   // Tablet
                                            md: 120    // Desktop
                                        },
                                        p: {
                                            xs: 1,     // Mobile
                                            md: 2      // Desktop
                                        },
                                        overflow: "hidden"  // Ẩn nội dung thừa
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        sx={{
                                            mb: 1,
                                            // Text overflow ellipsis sau 2 dòng
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            lineHeight: 1.2,
                                            minHeight: {
                                                xs: 36,    // 2 dòng chiều cao cố định
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
                                        flexShrink: 0   // Không co lại
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
                                                xs: 1,     // Mobile
                                                md: 2      // Desktop
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
                                            dispatch(addToCart({
                                                id: item.id + '-' + smallSize.id,
                                                name: item.name,
                                                price: Number(smallSize.price),
                                                image: item.image_url,
                                                product_id: item.id,
                                                quantity: 1,
                                                size: smallSize.size,
                                                product_size_id: smallSize.id,
                                            }));
                                            dispatch(showNotification({
                                                message: "Thêm vào giỏ hàng thành công!",
                                                severity: "success"
                                            }));
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
        </Box>
    );
};

export default CategoryProductGrid;