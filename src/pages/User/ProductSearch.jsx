import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProductsBySearch } from "../../services/productService";
import { Box, Typography, CircularProgress } from "@mui/material";
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

    return (
        <Box maxWidth="1200px" mx="auto" mt={4}>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Kết quả tìm kiếm: "{keyword}"
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : products.length === 0 ? (
                <Typography>Không tìm thấy sản phẩm nào.</Typography>
            ) : (
                <ProductSearchGrid products={products} title={`Kết quả cho "${keyword}"`} />
            )}
        </Box>
    );
};

export default ProductSearch;