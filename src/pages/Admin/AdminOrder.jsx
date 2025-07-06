import React, { useEffect, useState } from "react";
import { getOrders, getOrderDetailAdmin, updateOrder } from "../../services/orderService";
import {
    Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, Pagination, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem
} from "@mui/material";

const AdminOrder = () => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [openDetail, setOpenDetail] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [status, setStatus] = useState("");

    useEffect(() => {
        fetchOrders(page);
    }, [page]);

    const fetchOrders = async (pageNum) => {
        try {
            const res = await getOrders(pageNum);
            setOrders(res.data.data);
            setTotalPages(res.data.meta.last_page);
        } catch (err) {
            console.error(err);
            setOrders([]);
        }
    };

    const handlePageChange = (event, value) => setPage(value);

    const handleOpenDetail = async (orderId) => {
        const res = await getOrderDetailAdmin(orderId);
        setSelectedOrder(res.data.data || res.data);
        setOpenDetail(true);
    };

    const handleOpenUpdate = async (orderId) => {
        const res = await getOrderDetailAdmin(orderId);
        console.log(res.data);
        setSelectedOrder(res.data.data || res.data);
        setStatus(res.data.data?.status || res.data.status || "");
        console.log("Selected Order Status:", res.data.data?.status || res.data.status || "");
        setOpenUpdate(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedOrder) return;
        await updateOrder(selectedOrder.id, { status });
        setOpenUpdate(false);
        fetchOrders(page);
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
                            {/* <TableCell>Email</TableCell> */}
                            <TableCell>Điện thoại</TableCell>
                            {/* <TableCell>Địa chỉ</TableCell>
                            <TableCell>Ghi chú</TableCell> */}
                            <TableCell>Ngày mua</TableCell>
                            <TableCell>Giảm giá</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell>{order.order_code}</TableCell>
                                <TableCell>{order.name}</TableCell>
                                {/* <TableCell>{order.email}</TableCell> */}
                                <TableCell>{order.phone}</TableCell>
                                {/* <TableCell>{order.address}</TableCell>
                                <TableCell>{order.note || "-"}</TableCell> */}
                                <TableCell>{order.buy_at}</TableCell>
                                <TableCell>
                                    {order.discount ? (
                                        <Chip
                                            label={`${order.discount.name} (${order.discount.type === "percent" ? `${order.discount.value}%` : `${parseInt(order.discount.value).toLocaleString()}đ`}) `}
                                            color="success"
                                            size="small"
                                        />
                                    ) : "-"}
                                </TableCell>
                                <TableCell>
                                    {Number(order.total_price).toLocaleString()}đ
                                </TableCell>
                                <TableCell>
                                    <Chip label={order.status} color="info" size="small" />
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" gap={1}>
                                        <Chip
                                            label="Chi tiết"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleOpenDetail(order.id)}
                                            sx={{ cursor: "pointer" }}
                                        />
                                        <Chip
                                            label="Cập nhật trạng thái"
                                            color="warning"
                                            size="small"
                                            onClick={() => handleOpenUpdate(order.id)}
                                            sx={{ cursor: "pointer" }}
                                        />
                                    </Box>
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

            {/* Modal chi tiết đơn hàng */}
            <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth>
                <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <Box>
                            <Typography><b>Mã đơn:</b> {selectedOrder.order_code}</Typography>
                            <Typography><b>Khách:</b> {selectedOrder.name}</Typography>
                            <Typography><b>Email:</b> {selectedOrder.email}</Typography>
                            <Typography><b>Điện thoại:</b> {selectedOrder.phone}</Typography>
                            <Typography><b>Địa chỉ:</b> {selectedOrder.address}</Typography>
                            <Typography><b>Ghi chú:</b> {selectedOrder.note || "-"}</Typography>
                            <Typography><b>Ngày mua:</b> {selectedOrder.buy_at}</Typography>
                            <Typography><b>Trạng thái:</b> {selectedOrder.status}</Typography>
                            <Typography><b>Tổng tiền:</b> {selectedOrder.total_price?.toLocaleString()}đ</Typography>
                            {/* Hiển thị sản phẩm trong đơn hàng */}
                            <Box mt={2}>
                                <Typography fontWeight={600}>Sản phẩm:</Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Ảnh</TableCell>
                                            <TableCell>Tên</TableCell>
                                            <TableCell>Kích thước</TableCell>
                                            <TableCell>Giá</TableCell>
                                            <TableCell>Số lượng</TableCell>
                                            <TableCell>Thành tiền</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(selectedOrder.order_details || []).map((item, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <img
                                                        src={item.product?.image_url}
                                                        alt={item.product?.name}
                                                        style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 4 }}
                                                    />
                                                </TableCell>
                                                <TableCell>{item.product?.name}</TableCell>
                                                <TableCell>{item.product_size?.size}</TableCell>
                                                <TableCell>{Number(item.product_size?.price || item.price || 0).toLocaleString()}đ</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>
                                                    {Number((item.product_size?.price || item.price || 0) * item.quantity).toLocaleString()}đ
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDetail(false)}>Đóng</Button>
                </DialogActions>
            </Dialog>

            {/* Modal cập nhật trạng thái */}
            <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} maxWidth="xs">
                <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
                <DialogContent>
                    <Select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        size="small"
                        sx={{ minWidth: 200, mt: 2 }}
                    >
                        <MenuItem value="đang xử lý">Đang xử lý</MenuItem>
                        <MenuItem value="đã xác nhận">Đã xác nhận</MenuItem>
                        <MenuItem value="Đang giao hàng">Đang giao hàng</MenuItem>
                        <MenuItem value="hoàn thành">Hoàn thành</MenuItem>
                        <MenuItem value="đã hủy">Đã hủy</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUpdate(false)}>Hủy</Button>
                    <Button variant="contained" onClick={handleUpdateStatus}>Cập nhật</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminOrder;