import React from "react";
import { Box, Typography } from "@mui/material";

const ProductDescription = ({ description }) => {
    if (!description) return null;
    return (
        <Box sx={{ mt: 6 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
                Mô tả sản phẩm
            </Typography>
            <Box sx={{ lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: description }} />
        </Box>
    );
};

export default ProductDescription;