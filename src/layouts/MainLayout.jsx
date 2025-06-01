import React from "react";
import { Container } from "@mui/material";
import Header from "../component/Header";

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* <header className="p-4 shadow bg-white">Header</header> */}
            <Header />
            <Container>{children}</Container>
            <footer className="p-4 shadow bg-white text-center mt-10">© 2025</footer>
        </div>
    );
};

export default MainLayout;
