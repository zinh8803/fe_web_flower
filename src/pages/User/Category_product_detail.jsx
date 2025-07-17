import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsByCategorySlug } from "../../services/productService";
import { getCategoryId } from "../../services/categoryService";
import CategoryProductGrid from "../../component/home/CategoryProductGrid";
import { Box, CircularProgress, Container } from "@mui/material";

const CategoryProductDetail = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'Danh mục sản phẩm';
        setLoading(true);
        Promise.all([
            getCategoryId(id).then(res => setCategory(res.data.data)).catch(() => setCategory(null)),
            getProductsByCategorySlug(id).then(res => setProducts(res.data.data || [])).catch(() => setProducts([]))
        ]).finally(() => setLoading(false));
    }, [id]);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                    <CircularProgress />
                </Box>
            ) : products.length === 0 ? (
                <Box textAlign="center" py={4}>
                    <p>Không có sản phẩm nào trong danh mục này.</p>
                </Box>
            ) : (
                <CategoryProductGrid products={products} title={category?.name || "Sản phẩm"} />
            )}
        </Container>
    );
};

export default CategoryProductDetail;