import React, { useEffect, useState } from "react";
import { getOrderHistory } from "../../services/userService";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { Link } from "react-router-dom";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        getOrderHistory(token)
            .then(res => setOrders(res.data.data || []))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Typography>Đang tải...</Typography>;

    return (
        <Box maxWidth="900px" mx="auto" mt={4}>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Lịch sử đơn hàng
            </Typography>
            {orders.length === 0 ? (
                <Typography>Chưa có đơn hàng nào.</Typography>
            ) : (
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
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.buy_at}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell>{order.total_price}đ</TableCell>
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
            )}
        </Box>
    );
};

export default OrderHistory;