import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, Button, Pagination } from '@mui/material';
import { Restore } from '@mui/icons-material';
import { getAllProductTrash, restoreProduct } from '../../services/productService';
import { showNotification } from '../../store/notificationSlice';
import { useDispatch } from 'react-redux';

const AdminTrashProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [restoringId, setRestoringId] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const dispatch = useDispatch();

    const fetchTrashProducts = async (pageNum) => {
        setLoading(true);
        try {
            const res = await getAllProductTrash(pageNum);
            setProducts(res.data.data || []);
            setTotalPages(res.data.meta.last_page || 1);
        } catch (error) {
            console.error("Error fetching trash products:", error);
            setProducts([]);
            dispatch(showNotification({ message: "Lỗi khi tải thùng rác sản phẩm", severity: "error" }));
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTrashProducts(page);
    }, [page]);

    const handleRestore = async (id) => {
        setRestoringId(id);
        try {
            await restoreProduct(id);
            dispatch(showNotification({ message: "Khôi phục sản phẩm thành công!", severity: "success" }));
            fetchTrashProducts();
        } catch {
            dispatch(showNotification({ message: "Lỗi khi khôi phục sản phẩm", severity: "error" }));
        }
        setRestoringId(null);
    };
    const handlePageChange = (event, value) => setPage(value);
    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Thùng rác sản phẩm
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Ảnh</TableCell>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell>Khôi phục</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    Không có sản phẩm nào trong thùng rác
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((p, idx) => (
                                <TableRow key={p.id}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>
                                        <img src={p.image_url} alt={p.name} style={{ width: 60, height: 60, objectFit: "cover" }} />
                                    </TableCell>
                                    <TableCell>{p.name}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            startIcon={<Restore />}
                                            onClick={() => handleRestore(p.id)}
                                            disabled={restoringId === p.id}
                                        >
                                            {restoringId === p.id ? <CircularProgress size={20} /> : "Khôi phục"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default AdminTrashProducts;