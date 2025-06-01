import React from "react";
import { Box, Typography } from "@mui/material";

const Home = () => {
    return (
        <Box textAlign="center" py={10}>
            <Typography variant="h3" color="primary" fontWeight="bold">
                Welcome to Flower Shop
            </Typography>
            <Typography mt={4} color="text.secondary">
                Trang chủ đang hoạt động!
            </Typography>
        </Box>
    );
};

export default Home;
