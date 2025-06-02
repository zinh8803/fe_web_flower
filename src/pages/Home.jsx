import React from "react";
import { Box, Button, Container } from "@mui/material";
import ProductGrid from "../component/home/ProductGrid";
import LoginDialog from "../component/auth/LoginDialog";

const Home = () => {
    return (
        <Container maxWidth="xl" sx={{ py: 4 }} >




            <ProductGrid title="HOA TẶNG & HOA DỊCH VỤ" />
        </Container>
    );
};

export default Home;
