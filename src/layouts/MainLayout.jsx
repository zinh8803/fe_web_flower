import React from "react";
import { Container, Box, Typography } from "@mui/material";
import Header from "../component/Header";

const MainLayout = ({ children }) => {
    return (
        <Box minHeight="100vh" bgcolor="#f9fafb">
            <Header />
            <Container>{children}</Container>
            <Box
                component="footer"
                py={2}
                boxShadow={1}
                bgcolor="#fff"
                textAlign="center"
                mt={10}
            >
                <Typography variant="body2" color="text.secondary">
                    © 2025
                </Typography>
            </Box>
        </Box>
    );
};

export default MainLayout;
