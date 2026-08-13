import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Pagination,
    CircularProgress,
    TextField,
    MenuItem,
    Button,
    Grid,
    IconButton,
    Tooltip
} from "@mui/material";
import { getFlowerLogs } from "../../services/flowerService";
import { getFlower } from "../../services/flowerService";
import { History, FilterX, ArrowUpRight, ArrowDownRight, RefreshCw, Calendar, User, FileText } from "lucide-react";
import { showNotification } from "../../store/notificationSlice";
import { useDispatch } from "react-redux";

const AdminFlowerLog = () => {
    const dispatch = useDispatch();
    const [logs, setLogs] = useState([]);
    const [flowers, setFlowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Filter states
    const [selectedFlower, setSelectedFlower] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedChangeType, setSelectedChangeType] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    useEffect(() => {
        document.title = "Quản lý log biến động hoa";
        fetchFlowers();
    }, []);

    useEffect(() => {
        fetchLogs(page);
    }, [page, selectedFlower, selectedType, selectedChangeType, fromDate, toDate]);

    const fetchFlowers = async () => {
        try {
            const res = await getFlower();
            setFlowers(res.data?.data || res.data || []);
        } catch (error) {
            console.error("Error fetching flowers:", error);
        }
    };

    const fetchLogs = async (pageNumber = 1) => {
        setLoading(true);
        try {
            const params = {
                page: pageNumber,
                per_page: 15
            };
            if (selectedFlower) params.flower_id = selectedFlower;
            if (selectedType) params.type = selectedType;
            if (selectedChangeType) params.change_type = selectedChangeType;
            if (fromDate) params.from_date = fromDate;
            if (toDate) params.to_date = toDate;

            const res = await getFlowerLogs(params);

            const logsData = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
            setLogs(logsData);

            const lastPage = res.data?.meta?.last_page || res.data?.last_page || 1;
            const total = res.data?.meta?.total || res.data?.total || logsData.length;

            setTotalPages(lastPage);
            setTotalCount(total);
        } catch (error) {
            console.error("Error fetching flower logs:", error);
            dispatch(showNotification({ message: "Lỗi khi tải nhật ký tồn kho hoa", severity: "error" }));
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setSelectedFlower("");
        setSelectedType("");
        setSelectedChangeType("");
        setFromDate("");
        setToDate("");
        setPage(1);
    };

    const getTypeChip = (type) => {
        switch (type?.toLowerCase()) {
            case "import":
                return <Chip label="Nhập hàng" size="small" sx={{ bgcolor: "#dcfce7", color: "#15803d", fontWeight: 700 }} />;
            case "sale":
                return <Chip label="Bán hàng" size="small" sx={{ bgcolor: "#e0f2fe", color: "#0369a1", fontWeight: 700 }} />;
            case "cancel":
                return <Chip label="Hủy đơn" size="small" sx={{ bgcolor: "#fee2e2", color: "#b91c1c", fontWeight: 700 }} />;
            case "adjustment":
                return <Chip label="Điều chỉnh" size="small" sx={{ bgcolor: "#fef3c7", color: "#b45309", fontWeight: 700 }} />;
            default:
                return <Chip label={type || "Khác"} size="small" sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 700 }} />;
        }
    };

    const getChangeTypeBadge = (changeType, qty) => {
        if (changeType === "plus") {
            return (
                <Chip
                    icon={<ArrowUpRight size={14} color="#16a34a" />}
                    label={`+${qty}`}
                    size="small"
                    sx={{ bgcolor: "rgba(22, 163, 74, 0.1)", color: "#16a34a", fontWeight: 800 }}
                />
            );
        }
        return (
            <Chip
                icon={<ArrowDownRight size={14} color="#dc2626" />}
                label={`-${qty}`}
                size="small"
                sx={{ bgcolor: "rgba(220, 38, 38, 0.1)", color: "#dc2626", fontWeight: 800 }}
            />
        );
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* Header title paper */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    bgcolor: "#fff",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                    mb: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2
                }}
            >
                <Box display="flex" alignItems="center" gap={2}>
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
                        <History size={24} />
                    </Box>
                    <Box>
                        <Typography variant="h5" color="#1e293b">
                            Nhật ký biến động tồn kho hoa (Flower Logs)
                        </Typography>
                        <Typography variant="body2" color="#64748b">
                            Theo dõi lịch sử cộng / trừ hoa từ nhập kho, bán hàng và điều chỉnh (Tổng {totalCount} bản ghi)
                        </Typography>
                    </Box>
                </Box>

                <Tooltip title="Tải lại dữ liệu">
                    <IconButton onClick={() => fetchLogs(page)} sx={{ bgcolor: "#f8fafc", border: "1px solid #cbd5e1" }}>
                        <RefreshCw size={18} />
                    </IconButton>
                </Tooltip>
            </Paper>

            {/* Filter Bar */}
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    bgcolor: "#fff",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                    mb: 3
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Chọn loại hoa"
                            value={selectedFlower}
                            onChange={(e) => {
                                setSelectedFlower(e.target.value);
                                setPage(1);
                            }}
                        >
                            <MenuItem value="">Tất cả hoa</MenuItem>
                            {flowers.map((f) => (
                                <MenuItem key={f.id} value={f.id}>
                                    {f.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2.5}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Loại biến động"
                            value={selectedType}
                            onChange={(e) => {
                                setSelectedType(e.target.value);
                                setPage(1);
                            }}
                        >
                            <MenuItem value="">Tất cả loại</MenuItem>
                            <MenuItem value="import">Nhập hàng (Import)</MenuItem>
                            <MenuItem value="sale">Bán hàng (Sale)</MenuItem>
                            <MenuItem value="cancel">Hủy đơn (Cancel)</MenuItem>
                            <MenuItem value="adjustment">Điều chỉnh (Adjustment)</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2.5}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Chiều biến động"
                            value={selectedChangeType}
                            onChange={(e) => {
                                setSelectedChangeType(e.target.value);
                                setPage(1);
                            }}
                        >
                            <MenuItem value="">Tất cả (+ / -)</MenuItem>
                            <MenuItem value="plus">Cộng hoa (+)</MenuItem>
                            <MenuItem value="minus">Trừ hoa (-)</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={6} sm={3} md={2}>
                        <TextField
                            type="date"
                            fullWidth
                            size="small"
                            label="Từ ngày"
                            InputLabelProps={{ shrink: true }}
                            value={fromDate}
                            onChange={(e) => {
                                setFromDate(e.target.value);
                                setPage(1);
                            }}
                        />
                    </Grid>

                    <Grid item xs={6} sm={3} md={2}>
                        <TextField
                            type="date"
                            fullWidth
                            size="small"
                            label="Đến ngày"
                            InputLabelProps={{ shrink: true }}
                            value={toDate}
                            onChange={(e) => {
                                setToDate(e.target.value);
                                setPage(1);
                            }}
                        />
                    </Grid>

                    {(selectedFlower || selectedType || selectedChangeType || fromDate || toDate) && (
                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                            <Button
                                startIcon={<FilterX size={16} />}
                                onClick={handleClearFilters}
                                size="small"
                                sx={{ color: "#ef4444", textTransform: "none", fontWeight: 700 }}
                            >
                                Xóa bộ lọc
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Paper>

            {/* Table */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    bgcolor: "#fff",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                    overflow: "hidden"
                }}
            >
                <TableContainer>
                    <Table sx={{ minWidth: 700 }}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#f8fafc" }}>
                                <TableCell sx={{ fontWeight: 700, color: "#475569", py: 2 }}>ID Log</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: "#475569", py: 2 }}>Thời gian</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: "#475569", py: 2 }}>Tên hoa</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: "#475569", py: 2 }}>Loại nghiệp vụ</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: "#475569", py: 2 }}>Biến động</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: "#475569", py: 2 }}>Người thực hiện / Ghi chú</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        <CircularProgress color="success" />
                                    </TableCell>
                                </TableRow>
                            ) : logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        <Typography color="text.secondary">Không tìm thấy nhật ký biến động nào.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id} sx={{ "&:hover": { bgcolor: "#f8fafc" }, transition: "background-color 0.2s" }}>
                                        <TableCell sx={{ py: 2 }}>
                                            <Typography variant="subtitle2" fontWeight={700} color="#1e293b">
                                                #{log.id}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2" color="#64748b" display="flex" alignItems="center" gap={0.8}>
                                                <Calendar size={14} color="#94a3b8" />
                                                {log.created_at ? new Date(log.created_at).toLocaleString("vi-VN") : "-"}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight={700} color="#16a34a">
                                                {log.flower?.name || `Hoa #${log.flower_id}`}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>{getTypeChip(log.type)}</TableCell>

                                        <TableCell>{getChangeTypeBadge(log.change_type, log.quantity)}</TableCell>

                                        <TableCell>
                                            <Box>
                                                {log.user && (
                                                    <Typography variant="caption" color="#475569" display="flex" alignItems="center" gap={0.5} fontWeight={600}>
                                                        <User size={13} color="#64748b" /> {log.user.name} ({log.user.email})
                                                    </Typography>
                                                )}
                                                {log.note && (
                                                    <Typography variant="body2" color="#334155" fontSize="0.85rem">
                                                        {log.note}
                                                    </Typography>
                                                )}
                                                {log.reference_type && (
                                                    <Typography variant="caption" color="#94a3b8" display="flex" alignItems="center" gap={0.5} mt={0.3}>
                                                        <FileText size={12} /> Ref: {log.reference_type} #{log.reference_id}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {totalPages > 1 && (
                    <Box display="flex" justifyContent="center" p={3}>
                        <Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} color="success" />
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default AdminFlowerLog;
