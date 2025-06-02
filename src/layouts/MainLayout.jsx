import React from "react";
import { Container, Box, Typography } from "@mui/material";
import Header from "../component/home/Header";
import HomeBanner from "../component/home/HomeBanner";
import Footer from "../component/home/Footer";

const MainLayout = ({ children }) => {
    return (
        <Box minHeight="100vh" bgcolor="#f9fafb">
            <Header />
            <HomeBanner />
            <Container>{children}</Container>



            <Footer />

        </Box>
    );
};

export default MainLayout;
