import React, { useEffect, useState } from "react";
import { getOrders, getOrderDetailAdmin, updateOrder } from "../../services/orderService";
import {
    Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, Pagination, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, TextField, Collapse, IconButton
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const AdminOrder = () => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [status, setStatus] = useState("");

    const [openRow, setOpenRow] = useState(null);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    useEffect(() => {
        fetchOrders(page);
    }, [page]);

    const fetchOrders = async (pageNum, filters = {}) => {
        try {
            const res = await getOrders(pageNum, {
                from_date: filters.fromDate || fromDate,
                to_date: filters.toDate || toDate,
                status: filters.status || filterStatus
            });
            setOrders(res.data.data);
            setTotalPages(res.data.meta.last_page);
        } catch (err) {
            console.error(err);
            setOrders([]);
        }
    };

    const handlePageChange = (event, value) => setPage(value);

    const handleToggleRow = async (orderId) => {
        if (openRow === orderId) {
            setOpenRow(null);
            return;
        }

        try {
            const res = await getOrderDetailAdmin(orderId);
            const orderData = res.data.data || res.data;

            setOrders(orders.map(order =>
                order.id === orderId
                    ? { ...order, order_details: orderData.order_details }
                    : order
            ));

            setOpenRow(orderId);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenUpdate = async (orderId) => {
        const res = await getOrderDetailAdmin(orderId);
        setSelectedOrder(res.data.data || res.data);
        setStatus(res.data.data?.status || res.data.status || "");
        setOpenUpdate(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedOrder) return;
        await updateOrder(selectedOrder.id, { status });
        setOpenUpdate(false);
        fetchOrders(page);
    };

    const handleFilter = () => {
        setPage(1);
        fetchOrders(1);
    };

    const handleClearFilter = () => {
        setFromDate("");
        setToDate("");
        setFilterStatus("");
        setPage(1);
        fetchOrders(1, { fromDate: "", toDate: "", status: "" });
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Quản lý đơn hàng
            </Typography>

            <Box display="flex" gap={2} mb={2} flexWrap="wrap" alignItems="center">
                <TextField
                    label="Từ ngày"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                />
                <TextField
                    label="Đến ngày"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={toDate}
                    onChange={e => setToDate(e.target.value)}
                />
                <Select
                    displayEmpty
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    size="small"
                    sx={{ minWidth: 180 }}
                >
                    <MenuItem value="">Tất cả trạng thái</MenuItem>
                    <MenuItem value="đang xử lý">Đang xử lý</MenuItem>
                    <MenuItem value="đã xác nhận">Đã xác nhận</MenuItem>
                    <MenuItem value="đang giao hàng">Đang giao hàng</MenuItem>
                    <MenuItem value="hoàn thành">Hoàn thành</MenuItem>
                    <MenuItem value="đã hủy">Đã hủy</MenuItem>
                </Select>
                <Button variant="contained" onClick={handleFilter}>
                    Lọc
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleClearFilter}
                >
                    Xóa bộ lọc
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Mã đơn</TableCell>
                            <TableCell>Khách hàng</TableCell>
                            <TableCell>Điện thoại</TableCell>
                            <TableCell>Ngày mua</TableCell>
                            <TableCell>Giảm giá</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map(order => (
                            <React.Fragment key={order.id}>
                                <TableRow>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleToggleRow(order.id)}
                                        >
                                            {openRow === order.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>{order.order_code}</TableCell>
                                    <TableCell>{order.name}</TableCell>
                                    <TableCell>{order.phone}</TableCell>
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
                                        <Chip
                                            label={order.status}
                                            color={
                                                order.status === "đang xử lý" ? "warning"
                                                    : order.status === "đã xác nhận" ? "primary"
                                                        : order.status === "đang giao hàng" ? "info"
                                                            : order.status === "hoàn thành" ? "success"
                                                                : order.status === "đã hủy" ? "error"
                                                                    : "default"
                                            }
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label="Cập nhật trạng thái"
                                            color="secondary"
                                            size="small"
                                            onClick={() => handleOpenUpdate(order.id)}
                                            sx={{ cursor: "pointer" }}
                                            disabled={order.status === "hoàn thành" || order.status === "đã hủy"}
                                        />
                                    </TableCell>
                                </TableRow>
                                {/* Phần xổ xuống chi tiết */}
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                                        <Collapse in={openRow === order.id} timeout="auto" unmountOnExit>
                                            <Box margin={2}>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    Chi tiết đơn hàng
                                                </Typography>
                                                <Box mb={2}>
                                                    <Typography><b>Mã đơn:</b> {order.order_code}</Typography>
                                                    <Typography><b>Khách hàng:</b> {order.name}</Typography>
                                                    <Typography><b>Email:</b> {order.email || "-"}</Typography>
                                                    <Typography><b>Điện thoại:</b> {order.phone}</Typography>
                                                    <Typography><b>Địa chỉ:</b> {order.address}</Typography>
                                                    <Typography><b>Ghi chú:</b> {order.note || "-"}</Typography>
                                                </Box>
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
                                                        {(order.order_details || []).map((item, idx) => (
                                                            <TableRow key={idx}>
                                                                <TableCell>
                                                                    <img
                                                                        src={item.product_size.product?.image_url}
                                                                        alt={item.product_size.product?.name}
                                                                        style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 4 }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>{item.product_size.product?.name}</TableCell>
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
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
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
                        <MenuItem value="đang giao hàng">Đang giao hàng</MenuItem>
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