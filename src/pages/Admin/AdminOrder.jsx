import React, { useEffect, useState } from "react";
import { getOrders, getOrderDetailAdmin, updateOrder, updateReport } from "../../services/orderService";
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
    const [viewAllReportsDialog, setViewAllReportsDialog] = useState(false);
    const [currentReports, setCurrentReports] = useState([]);
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [handleReportDialog, setHandleReportDialog] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [adminNote, setAdminNote] = useState("");
    const [reportStatus, setReportStatus] = useState("");
    const [orderStatus, setOrderStatus] = useState("");

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
                    <MenuItem value="đang xử lý báo cáo">Đang xử lý báo cáo</MenuItem>
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
                        <TableRow

                        >
                            <TableCell />
                            <TableCell>Mã đơn</TableCell>
                            <TableCell>Khách hàng</TableCell>
                            <TableCell>Điện thoại</TableCell>
                            <TableCell>Ngày mua</TableCell>
                            <TableCell>Ngày giao</TableCell>
                            {/* <TableCell>Giảm giá</TableCell> */}
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map(order => (
                            <React.Fragment key={order.id}>
                                <TableRow
                                    sx={order.is_express ? { backgroundColor: "#EEEEEE" } : {}}
                                >
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
                                    <TableCell>{order.delivery_date} {order.delivery_time}</TableCell>
                                    {/* <TableCell>
                                        {order.discount ? (
                                            <Chip
                                                label={`${order.discount.name} (${order.discount.type === "percent" ? `${order.discount.value}%` : `${parseInt(order.discount.value).toLocaleString()}đ`}) `}
                                                color="success"
                                                size="small"
                                            />
                                        ) : "-"}
                                    </TableCell> */}
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
                                                                : order.status === "đang xử lý báo cáo" ? "warning"
                                                                    : order.status === "đã hủy" ? "error"
                                                                        : "default"
                                            }
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color="primary"
                                            onClick={() => handleOpenUpdate(order.id)}
                                            disabled={order.status === "hoàn thành" || order.status === "đã hủy" || order.status === "đang xử lý báo cáo" || order.status === "Xử Lý Báo Cáo"}
                                        > Cập nhật trạng thái
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                {/* Phần xổ xuống chi tiết */}
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                                        <Collapse in={openRow === order.id} timeout="auto" unmountOnExit>
                                            <Box margin={2}>
                                                <Box mb={2} display="flex" alignItems="center" gap={2}>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        Chi tiết đơn hàng
                                                    </Typography>
                                                    {(order.product_reports && order.product_reports.length > 0) && (
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => {
                                                                setCurrentReports(order.product_reports);
                                                                setViewAllReportsDialog(true);
                                                            }}
                                                        >
                                                            Xem báo cáo ({order.product_reports.length})
                                                        </Button>
                                                    )}
                                                </Box>
                                                <Box mb={2}>
                                                    <Typography><b>Mã đơn:</b> {order.order_code}</Typography>
                                                    <Typography><b>Khách hàng:</b> {order.name}</Typography>
                                                    <Typography><b>Email:</b> {order.email || "-"}</Typography>
                                                    <Typography><b>Điện thoại:</b> {order.phone}</Typography>
                                                    <Typography><b>Địa chỉ:</b> {order.address}</Typography>
                                                    <Typography><b>Ghi chú:</b> {order.note || "-"}</Typography>
                                                    <Typography>
                                                        <b>Ngày giao hàng:</b> {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : "-"}
                                                    </Typography>
                                                    <Typography>
                                                        <b>Giờ giao hàng:</b> {order.is_express ? "Giao nhanh" : (order.delivery_time || "-")}
                                                    </Typography>
                                                    <Typography>
                                                        <b>Giao nhanh:</b> {order.is_express ? "Có" : "Không"}
                                                    </Typography>
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
                        <MenuItem value="đang xử lý báo cáo">Đang xử lý báo cáo</MenuItem>
                        <MenuItem value="đã hủy">Đã hủy</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUpdate(false)}>Hủy</Button>
                    <Button variant="contained" onClick={handleUpdateStatus}>Cập nhật</Button>
                </DialogActions>
            </Dialog>

            {/* Modal xem tất cả báo cáo sản phẩm */}
            <Dialog
                open={viewAllReportsDialog}
                onClose={() => setViewAllReportsDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Danh sách báo cáo sản phẩm</DialogTitle>
                <DialogContent>
                    {currentReports.length === 0 ? (
                        <Typography>Không có báo cáo nào cho đơn hàng này.</Typography>
                    ) : (
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Sản phẩm</TableCell>
                                    <TableCell>Kích thước</TableCell>
                                    <TableCell>Số lượng lỗi</TableCell>
                                    <TableCell>Lý do</TableCell>
                                    <TableCell>Hoàn trả</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Ảnh</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentReports.map((r, idx) => {
                                    const detail = (orders.find(o => o.product_reports?.includes(r))?.order_details || [])
                                        .find(d => d.id === r.order_detail_id)
                                        || (selectedOrder?.order_details || []).find(d => d.id === r.order_detail_id);

                                    return (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                {detail?.product_size?.product?.name || "-"}
                                            </TableCell>
                                            <TableCell>
                                                {detail?.product_size?.size || "-"}
                                            </TableCell>
                                            <TableCell>{r.quantity}</TableCell>
                                            <TableCell>{r.reason}</TableCell>
                                            <TableCell>{r.action}</TableCell>
                                            <TableCell>{r.status}</TableCell>
                                            <TableCell>
                                                {r.image_url && (
                                                    <img
                                                        src={r.image_url}
                                                        alt="Ảnh báo cáo"
                                                        style={{ maxWidth: 60, borderRadius: 4, cursor: "pointer" }}
                                                        onClick={() => {
                                                            setCurrentImage(r.image_url);
                                                            setOpenImageDialog(true);
                                                        }}
                                                    />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewAllReportsDialog(false)}>Đóng</Button>
                    {currentReports.length > 0 && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={async () => {
                                // Lấy order chi tiết nếu chưa có
                                let order = selectedOrder;
                                if (!order || order.id !== currentReports[0]?.order_id) {
                                    const res = await getOrderDetailAdmin(currentReports[0]?.order_id);
                                    order = res.data.data || res.data;
                                    setSelectedOrder(order);
                                }
                                setCurrentReports(order.product_reports || []);
                                setHandleReportDialog(true);
                            }}
                        >
                            Xử lý báo cáo
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Modal xử lý báo cáo sản phẩm */}
            <Dialog
                open={handleReportDialog}
                onClose={() => setHandleReportDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Xử lý báo cáo sản phẩm</DialogTitle>
                <DialogContent>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Sản phẩm</TableCell>
                                <TableCell>Kích thước</TableCell>
                                <TableCell>Số lượng lỗi</TableCell>
                                <TableCell>Lý do</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Ghi chú xử lý</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentReports.map((r, idx) => {
                                const detail = (selectedOrder?.order_details || []).find(d => d.id === r.order_detail_id);
                                return (
                                    <TableRow key={r.id}>
                                        <TableCell>{detail?.product_size?.product?.name || "-"}</TableCell>
                                        <TableCell>{detail?.product_size?.size || "-"}</TableCell>
                                        <TableCell>{r.quantity}</TableCell>
                                        <TableCell>{r.reason}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={r.status || ""}
                                                onChange={e => {
                                                    const newReports = [...currentReports];
                                                    newReports[idx].status = e.target.value;
                                                    setCurrentReports(newReports);
                                                }}
                                                size="small"
                                            >
                                                <MenuItem value="Đã giải quyết">Đã giải quyết</MenuItem>
                                                <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
                                                <MenuItem value="Từ chối">Từ chối</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                value={r.admin_note || ""}
                                                onChange={e => {
                                                    const newReports = [...currentReports];
                                                    newReports[idx].admin_note = e.target.value;
                                                    setCurrentReports(newReports);
                                                }}
                                                size="small"
                                                multiline
                                                rows={2}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setHandleReportDialog(false)}>Hủy</Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            if (!selectedOrder) return;
                            await updateReport(
                                selectedOrder.id,
                                currentReports,
                                orderStatus
                            );
                            setHandleReportDialog(false);
                            setSelectedReport(null);
                            fetchOrders(page);
                        }}
                    >
                        Lưu xử lý
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminOrder;