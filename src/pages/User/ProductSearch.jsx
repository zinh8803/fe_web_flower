import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProductsBySearch } from "../../services/productService";
import { Container, Typography, CircularProgress, Box } from "@mui/material";
import ProductSearchGrid from "../../component/home/ProductSearchGrid";

const ProductSearch = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const keyword = searchParams.get("q") || "";

    useEffect(() => {
        document.title = `Tìm kiếm: ${keyword}`;
        if (!keyword) {
            setProducts([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        getProductsBySearch(keyword)
            .then(res => setProducts(res.data.data || []))
            .finally(() => setLoading(false));
    }, [keyword]);

    console.log("Products:", products);
    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Kết quả tìm kiếm: "{keyword}"
            </Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                    <CircularProgress />
                </Box>
            ) : products.length === 0 ? (
                <Typography>Không tìm thấy sản phẩm nào.</Typography>
            ) : (
                <ProductSearchGrid products={products} title={`Kết quả cho "${keyword}"`} />
            )}
        </Container>
    );
};

export default ProductSearch;