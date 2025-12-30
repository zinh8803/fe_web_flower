import React from "react";
import { Box } from "@mui/material"; // Bỏ import Container
import Header from "../component/home/Header";
import HomeBanner from "../component/home/HomeBanner";
import Footer from "../component/home/Footer";
import NotificationSnackbar from "../component/NotificationSnackbar";
import { Outlet } from "react-router-dom";
import Message from "../component/message/message";
const MainLayout = () => {
    return (
        <Box minHeight="100vh" bgcolor="#f9fafb">
            <Box>
                <Header />
                <HomeBanner />
                <Outlet />
                <Message />
                <Footer />
            </Box>
            <NotificationSnackbar />
        </Box>
    );
};

export default MainLayout;
