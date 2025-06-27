import React from "react";
import { Container, Box } from "@mui/material";
import Header from "../component/home/Header";
import HomeBanner from "../component/home/HomeBanner";
import Footer from "../component/home/Footer";
import NotificationSnackbar from "../component/NotificationSnackbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <Box minHeight="100vh" bgcolor="#f9fafb">
            <Header />
            <HomeBanner />
            <Container>
                <Outlet />
            </Container>
            <Footer />
            <NotificationSnackbar />
        </Box>
    );
};

export default MainLayout;
