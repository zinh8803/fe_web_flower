import React, { useEffect, useState } from "react";
import { getOrderHistory } from "../../services/userService";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Pagination,
    CircularProgress,
    Chip,
    Container
} from "@mui/material";
import { Link } from "react-router-dom";
import Breadcrumb from "../../component/breadcrumb/Breadcrumb";
import { Package, ArrowRight, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        document.title = "Lịch sử đơn hàng";
        const token = localStorage.getItem("token");
        setLoading(true);
        getOrderHistory(token, page)
            .then((res) => {
                setOrders(res.data.data || []);
                setTotalPages(res.data.meta.last_page || 1);
            })
            .finally(() => setLoading(false));
    }, [page]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const getStatusChip = (status) => {
        const lower = status?.toLowerCase() || "";
        if (lower.includes("hoàn thành")) {
            return <Chip icon={<CheckCircle2 size={15} />} label="Hoàn thành" color="success" size="small" sx={{ fontWeight: 700 }} />;
        }
        if (lower.includes("đã hủy")) {
            return <Chip icon={<XCircle size={15} />} label="Đã hủy" color="error" size="small" sx={{ fontWeight: 700 }} />;
        }
        if (lower.includes("báo cáo")) {
            return <Chip icon={<AlertTriangle size={15} />} label="Báo cáo" color="warning" size="small" sx={{ fontWeight: 700 }} />;
        }
        return <Chip icon={<Clock size={15} />} label={status} color="primary" size="small" sx={{ fontWeight: 700 }} />;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress color="success" />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3, mb: 5 }}>
            <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Lịch sử đơn hàng" }]} />

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    bgcolor: "#fff",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 2
                }}
            >
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        bgcolor: "rgba(22, 163, 74, 0.1)",
                        color: "#16a34a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Package size={24} />
                </Box>
                <Box>
                    <Typography variant="h5" color="#1e293b">
                        Lịch sử đơn hàng của bạn
                    </Typography>
                    <Typography variant="body2" color="#64748b">
                        Quản lý và theo dõi trạng thái các đơn hàng đã đặt
                    </Typography>
                </Box>
            </Paper>

            {orders.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        textAlign: "center",
                        borderRadius: "16px",
                        border: "1px solid #e2e8f0",
                        bgcolor: "#fff"
                    }}
                >
                    <Typography color="text.secondary" variant="h6">
                        Bạn chưa có đơn hàng nào.
                    </Typography>
                    <Button component={Link} to="/" variant="contained" disableElevation color="success" sx={{ mt: 2, borderRadius: "10px", fontWeight: 700 }}>
                        Mua sắm ngay
                    </Button>
                </Paper>
            ) : (
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
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                                    <TableCell sx={{ fontWeight: 700, color: "#475569", py: 2 }}>Mã đơn hàng</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: "#475569", py: 2 }}>Ngày mua</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: "#475569", py: 2 }}>Trạng thái</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: "#475569", py: 2 }}>Tổng tiền</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: "#475569", py: 2 }} align="right">
                                        Thao tác
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id} sx={{ "&:hover": { bgcolor: "#f8fafc" }, transition: "background-color 0.2s" }}>
                                        <TableCell sx={{ py: 2 }}>
                                            <Typography variant="subtitle2" fontWeight={700} color="#1e293b">
                                                #{order.order_code}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="#64748b">
                                                {order.buy_at}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{getStatusChip(order.status)}</TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight={700} color="#16a34a">
                                                {Number(order.total_price).toLocaleString()}đ
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                component={Link}
                                                to={`/order/${order.id}`}
                                                variant="outlined"
                                                size="small"
                                                endIcon={<ArrowRight size={16} />}
                                                sx={{
                                                    borderRadius: "8px",
                                                    fontWeight: 700,
                                                    textTransform: "none",
                                                    borderColor: "#cbd5e1",
                                                    color: "#334155",
                                                    "&:hover": { borderColor: "#16a34a", color: "#16a34a", bgcolor: "rgba(22, 163, 74, 0.06)" }
                                                }}
                                            >
                                                Xem chi tiết
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {totalPages > 1 && (
                        <Box display="flex" justifyContent="center" p={3}>
                            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="success" />
                        </Box>
                    )}
                </Paper>
            )}
        </Container>
    );
};

export default OrderHistory;