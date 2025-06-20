import React, { useEffect, useState } from "react";
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { getProducts, deleteProduct } from "../../services/productService";

const AdminProduct = () => {
    const [products, setProducts] = useState([]);
    const fetchProducts = async () => {
        try {
            const res = await getProducts();
            setProducts(res.data.data || []);
        } catch {
            alert("Error loading product list");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;
        try {
            await deleteProduct(id);
            fetchProducts();
        } catch (e) {
            console.error("Error deleting product:", e);
            alert("Lỗi khi xóa sản phẩm");
        }
    };

    return (
        <Box maxWidth="1100px" mx="auto" mt={4}>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Quản lý sản phẩm
            </Typography>
            <Button
                variant="contained"
                color="success"
                href="/admin/products/add"
                sx={{ mb: 2 }}
            >
                Thêm sản phẩm
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ảnh</TableCell>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell>Giá</TableCell>
                            <TableCell>Loại</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>
                                    <img src={p.image_url} alt={p.name} style={{ width: 60, height: 60, objectFit: "cover" }} />
                                </TableCell>
                                <TableCell>{p.name}</TableCell>
                                <TableCell>{Number(p.price).toLocaleString()}đ</TableCell>
                                <TableCell>{p.category?.name || ""}</TableCell>
                                <TableCell>
                                    {p.status ? (
                                        <span style={{ color: "green" }}>Hiện</span>
                                    ) : (
                                        <span style={{ color: "gray" }}>Ẩn</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        href={`/admin/products/edit?id=${p.id}`}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(p.id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdminProduct;