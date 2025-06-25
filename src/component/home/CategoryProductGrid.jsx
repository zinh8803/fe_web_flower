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
                    gap: "20px",
                }}
            >
                {products.map((item) => (
                    <Link
                        key={item.id}
                        to={`/detail/${item.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Card
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
                                image={item.image_url}
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
                                    {Number(item.sizes[0].price).toLocaleString()}đ
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
                                        e.preventDefault();
                                        if (!item.sizes || item.sizes.length === 0) {
                                            alert("Sản phẩm này không có kích thước nào. Vui lòng chọn sản phẩm khác.");
                                            return;
                                        }
                                        const smallSize = item.sizes.find(s => s.size.toLowerCase() === "nhỏ") || item.sizes[0];
                                        dispatch(addToCart({
                                            id: item.id + '-' + smallSize.id,
                                            name: item.name,
                                            price: Number(smallSize.price),
                                            product_id: item.id,
                                            image: item.image_url,
                                            quantity: 1,
                                            size: smallSize.size,
                                            product_size_id: smallSize.id,
                                        }));
                                    }}
                                >
                                    Mua Ngay
                                </Button>
                            </CardActions>
                        </Card>
                    </Link>
                ))}
            </Box>
        </Box>
    );
};

export default CategoryProductGrid;