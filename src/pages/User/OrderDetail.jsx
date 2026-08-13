import React, { useEffect, useState } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { getOrderUserdetail } from "../../services/userService";
import { cancelOrder, reportProduct, deleteReport } from "../../services/orderService";
import {
    Box,
    CircularProgress,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Divider,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    Chip,
    Container
} from "@mui/material";
import Breadcrumb from "../../component/breadcrumb/Breadcrumb";
import { showNotification } from "../../store/notificationSlice";
import { useDispatch } from "react-redux";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ConfirmDeleteDialog from "../../component/dialog/user/ConfirmDeleteDialog";
import ConfirmDialog from "../../component/dialog/user/Confirm";
import {
    Package,
    User,
    Truck,
    AlertTriangle,
    CheckCircle2,
    Clock,
    XCircle,
    ClipboardList,
    Check,
    ArrowLeft,
    MapPin,
    CreditCard,
    Tag,
    ShoppingBag
} from "lucide-react";

// Shopee-style Order Progress Timeline Stepper
const OrderProgressStepper = ({ order }) => {
    const status = order?.status?.toLowerCase() || "";
    const isCancelled = status.includes("đã hủy");
    const isReported = status.includes("báo cáo");

    let currentStep = 0;
    if (status.includes("hoàn thành") || status.includes("đã giao") || isReported) {
        currentStep = 3;
    } else if (status.includes("đang giao") || status.includes("vận chuyển")) {
        currentStep = 2;
    } else if (status.includes("xử lý") || status.includes("chuẩn bị")) {
        currentStep = 1;
    }

    const stepsNormal = [
        {
            title: "Đơn Hàng Đã Đặt",
            time: order.buy_at || "Thời gian đặt",
            icon: <ClipboardList size={20} />
        },
        {
            title: "Đã Xác Nhận",
            time: order.buy_at ? `Đã chuẩn bị hoa` : "Đang chuẩn bị",
            icon: <Package size={20} />
        },
        {
            title: "Đang Giao Hàng",
            time: order.delivery_date ? `${order.delivery_date} (${order.delivery_time_slot || "Trong ngày"})` : "Đang vận chuyển",
            icon: <Truck size={20} />
        },
        {
            title: "Đã Giao Thành Công",
            time: order.delivered_at ? order.delivered_at : "Chờ bàn giao",
            icon: <CheckCircle2 size={20} />
        }
    ];

    const stepsCancelled = [
        {
            title: "Đơn Hàng Đã Đặt",
            time: order.buy_at || "",
            icon: <ClipboardList size={20} />
        },
        {
            title: "Đã Hủy Đơn Hàng",
            time: "Đã hủy bởi người dùng",
            icon: <XCircle size={20} />
        }
    ];

    const steps = isCancelled ? stepsCancelled : stepsNormal;

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                bgcolor: "#fff",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                mb: 3.5
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    position: "relative",
                    px: { xs: 0.5, sm: 4 }
                }}
            >
                {steps.map((step, idx) => {
                    const isCompleted = !isCancelled && idx < currentStep;
                    const isCurrent = isCancelled ? idx === 1 : idx === currentStep;
                    const isFlowing = !isCancelled && idx === currentStep && currentStep < steps.length - 1;

                    let iconBg = "#f1f5f9";
                    let iconColor = "#94a3b8";
                    let titleColor = "#64748b";

                    if (isCancelled && idx === 1) {
                        iconBg = "#ef4444";
                        iconColor = "#ffffff";
                        titleColor = "#ef4444";
                    } else if (isCompleted) {
                        iconBg = "#16a34a";
                        iconColor = "#ffffff";
                        titleColor = "#16a34a";
                    } else if (isCurrent) {
                        iconBg = "#16a34a";
                        iconColor = "#ffffff";
                        titleColor = "#16a34a";
                    }

                    return (
                        <Box
                            key={idx}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textAlign: "center",
                                flex: 1,
                                position: "relative",
                                zIndex: 2
                            }}
                        >
                            {/* Connecting Line */}
                            {idx < steps.length - 1 && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 22,
                                        left: "50%",
                                        width: "100%",
                                        height: 4,
                                        bgcolor: "#e2e8f0",
                                        borderRadius: "2px",
                                        zIndex: -1,
                                        overflow: "hidden"
                                    }}
                                >
                                    {/* Completed green line */}
                                    {isCompleted && (
                                        <Box
                                            sx={{
                                                width: "100%",
                                                height: "100%",
                                                bgcolor: "#16a34a"
                                            }}
                                        />
                                    )}

                                    {/* Animated growing green line towards next step */}
                                    {isFlowing && (
                                        <Box
                                            sx={{
                                                height: "100%",
                                                bgcolor: "#16a34a",
                                                borderRadius: "2px",
                                                boxShadow: "0 0 8px rgba(22, 163, 74, 0.8)",
                                                animation: "fillGreenLine 1.8s infinite linear"
                                            }}
                                        />
                                    )}
                                </Box>
                            )}

                            {/* Node Circle */}
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: "50%",
                                    bgcolor: iconBg,
                                    color: iconColor,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: isCurrent ? "0 0 0 5px rgba(22, 163, 74, 0.18)" : "0 2px 8px rgba(0,0,0,0.06)",
                                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                    transform: isCurrent ? "scale(1.1)" : "scale(1)",
                                    animation: isCurrent ? (isCancelled ? "none" : "activeNodePulse 2s infinite cubic-bezier(0.16, 1, 0.3, 1)") : "none",
                                    mb: 1.2
                                }}
                            >
                                {isCompleted ? <Check size={22} strokeWidth={3} /> : step.icon}
                            </Box>

                            {/* Title */}
                            <Typography
                                variant="subtitle2"
                                fontWeight={isCurrent || isCompleted ? 700 : 500}
                                color={titleColor}
                                sx={{
                                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                    lineHeight: 1.2,
                                    mb: 0.5,
                                    maxWidth: 120
                                }}
                            >
                                {step.title}
                            </Typography>

                            {/* Time subtext */}
                            <Typography
                                variant="caption"
                                color="#94a3b8"
                                sx={{
                                    fontSize: { xs: "0.68rem", sm: "0.75rem" },
                                    maxWidth: 130
                                }}
                            >
                                {step.time}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Paper>
    );
};

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
    const [actionType, setActionType] = useState("Đổi hàng");
    const [viewReportDialog, setViewReportDialog] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    useEffect(() => {
        document.title = "Chi tiết đơn hàng";
        const token = localStorage.getItem("token");
        getOrderUserdetail(token, id)
            .then((res) => setOrder(res.data.data))
            .finally(() => setLoading(false));
    }, [id]);

    const handleCancelOrder = async () => {
        setCanceling(true);
        try {
            await cancelOrder(id);
            dispatch(
                showNotification({
                    message: "Hủy đơn hàng thành công!",
                    severity: "success"
                })
            );
            setOrder((prev) => ({ ...prev, status: "đã hủy" }));
            setIsConfirmDialogOpen(false);
        } catch (e) {
            dispatch(
                showNotification({
                    message: e.response?.data?.message || "Hủy đơn hàng thất bại!",
                    severity: "error"
                })
            );
        }
        setCanceling(false);
    };

    const handleOpenConfirmDialog = () => {
        setIsConfirmDialogOpen(true);
    };

    const openReportDialog = () => {
        setSelectedReports(
            order.order_details.map((d) => {
                const reported = order.product_reports?.find((r) => r.order_detail_id === d.id);

                return {
                    order_detail_id: d.id,
                    checked: !!reported,
                    quantity: reported ? reported.quantity : 1,
                    reason: reported ? reported.reason : "",
                    action: reported ? reported.action : "Đổi hàng",
                    image: null,
                    image_url: reported ? reported.image_url : null
                };
            })
        );
        setReportDialog(true);
    };

    const handleCheck = (id, checked) => {
        setSelectedReports((reports) => reports.map((r) => (r.order_detail_id === id ? { ...r, checked } : r)));
    };

    const handleChange = (id, field, value) => {
        setSelectedReports((reports) => reports.map((r) => (r.order_detail_id === id ? { ...r, [field]: value } : r)));
    };

    const handleSendReport = async () => {
        const reportsToSend = selectedReports
            .filter((r) => r.checked)
            .map((r) => ({
                order_id: order.id,
                order_detail_id: r.order_detail_id,
                quantity: r.quantity,
                reason: r.reason,
                action: actionType,
                image: r.image
            }));
        if (reportsToSend.length === 0) {
            dispatch(showNotification({ message: "Vui lòng chọn ít nhất 1 sản phẩm!", severity: "warning" }));
            return;
        }
        if (reportsToSend.some((r) => !r.reason.trim())) {
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
                formData.append(`reports[${idx}][action]`, r.action);
                if (r.image) {
                    formData.append(`reports[${idx}][image]`, r.image);
                }
            });
            await reportProduct(formData);
            dispatch(showNotification({ message: "Gửi báo cáo thành công!", severity: "success" }));
            setReportDialog(false);
            getOrderUserdetail(localStorage.getItem("token"), id).then((res) => setOrder(res.data.data));
        } catch (e) {
            console.error("Gửi báo cáo thất bại:", e);
            dispatch(
                showNotification({
                    message: e.response?.data?.message || "Gửi báo cáo thất bại!",
                    severity: "error"
                })
            );
        }
        setReporting(false);
    };

    const handleDelete = async () => {
        setConfirmDeleteId(id);
    };

    const handleConfirmDeleteReport = async () => {
        try {
            await deleteReport(id);
            dispatch(showNotification({ message: "Hủy báo cáo thành công!", severity: "success" }));
            getOrderUserdetail(localStorage.getItem("token"), id).then((res) => setOrder(res.data.data));
            setConfirmDeleteId(null);
        } catch (e) {
            console.error("Hủy báo cáo thất bại:", e);
            dispatch(showNotification({ message: e.response?.data?.message || "Hủy báo cáo thất bại!", severity: "error" }));
        }
    };

    const handleCancelDelete = () => setConfirmDeleteId(null);

    const handleViewReport = () => {
        if (order.product_reports && order.product_reports.length > 0) {
            setViewReportDialog(true);
        } else {
            dispatch(showNotification({ message: "Không có báo cáo nào cho đơn hàng này!", severity: "info" }));
        }
    };

    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress color="success" />
            </Box>
        );

    if (!order) return <Typography color="text.secondary">Không tìm thấy đơn hàng.</Typography>;

    const isReportDisabled = (() => {
        if (!order?.delivered_at) return true;
        const deliveredAt = new Date(order.delivered_at);
        const now = new Date();
        const diffMs = now - deliveredAt;
        const diffHours = diffMs / (1000 * 60 * 60);
        return diffHours > 24;
    })();

    const getStatusChip = (status) => {
        const lower = status?.toLowerCase() || "";
        if (lower.includes("hoàn thành")) {
            return <Chip icon={<CheckCircle2 size={16} />} label="HOÀN THÀNH" color="success" sx={{ fontWeight: 800, borderRadius: "8px" }} />;
        }
        if (lower.includes("đã hủy")) {
            return <Chip icon={<XCircle size={16} />} label="ĐÃ HỦY" color="error" sx={{ fontWeight: 800, borderRadius: "8px" }} />;
        }
        if (lower.includes("báo cáo")) {
            return <Chip icon={<AlertTriangle size={16} />} label="BÁO CÁO" color="warning" sx={{ fontWeight: 800, borderRadius: "8px" }} />;
        }
        return <Chip icon={<Clock size={16} />} label={status?.toUpperCase()} color="primary" sx={{ fontWeight: 800, borderRadius: "8px" }} />;
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3, mb: 5 }}>
            <Breadcrumb
                items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Lịch sử đơn hàng", href: "/orders/history" },
                    { label: `Đơn hàng #${order.order_code}` }
                ]}
            />

            {/* Top Bar: Back Link, Order Code, Status, Actions */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    bgcolor: "#fff",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                    mb: 3,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 2
                }}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <Button
                        component={Link}
                        to="/orders/history"
                        startIcon={<ArrowLeft size={18} />}
                        sx={{
                            color: "#64748b",
                            fontWeight: 700,
                            textTransform: "none",
                            borderRadius: "10px",
                            "&:hover": { bgcolor: "#f1f5f9", color: "#16a34a" }
                        }}
                    >
                        Quay lại
                    </Button>
                    <Divider orientation="vertical" flexItem sx={{ height: 24, my: "auto" }} />
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Typography variant="h6" color="#1e293b">
                            MÃ ĐƠN HÀNG: #{order.order_code}
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                    {getStatusChip(order.status)}

                    {order.status === "đang xử lý" && (
                        <Button
                            variant="outlined"
                            color="error"
                            disableElevation
                            onClick={handleOpenConfirmDialog}
                            disabled={canceling}
                            sx={{ borderRadius: "10px", fontWeight: 700, textTransform: "none" }}
                        >
                            {canceling ? "Đang hủy..." : "Hủy đơn hàng"}
                        </Button>
                    )}

                    {order.status === "hoàn thành" && (
                        <Button
                            variant="contained"
                            color="error"
                            disableElevation
                            onClick={openReportDialog}
                            disabled={isReportDisabled}
                            startIcon={<AlertTriangle size={16} />}
                            sx={{ borderRadius: "10px", fontWeight: 700, textTransform: "none" }}
                        >
                            Báo cáo sản phẩm lỗi
                        </Button>
                    )}

                    {order.status === "Báo Cáo" && (
                        <Button
                            variant="contained"
                            disableElevation
                            onClick={handleViewReport}
                            sx={{ borderRadius: "10px", fontWeight: 700, textTransform: "none", bgcolor: "#16a34a", "&:hover": { bgcolor: "#15803d" } }}
                        >
                            Xem báo cáo
                        </Button>
                    )}

                    {order.product_reports?.[0]?.status === "Đang xử lý" && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleDelete}
                            sx={{ borderRadius: "10px", fontWeight: 700, textTransform: "none" }}
                        >
                            Hủy báo cáo
                        </Button>
                    )}
                </Box>
            </Paper>

            {/* Shopee Style Stepper Timeline */}
            <OrderProgressStepper order={order} />

            {/* Modern 2-Column Main Content Layout */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", lg: "row" },
                    gap: 3.5,
                    alignItems: "flex-start"
                }}
            >
                {/* LEFT COLUMN: Purchased Products List */}
                <Box sx={{ flex: 1, width: "100%" }}>
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: "16px",
                            border: "1px solid #e2e8f0",
                            bgcolor: "#fff",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                            overflow: "hidden"
                        }}
                    >
                        <Box p={{ xs: 2, sm: 3 }}>
                            <Typography variant="h6" fontWeight={700} color="#1e293b" mb={2.5} display="flex" alignItems="center" gap={1}>
                                <ShoppingBag size={20} color="#16a34a" /> Danh sách sản phẩm ({order.order_details?.length || 0})
                            </Typography>

                            <TableContainer sx={{ border: "1px solid #f1f5f9", borderRadius: "12px" }}>
                                <Table sx={{ minWidth: 550 }}>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: "#f8fafc" }}>
                                            <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Sản phẩm</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Size</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Số lượng</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: "#475569", py: 1.8 }}>Thành tiền</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {order.order_details.map((detail) => (
                                            <TableRow key={detail.id} sx={{ "&:hover": { bgcolor: "#f8fafc" } }}>
                                                <TableCell sx={{ py: 2 }}>
                                                    <Box display="flex" alignItems="center" gap={2}>
                                                        {detail.product_size?.product?.image_url ? (
                                                            <Box
                                                                component="img"
                                                                src={detail.product_size.product.image_url}
                                                                alt={detail.product_size.product.name}
                                                                sx={{
                                                                    width: 64,
                                                                    height: 64,
                                                                    objectFit: "cover",
                                                                    borderRadius: "12px",
                                                                    border: "1px solid #f1f5f9",
                                                                    bgcolor: "#f8fafc"
                                                                }}
                                                            />
                                                        ) : (
                                                            <Box
                                                                sx={{
                                                                    width: 64,
                                                                    height: 64,
                                                                    bgcolor: "#f1f5f9",
                                                                    borderRadius: "12px",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    color: "#94a3b8",
                                                                    fontSize: "0.75rem"
                                                                }}
                                                            >
                                                                No Image
                                                            </Box>
                                                        )}
                                                        <Typography variant="subtitle2" fontWeight={700} color="#1e293b">
                                                            {detail.product_size?.product?.name}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={detail.product_size?.size || "Tiêu chuẩn"}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ fontWeight: 600, borderColor: "#cbd5e1" }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={700} color="#334155">
                                                        x{detail.quantity}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="subtitle2" fontWeight={700} color="#16a34a">
                                                        {Number(detail.subtotal).toLocaleString()}đ
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Paper>
                </Box>

                {/* RIGHT COLUMN: Sticky Recipient & Financial Summary Side Panel */}
                <Box
                    sx={{
                        width: { xs: "100%", lg: 380 },
                        flexShrink: 0,
                        position: { lg: "sticky" },
                        top: { lg: 90 },
                        display: "flex",
                        flexDirection: "column",
                        gap: 3
                    }}
                >
                    {/* Recipient Information Card */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: "16px",
                            border: "1px solid #e2e8f0",
                            bgcolor: "#fff",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)"
                        }}
                    >
                        <Typography variant="h6" fontWeight={700} color="#1e293b" mb={2} display="flex" alignItems="center" gap={1}>
                            <MapPin size={20} color="#16a34a" /> ĐỊA CHỈ NHẬN HÀNG
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Box display="flex" flexDirection="column" gap={1.2}>
                            <Typography variant="subtitle2" fontWeight={700} color="#1e293b">
                                {order.name} ({order.phone})
                            </Typography>
                            <Typography variant="body2" color="#64748b">
                                {order.email}
                            </Typography>
                            <Typography variant="body2" color="#334155" mt={0.5} lineHeight={1.4}>
                                {order.address}
                            </Typography>

                            {order.note && (
                                <Box sx={{ p: 1.5, bgcolor: "#f8fafc", borderRadius: "10px", border: "1px dashed #cbd5e1", mt: 1 }}>
                                    <Typography variant="caption" color="#64748b" display="block" fontWeight={700}>
                                        Ghi chú của bạn:
                                    </Typography>
                                    <Typography variant="body2" color="#334155" fontSize="0.85rem">
                                        {order.note}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Paper>

                    {/* Payment & Financial Summary Card */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: "16px",
                            border: "1px solid #e2e8f0",
                            bgcolor: "#fff",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)"
                        }}
                    >
                        <Typography variant="h6" fontWeight={700} color="#1e293b" mb={2} display="flex" alignItems="center" gap={1}>
                            <CreditCard size={20} color="#16a34a" /> TÓM TẮT THANH TOÁN
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Box display="flex" flexDirection="column" gap={1.5}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="#64748b">Hình thức thanh toán:</Typography>
                                <Typography variant="body2" fontWeight={600} color="#1e293b">{order.payment_method}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="#64748b">Phương thức vận chuyển:</Typography>
                                <Chip
                                    label={order.is_express ? "Hỏa tốc 2H" : "Tiêu chuẩn"}
                                    size="small"
                                    color={order.is_express ? "warning" : "default"}
                                    sx={{ fontWeight: 700, height: 20 }}
                                />
                            </Box>
                            {order.discount && (
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2" color="#64748b" display="flex" alignItems="center" gap={0.5}>
                                        <Tag size={14} color="#16a34a" /> Mã giảm giá:
                                    </Typography>
                                    <Typography variant="body2" fontWeight={700} color="#16a34a">
                                        -{order.discount.type === "fixed" ? `${Number(order.discount.value).toLocaleString()}đ` : `${order.discount.value}%`}
                                    </Typography>
                                </Box>
                            )}

                            <Divider sx={{ my: 1 }} />

                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" fontWeight={700} color="#1e293b">
                                    Thành tiền:
                                </Typography>
                                <Typography variant="h5" fontWeight={800} color="#16a34a">
                                    {Number(order.total_price).toLocaleString()}đ
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>

            {/* Dialog Báo cáo lỗi */}
            <Dialog
                open={reportDialog}
                onClose={() => setReportDialog(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: "16px", minWidth: { md: 900 }, p: 1 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: "#1e293b" }}>Báo cáo sản phẩm lỗi / không vừa ý</DialogTitle>
                <DialogContent>
                    <Box mb={2.5} display="flex" alignItems="center" gap={1}>
                        <Typography fontWeight={700} color="#475569">
                            Hình thức yêu cầu xử lý:
                        </Typography>
                        <Select
                            value={actionType}
                            onChange={(e) => setActionType(e.target.value)}
                            size="small"
                            sx={{ minWidth: 180, borderRadius: "8px" }}
                        >
                            <MenuItem value="Đổi hàng">Đổi hàng mới</MenuItem>
                            <MenuItem value="Mã giảm giá">Nhận Voucher đền bù</MenuItem>
                        </Select>
                    </Box>
                    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                                    <TableCell sx={{ width: 40 }}></TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Sản phẩm</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Size</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>SL mua</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>SL lỗi</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Lý do chi tiết</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Ảnh đính kèm</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order.order_details.map((detail) => {
                                    const r = selectedReports.find((x) => x.order_detail_id === detail.id) || {};
                                    return (
                                        <TableRow key={detail.id}>
                                            <TableCell>
                                                <Checkbox checked={!!r.checked} onChange={(e) => handleCheck(detail.id, e.target.checked)} />
                                            </TableCell>
                                            <TableCell fontWeight={600}>{detail.product_size?.product?.name}</TableCell>
                                            <TableCell>{detail.product_size?.size}</TableCell>
                                            <TableCell>{detail.quantity}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={r.quantity || 1}
                                                    onChange={(e) => {
                                                        let val = Number(e.target.value);
                                                        if (val < 1) val = 1;
                                                        if (val > detail.quantity) val = detail.quantity;
                                                        handleChange(detail.id, "quantity", val);
                                                    }}
                                                    inputProps={{ min: 1, max: detail.quantity }}
                                                    disabled={!r.checked}
                                                    sx={{ width: 65 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={r.reason || ""}
                                                    onChange={(e) => handleChange(detail.id, "reason", e.target.value)}
                                                    disabled={!r.checked}
                                                    placeholder="Ghi rõ tình trạng sản phẩm..."
                                                    rows={2}
                                                    fullWidth
                                                    multiline
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton component="label" color="primary" disabled={!r.checked}>
                                                    <PhotoCamera />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        hidden
                                                        onChange={(e) => handleChange(detail.id, "image", e.target.files[0])}
                                                    />
                                                </IconButton>
                                                {r.image && (
                                                    <Box mt={0.5}>
                                                        <img
                                                            src={URL.createObjectURL(r.image)}
                                                            alt="Ảnh báo cáo"
                                                            style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6 }}
                                                        />
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
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setReportDialog(false)} sx={{ color: "#64748b" }}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSendReport}
                        variant="contained"
                        color="error"
                        disableElevation
                        disabled={reporting}
                        sx={{ borderRadius: "10px", px: 3, fontWeight: 700 }}
                    >
                        {reporting ? <CircularProgress size={24} /> : "Gửi báo cáo"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Xem Báo Cáo */}
            <Dialog
                open={viewReportDialog}
                onClose={() => setViewReportDialog(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: "16px", p: 1 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800 }}>Lịch sử báo cáo sản phẩm</DialogTitle>
                <DialogContent>
                    {order.product_reports && order.product_reports.length > 0 ? (
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                                    <TableCell sx={{ fontWeight: 700 }}>Sản phẩm</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Size</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>SL lỗi</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Lý do</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Phản hồi Admin</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order.product_reports.map((report) => {
                                    const detail = order.order_details.find((d) => d.id === report.order_detail_id);
                                    return (
                                        <TableRow key={report.id}>
                                            <TableCell>{detail?.product_size?.product?.name || "-"}</TableCell>
                                            <TableCell>{detail?.product_size?.size || "-"}</TableCell>
                                            <TableCell>{report.quantity}</TableCell>
                                            <TableCell>{report.reason}</TableCell>
                                            <TableCell>
                                                <Chip label={report.status} color="warning" size="small" sx={{ fontWeight: 700 }} />
                                            </TableCell>
                                            <TableCell>{report.admin_note || <span style={{ color: "#94a3b8" }}>Chưa có phản hồi</span>}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                        <Typography color="text.secondary">Không có báo cáo nào cho đơn hàng này.</Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setViewReportDialog(false)} variant="outlined" sx={{ borderRadius: "8px" }}>
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDeleteDialog
                open={!!confirmDeleteId}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDeleteReport}
                content="Bạn chắc chắn muốn hủy báo cáo này?"
            />
            <ConfirmDialog
                open={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={handleCancelOrder}
                title="Xác nhận hủy đơn hàng"
                content="Bạn có chắc chắn muốn hủy đơn hàng này?"
                loading={canceling}
            />
        </Container>
    );
};

export default OrderDetail;