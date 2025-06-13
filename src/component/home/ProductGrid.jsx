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
import { addToCart } from "../../store/cartSlice"; // Đường dẫn đúng tới cartSlice.js

const sectionData = {
    title: "HOA TẶNG & HOA DỊCH VỤ1",
    products: [
        {
            id: 1,
            name: "Hộp Hoa Yêu Thương Rực Rỡ 681",
            image: "https://storage.googleapis.com/cdn_dlhf_vn/public/products/AFFM/AFFMIXD681/1746704852_681c99d42f087.png",
            price: 1000000,
            unit: "Hộp",
        },
        {
            id: 2,
            name: "Giỏ Hoa Yêu Thương Rực Rỡ 678",
            image: "https://storage.googleapis.com/cdn_dlhf_vn/public/products/AFFM/AFFMIXD681/1746704852_681c99d42f087.png",
            price: 1400000,
            unit: "Giỏ",
        },
        {
            id: 3,
            name: "Bó Hoa Chúc Mừng Mặt Trời Đỏ",
            image: "https://storage.googleapis.com/cdn_dlhf_vn/public/products/AFFM/AFFMIXD681/1746704852_681c99d42f087.png",
            price: 850000,
            unit: "Bó",
        },
        {
            id: 4,
            name: "Lẵng Hoa Sinh Nhật Tươi Vui",
            image: "https://storage.googleapis.com/cdn_dlhf_vn/public/products/AFFM/AFFMIXD681/1746704852_681c99d42f087.png",
            price: 1200000,
            unit: "Lẵng",
        },
        {
            id: 5,
            name: "Hộp Hoa Đỏ Lãng Mạn",
            image: "https://storage.googleapis.com/cdn_dlhf_vn/public/products/AFFM/AFFMIXD681/1746704852_681c99d42f087.png",
            price: 1050000,
            unit: "Hộp",
        },
        {
            id: 6,
            name: "Giỏ Hoa Sáng Tạo",
            image: "https://storage.googleapis.com/cdn_dlhf_vn/public/products/AFFM/AFFMIXD681/1746704852_681c99d42f087.png",
            price: 1300000,
            unit: "Giỏ",
        },


    ],
};

const ProductGrid = ({ title }) => {
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
                    gap: "20px",
                }}
            >
                {sectionData.products.map((item, idx) => (
                    <Link
                        key={idx}
                        to={`/detail/${item.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Card
                            key={idx}
                            sx={{
                                width: "18%",
                                minWidth: 220,
                                maxWidth: 240,
                                borderRadius: 2,

                                boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                                transition: "transform 0.2s",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                },
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={item.image}
                                alt={item.name}
                                sx={{
                                    height: 180,
                                    objectFit: "contain",
                                    p: 1,
                                }}
                            />
                            <CardContent sx={{ textAlign: "center" }}>
                                <Typography variant="body2" fontWeight={600}>
                                    {item.name}
                                </Typography>
                                <Typography color="error" fontWeight={700}>
                                    {item.price}/{item.unit}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="error"
                                    endIcon={<ShoppingCartIcon />}
                                    sx={{ borderRadius: 5, px: 2 }}
                                    onClick={e => {
                                        e.preventDefault(); // Không chuyển trang khi bấm nút
                                        dispatch(addToCart(item));
                                    }}
                                >
                                    Mua Ngay
                                </Button>
                            </CardActions>
                        </Card>
                    </Link>
                ))}
            </Box>

            <Box textAlign="center" mt={4}>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: "orange", borderRadius: 10 }}
                >
                    Xem tất cả
                </Button>
            </Box>
        </Box>
    );
};

export default ProductGrid;
