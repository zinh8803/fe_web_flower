import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const RelatedProducts = ({ related }) => {
    if (!related || related.length === 0) return null;
    return (
        <Box sx={{ mt: 8 }}>
            <Typography variant="h6" fontWeight={700} mb={3}>
                Sản phẩm liên quan
            </Typography>
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {related.map(item => (
                    <Link
                        key={item.id}
                        to={`/detail/${item.slug}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Box
                            sx={{
                                width: 220,
                                border: "1px solid #eee",
                                borderRadius: 2,
                                p: 2,
                                textAlign: "center",
                                transition: "box-shadow 0.2s",
                                "&:hover": { boxShadow: 3 },
                            }}
                        >
                            <img
                                src={item.image_url}
                                alt={item.name}
                                style={{ width: "100%", height: 120, objectFit: "contain", borderRadius: 8 }}
                            />
                            <Typography fontWeight={600} mt={1}>
                                {item.name}
                            </Typography>
                            <Typography color="error" fontWeight={700}>
                                {Number(item.sizes[0].price).toLocaleString()}đ
                            </Typography>
                        </Box>
                    </Link>
                ))}
            </Box>
        </Box>
    );
};

export default RelatedProducts;