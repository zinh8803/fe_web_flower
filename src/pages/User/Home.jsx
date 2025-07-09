import React from "react";
import { Container } from "@mui/material";
import ProductGrid from "../../component/home/ProductGrid";

const Home = () => {
    document.title = 'Trang sản phẩm';
    return (
        <Container maxWidth="xl" sx={{ py: 4 }} >
            <ProductGrid title="HOA TẶNG & HOA DỊCH VỤ" />
        </Container>
    );
};

export default Home;
