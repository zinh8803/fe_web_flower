import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsByCategory } from "../../services/productService";
import { getCategoryId } from "../../services/categoryService";
import CategoryProductGrid from "../../component/home/CategoryProductGrid";

const CategoryProductDetail = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);

    useEffect(() => {
        document.title = 'Danh mục sản phẩm';
        getCategoryId(id)
            .then(res => setCategory(res.data.data))
            .catch(() => setCategory(null));

        getProductsByCategory(id)
            .then(res => setProducts(res.data.data || []))
            .catch(() => setProducts([]));
    }, [id]);

    return (
        <div>

            {products.length === 0 ? (
                <p>Không có sản phẩm nào trong danh mục này.</p>
            ) : (
                <CategoryProductGrid products={products} title={category?.name || "Sản phẩm"} />
            )}
        </div>
    );
};

export default CategoryProductDetail;