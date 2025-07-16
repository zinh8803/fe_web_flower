import React, { useEffect, useState } from "react";
import { getOrderHistory } from "../../services/userService";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Pagination, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        document.title = 'Lịch sử đơn hàng';
        const token = localStorage.getItem("token");
        setLoading(true);
        getOrderHistory(token, page)
            .then(res => {
                setOrders(res.data.data || []);
                setTotalPages(res.data.meta.last_page || 1);
            })
            .finally(() => setLoading(false));
    }, [page]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box maxWidth="1500px" mx="auto" mt={4}>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Lịch sử đơn hàng
            </Typography>
            {orders.length === 0 ? (
                <Typography>Chưa có đơn hàng nào.</Typography>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã đơn</TableCell>
                                    <TableCell>Ngày mua</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Tổng tiền</TableCell>
                                    <TableCell>Chi tiết</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map(order => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.order_code}</TableCell>
                                        <TableCell>{order.buy_at}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell>{Number(order.total_price).toLocaleString()}đ</TableCell>
                                        <TableCell>
                                            <Button
                                                component={Link}
                                                to={`/order/${order.id}`}
                                                variant="outlined"
                                                size="small"
                                            >
                                                Xem chi tiết
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
                </>
            )}
        </Box>
    );
};

export default OrderHistory;