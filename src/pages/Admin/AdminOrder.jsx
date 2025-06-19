import React, { useEffect, useState } from "react";
import { getOrders } from "../../services/orderService";
import {
    Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, Pagination, Chip
} from "@mui/material";

const AdminOrder = () => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchOrders(page);
    }, [page]);

    const fetchOrders = async (pageNum) => {
        try {
            const res = await getOrders(pageNum);
            setOrders(res.data.data);
            setTotalPages(res.data.meta.last_page);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setOrders([]);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Quản lý đơn hàng
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Khách hàng</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Điện thoại</TableCell>
                            <TableCell>Địa chỉ</TableCell>
                            <TableCell>Ghi chú</TableCell>
                            <TableCell>Ngày mua</TableCell>
                            <TableCell>Giảm giá</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.name}</TableCell>
                                <TableCell>{order.email}</TableCell>
                                <TableCell>{order.phone}</TableCell>
                                <TableCell>{order.address}</TableCell>
                                <TableCell>{order.note || "-"}</TableCell>
                                <TableCell>{order.buy_at}</TableCell>
                                <TableCell>
                                    {order.discount ? (
                                        <Chip
                                            label={`${order.discount.name} (${order.discount.type === "percent" ? `${order.discount.value}%` : `${parseInt(order.discount.value).toLocaleString()}đ`}) -${parseInt(order.discount.amount_applied).toLocaleString()}đ`}
                                            color="success"
                                            size="small"
                                        />
                                    ) : "-"}
                                </TableCell>
                                <TableCell>
                                    {order.total_price}
                                </TableCell>
                                <TableCell>
                                    <Chip label={order.status} color="info" size="small" />
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
        </Box>
    );
};

export default AdminOrder;