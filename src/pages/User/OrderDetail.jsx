import React, { useEffect, useState } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { useParams } from "react-router-dom";
import { getOrderUserdetail } from "../../services/userService";
import { cancelOrder, reportProduct, deleteReport } from "../../services/orderService";
import {
    Box, CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from "@mui/material";
import Breadcrumb from "../../component/breadcrumb/Breadcrumb";
import { showNotification } from "../../store/notificationSlice";
import { useDispatch } from "react-redux";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ConfirmDeleteDialog from "../../component/dialog/user/ConfirmDeleteDialog";

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const [canceling, setCanceling] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [reportDialog, setReportDialog] = useState(false);
    const [reporting, setReporting] = useState(false);
    const [selectedReports, setSelectedReports] = useState([]);

    const [viewReportDialog, setViewReportDialog] = useState(false);
    const [viewReport, setViewReport] = useState(null);

    useEffect(() => {
        document.title = 'Chi tiết đơn hàng';
        const token = localStorage.getItem("token");
        getOrderUserdetail(token, id)
            .then(res => setOrder(res.data.data))
            .finally(() => setLoading(false));
    }, [id]);

    const handleCancelOrder = async () => {
        setCanceling(true);
        try {
            await cancelOrder(id);
            dispatch(showNotification({
                message: "Hủy đơn hàng thành công!",
                severity: "success"
            }));
            setOrder(prev => ({ ...prev, status: "đã hủy" }));
        } catch (e) {
            dispatch(showNotification({
                message: e.response?.data?.message || "Hủy đơn hàng thất bại!",
                severity: "error"
            }));
        }
        setCanceling(false);
    };

    const openReportDialog = () => {
        setSelectedReports(order.order_details.map(d => {
            const reported = order.product_reports?.find(r => r.order_detail_id === d.id);
            return {
                order_detail_id: d.id,
                checked: !!reported,
                quantity: reported ? reported.quantity : 1,
                reason: reported ? reported.reason : "",
                image: null,
                image_url: reported ? reported.image_url : null
            };
        }));
        setReportDialog(true);
    };

    const handleCheck = (id, checked) => {
        setSelectedReports(reports =>
            reports.map(r => r.order_detail_id === id ? { ...r, checked } : r)
        );
    };

    const handleChange = (id, field, value) => {
        setSelectedReports(reports =>
            reports.map(r => r.order_detail_id === id ? { ...r, [field]: value } : r)
        );
    };

    const handleSendReport = async () => {
        const reportsToSend = selectedReports
            .filter(r => r.checked)
            .map(r => ({
                order_id: order.id,
                order_detail_id: r.order_detail_id,
                quantity: r.quantity,
                reason: r.reason,
                image: r.image
            }));
        if (reportsToSend.length === 0) {
            dispatch(showNotification({ message: "Vui lòng chọn ít nhất 1 sản phẩm!", severity: "warning" }));
            return;
        }
        if (reportsToSend.some(r => !r.reason.trim())) {
            dispatch(showNotification({ message: "Vui lòng nhập lý do cho tất cả sản phẩm đã chọn!", severity: "warning" }));
            return;
        }
        setReporting(true);
        try {
            let formData = new FormData();
            formData.append("user_id", order.user_id);
            reportsToSend.forEach((r, idx) => {
                formData.append(`reports[${idx}][order_id]`, order.id);
                formData.append(`reports[${idx}][order_detail_id]`, r.order_detail_id);
                formData.append(`reports[${idx}][quantity]`, r.quantity);
                formData.append(`reports[${idx}][reason]`, r.reason);
                if (r.image) {
                    formData.append(`reports[${idx}][image]`, r.image);
                }
            });
            await reportProduct(formData);
            dispatch(showNotification({ message: "Gửi báo cáo thành công!", severity: "success" }));
            setReportDialog(false);
            getOrderUserdetail(localStorage.getItem("token"), id)
                .then(res => setOrder(res.data.data));
        } catch (e) {
            dispatch(showNotification({
                message: e.response?.data?.message || "Gửi báo cáo thất bại!",
                severity: "error"
            }));
        }
        setReporting(false);
    };
    const handleDelete = async (id) => {
        setConfirmDeleteId(id);
    };
    const handleConfirmDeleteReport = async () => {
        try {
            await deleteReport(id);
            dispatch(showNotification({ message: "Hủy cáo thành công!", severity: "success" }));
            // setOrder(prev => ({
            //     ...prev,
            //     product_reports: prev.product_reports.filter(r => r.id !== id)
            // }));
            getOrderUserdetail(localStorage.getItem("token"), id)
                .then(res => setOrder(res.data.data));
            setConfirmDeleteId(null);
        } catch (e) {
            console.error("Hủy báo cáo thất bại:", e);
            dispatch(showNotification({ message: e.response?.data?.message || "Hủy báo cáo thất bại!", severity: "error" }));
        }
    };
    const handleCancelDelete = () => setConfirmDeleteId(null);

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
        </Box>);
    if (!order) return <Typography>Không tìm thấy đơn hàng.</Typography>;

    return (
        <Box maxWidth="1450px" mx="auto" mt={4}>
            <Breadcrumb
                items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Lịch sử đơn hàng", href: "/orders/history" },
                    { label: "Chi tiết đơn hàng" }
                ]}
            />
            <Typography variant="h5" fontWeight={700} mb={2}>
                Chi tiết đơn hàng #{order.order_code}
            </Typography>
            {/* Nút hủy đơn hàng */}
            {order.status === "đang xử lý" && (
                <Box mb={2}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleCancelOrder}
                        disabled={canceling}
                    >
                        {canceling ? "Đang hủy..." : "Hủy đơn hàng"}
                    </Button>
                </Box>
            )}
            <Box mb={2} display="flex" flexWrap="wrap" gap={4}>
                <Box flex={1} minWidth={280}>
                    <Typography><b>Khách hàng:</b> {order.name}</Typography>
                    <Typography><b>Email:</b> {order.email}</Typography>
                    <Typography><b>Điện thoại:</b> {order.phone}</Typography>
                    <Typography><b>Địa chỉ:</b> {order.address}</Typography>
                    <Typography><b>Ghi chú:</b> {order.note}</Typography>
                    <Typography><b>Trạng thái:</b> {order.status}</Typography>
                </Box>
                <Box flex={1} minWidth={280}>
                    <Typography><b>Ngày mua:</b> {order.buy_at}</Typography>
                    <Typography><b>Phương thức thanh toán:</b> {order.payment_method}</Typography>
                    <Typography>
                        <b>Mã giảm giá:</b> {order.discount ? order.discount.name : "Không có"}
                        {order.discount && (
                            <>
                                <br />
                                <b>Giá trị mã giảm giá:</b>{" "}
                                {order.discount.type === "fixed"
                                    ? `${Number(order.discount.value).toLocaleString()}đ`
                                    : order.discount.type === "percent"
                                        ? `${order.discount.value}%`
                                        : "0đ"}
                            </>
                        )}
                    </Typography>
                    <Typography>
                        <b>Tổng tiền:</b>{" "}
                        <span style={{ color: "red", fontWeight: 700 }}>
                            {Number(order.total_price).toLocaleString()}đ
                        </span>
                    </Typography>
                </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" fontWeight={700} mb={2}>
                Sản phẩm trong đơn hàng
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Hình ảnh</TableCell>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell>Kích thước</TableCell>
                            <TableCell>Số lượng</TableCell>
                            <TableCell>Thành tiền</TableCell>
                            <TableCell>Xem báo cáo</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {order.order_details.map(detail => {
                            const reported = order.product_reports?.find(r => r.order_detail_id === detail.id);
                            return (
                                <TableRow key={detail.id}>
                                    <TableCell>
                                        {detail.product_size.product?.image_url ? (
                                            <img
                                                src={detail.product_size.product.image_url}
                                                alt={detail.product_size.product.name}
                                                style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }}
                                            />
                                        ) : (
                                            <span style={{ color: "#ccc" }}>Không có ảnh</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{detail.product_size.product?.name}</TableCell>
                                    <TableCell>
                                        {detail.product_size?.size ? detail.product_size.size : ""}
                                    </TableCell>
                                    <TableCell>{detail.quantity}</TableCell>
                                    <TableCell>
                                        <span style={{ color: "red", fontWeight: 700 }}>
                                            {Number(detail.subtotal).toLocaleString()}đ
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {reported ? (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<VisibilityIcon />}
                                                onClick={() => {
                                                    setViewReport(reported);
                                                    setViewReportDialog(true);
                                                }}
                                            >
                                                Xem báo cáo
                                            </Button>
                                        ) : <>Không có</>}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Nút mở popup báo cáo lỗi */}
            <Box mt={2}>
                <Button
                    variant="contained"
                    color="error"
                    onClick={openReportDialog}
                >
                    Báo cáo sản phẩm lỗi
                </Button>
                {order.status === "đang xử lý báo cáo" && (<Button sx={{ ml: 2 }}
                    variant="contained"
                    onClick={handleDelete}
                >
                    Hủy báo cáo
                </Button>)}
            </Box>

            {/* Dialog báo cáo lỗi nhiều sản phẩm */}
            <Dialog open={reportDialog} onClose={() => setReportDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Báo cáo sản phẩm lỗi</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>Sản phẩm</TableCell>
                                    <TableCell>Kích thước</TableCell>
                                    <TableCell>Số lượng mua</TableCell>
                                    <TableCell>Số lượng lỗi</TableCell>
                                    <TableCell>Lý do</TableCell>
                                    <TableCell>Ảnh</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order.order_details.map(detail => {
                                    const r = selectedReports.find(x => x.order_detail_id === detail.id) || {};
                                    return (
                                        <TableRow key={detail.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={!!r.checked}
                                                    onChange={e => handleCheck(detail.id, e.target.checked)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {detail.product_size.product?.name}
                                            </TableCell>
                                            <TableCell>
                                                {detail.product_size?.size}
                                            </TableCell>
                                            <TableCell>
                                                {detail.quantity}
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={r.quantity || 1}
                                                    onChange={e => {
                                                        let val = Number(e.target.value);
                                                        if (val < 1) val = 1;
                                                        if (val > detail.quantity) val = detail.quantity;
                                                        handleChange(detail.id, "quantity", val);
                                                    }}
                                                    inputProps={{ min: 1, max: detail.quantity }}
                                                    disabled={!r.checked}
                                                    sx={{ width: 70 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField

                                                    value={r.reason || ""}
                                                    onChange={e => handleChange(detail.id, "reason", e.target.value)}
                                                    disabled={!r.checked}
                                                    placeholder="Nhập lý do"
                                                    rows={4}
                                                    fullWidth
                                                    multiline
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    component="label"
                                                    disabled={!r.checked}
                                                >
                                                    <PhotoCamera />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        hidden
                                                        onChange={e => handleChange(detail.id, "image", e.target.files[0])}
                                                    />
                                                </IconButton>
                                                {r.image && (
                                                    <Box mt={1}>
                                                        <img
                                                            src={URL.createObjectURL(r.image)}
                                                            alt="Ảnh báo cáo"
                                                            style={{ maxWidth: 80, maxHeight: 80, borderRadius: 6, display: "block" }}
                                                        />
                                                        <Typography variant="caption">{r.image.name}</Typography>
                                                    </Box>
                                                )}
                                                {!r.image && r.image_url && (
                                                    <Box mt={1}>
                                                        <img
                                                            src={r.image_url}
                                                            alt="Ảnh báo cáo"
                                                            style={{ maxWidth: 80, maxHeight: 80, borderRadius: 6, display: "block" }}
                                                        />
                                                        <Typography variant="caption">Ảnh đã báo cáo</Typography>
                                                    </Box>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReportDialog(false)}>Hủy</Button>
                    <Button
                        onClick={handleSendReport}
                        variant="contained"
                        color="error"
                        disabled={reporting}
                    >
                        {reporting ? "Đang gửi..." : "Gửi báo cáo"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog xem báo cáo */}
            <Dialog
                open={viewReportDialog}
                onClose={() => setViewReportDialog(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { minWidth: 500, minHeight: 350 }
                }}
            >
                <DialogTitle>Chi tiết báo cáo sản phẩm</DialogTitle>
                <DialogContent sx={{ minHeight: 200 }}>
                    {viewReport ? (
                        <>
                            <Typography><b>Lý do:</b> {viewReport.reason}</Typography>
                            <Typography><b>Số lượng lỗi:</b> {viewReport.quantity}</Typography>
                            <Typography><b>Trạng thái:</b> {viewReport.status}</Typography>
                            {viewReport.image_url && (
                                <Box mt={2} display="flex" justifyContent="center">
                                    <img
                                        src={viewReport.image_url}
                                        alt="Ảnh báo cáo"
                                        style={{ maxWidth: 300, borderRadius: 8 }}
                                    />
                                </Box>
                            )}
                        </>
                    ) : (
                        <Typography>Không có dữ liệu báo cáo.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewReportDialog(false)}>Đóng</Button>
                </DialogActions>
            </Dialog>
            <ConfirmDeleteDialog
                open={!!confirmDeleteId}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDeleteReport}
                content="Bạn chắc chắn muốn xóa danh mục này?"
            />
        </Box>
    );
};

export default OrderDetail;