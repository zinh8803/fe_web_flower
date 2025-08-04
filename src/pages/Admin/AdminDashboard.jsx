import React, { useEffect, useState } from "react";
import {
    Box, Typography, Grid, Card, CardContent, Avatar, LinearProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TextField, Button,
    CircularProgress
} from "@mui/material";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement
} from "chart.js";
import { getDashboardStats, exportStatistics } from "../../services/adminService";
import { ShoppingCart, DollarSign, Users, Package, FileText } from "lucide-react";
import { showNotification } from "../../store/notificationSlice";
import { useDispatch } from "react-redux";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const today = new Date().toISOString().split('T')[0];
    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(firstDay);
    const [endDate, setEndDate] = useState(today);
    const [exporting, setExporting] = useState(false);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        totalReceipts: 0,
        totalImport: 0,
        topCustomers: [],
        topProducts: [],
        recentOrders: [],
        orderStatusStats: [],
        revenueByDate: [],
        orderCountByDate: [],
        importByDate: [],
        labels: []
    });

    useEffect(() => {
        fetchData(firstDay, today);
    }, []);

    const fetchData = async (start = "", end = "") => {
        console.log(`Fetching data from ${start} to ${end}`);
        setLoading(true);
        try {
            const res = await getDashboardStats(start, end);
            console.log("API Response:", res.data);
            console.log("API URL:", res.config?.url);
            console.log("API Params:", res.config?.params);

            if (res.data && res.data.success) {
                setStats(res.data.stats);
            }
        } catch (err) {
            console.error("Error fetching dashboard stats:", err);
            setStats({
                totalOrders: 0,
                totalRevenue: 0,
                totalCustomers: 0,
                totalReceipts: 0,
                totalImport: 0,
                topCustomers: [],
                topProducts: [],
                recentOrders: [],
                orderStatusStats: [],
                revenueByDate: [],
                orderCountByDate: [],
                importByDate: [],
                labels: []
            });
        }
        setLoading(false);
    };

    const handleFilter = () => {
        console.log("Manual filter:", startDate, "to", endDate);
        setStats({
            totalOrders: 0,
            totalRevenue: 0,
            totalCustomers: 0,
            totalReceipts: 0,
            totalImport: 0,
            topCustomers: [],
            topProducts: [],
            recentOrders: [],
            orderStatusStats: [],
            revenueByDate: [],
            orderCountByDate: [],
            importByDate: [],
            labels: []
        });
        fetchData(startDate, endDate);
    };

    function formatDateLocal(date) {
        return date.getFullYear() +
            '-' +
            String(date.getMonth() + 1).padStart(2, '0') +
            '-' +
            String(date.getDate()).padStart(2, '0');
    }
    const handleQuickFilter = (type) => {
        let start, end;
        const now = new Date();

        switch (type) {
            case 'today':
                start = end = formatDateLocal(now);
                break;
            case 'week':
                const weekStart = new Date(now);
                weekStart.setDate(weekStart.getDate() - 6);
                start = formatDateLocal(weekStart);
                end = formatDateLocal(now);
                break;
            case 'month':
                start = formatDateLocal(new Date(now.getFullYear(), now.getMonth(), 1));
                end = formatDateLocal(now);
                break;
            case 'year':
                start = formatDateLocal(new Date(now.getFullYear(), 0, 1));
                end = formatDateLocal(now);
                break;
            default:
                return;
        }

        console.log(`Quick filter ${type}: ${start} to ${end}`);
        setStartDate(start);
        setEndDate(end);

        setStats({
            totalOrders: 0,
            totalRevenue: 0,
            totalCustomers: 0,
            totalReceipts: 0,
            totalImport: 0,
            topCustomers: [],
            topProducts: [],
            recentOrders: [],
            orderStatusStats: [],
            revenueByDate: [],
            orderCountByDate: [],
            importByDate: [],
            labels: []
        });

        fetchData(start, end);
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const res = await exportStatistics(startDate, endDate);

            const blob = res.data;

            if ('showSaveFilePicker' in window) {
                try {
                    const fileHandle = await window.showSaveFilePicker({
                        suggestedName: `bao_cao_${startDate}_${endDate}.xlsx`,
                        types: [
                            {
                                description: 'Excel files',
                                accept: {
                                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
                                }
                            }
                        ]
                    });

                    const writable = await fileHandle.createWritable();
                    await writable.write(blob);
                    await writable.close();

                    dispatch(showNotification({
                        message: "Xuất thống kê thành công",
                        severity: "success"
                    }));
                } catch (saveErr) {
                    if (saveErr.name !== 'AbortError') {
                        console.error("Error saving file:", saveErr);
                        downloadWithTraditionalMethod(blob);
                    }
                }
            } else {
                downloadWithTraditionalMethod(blob);
            }
        } catch (err) {
            console.error("Error exporting statistics:", err);
            dispatch(showNotification({
                message: "Xuất thống kê thất bại",
                severity: "error"
            }));
        }
        setExporting(false);
    };

    const downloadWithTraditionalMethod = (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bao_cao_${startDate}_${endDate}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        dispatch(showNotification({
            message: "File đã được tải xuống",
            severity: "success"
        }));
    };
    return (
        <Box sx={{
            width: '100%',
            maxWidth: 'none',
            overflow: 'hidden'
        }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
                Dashboard Thống Kê
            </Typography>

            {/* Bộ lọc ngày */}
            <Card sx={{ mb: 3, width: '100%' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Lọc theo thời gian
                    </Typography>
                    <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                        <TextField
                            label="Từ ngày"
                            type="date"
                            size="small"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Đến ngày"
                            type="date"
                            size="small"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleFilter}
                            disabled={loading}
                        >
                            Lọc
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => handleQuickFilter('today')}
                            size="small"
                        >
                            Hôm nay
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => handleQuickFilter('week')}
                            size="small"
                        >
                            7 ngày
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => handleQuickFilter('month')}
                            size="small"
                        >
                            Tháng này
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => handleQuickFilter('year')}
                            size="small"
                        >
                            Năm này
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => handleExport()}
                            size="small"
                            disabled={exporting}
                            startIcon={exporting ? <CircularProgress size={20} /> : null}
                        >
                            {exporting ? "Đang xuất..." : "Xuất thống kê"}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {loading && <LinearProgress sx={{ mb: 2 }} />}

            {/* Thống kê tổng quan */}
            <Grid container spacing={4} mb={4}>
                <Grid item xs={12} sm={6} md={2}>
                    <Card><CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: "primary.main" }}><ShoppingCart /></Avatar>
                            <Box>
                                <Typography variant="body2">Tổng đơn hàng</Typography>
                                <Typography variant="h6">{stats.totalOrders}</Typography>
                            </Box>
                        </Box>
                    </CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card><CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: "success.main" }}><DollarSign /></Avatar>
                            <Box>
                                <Typography variant="body2">Doanh thu</Typography>
                                <Typography variant="h6">{stats.totalRevenue.toLocaleString()}đ</Typography>
                            </Box>
                        </Box>
                    </CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card><CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: "info.main" }}><Users /></Avatar>
                            <Box>
                                <Typography variant="body2">Khách hàng</Typography>
                                <Typography variant="h6">{stats.totalCustomers}</Typography>
                            </Box>
                        </Box>
                    </CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card><CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: "warning.main" }}><FileText /></Avatar>
                            <Box>
                                <Typography variant="body2">Phiếu nhập</Typography>
                                <Typography variant="h6">{stats.totalReceipts}</Typography>
                            </Box>
                        </Box>
                    </CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card><CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: "secondary.main" }}><Package /></Avatar>
                            <Box>
                                <Typography variant="body2">Tiền nhập kho</Typography>
                                <Typography variant="h6">{stats.totalImport.toLocaleString()}đ</Typography>
                            </Box>
                        </Box>
                    </CardContent></Card>
                </Grid>
            </Grid>

            {/* Biểu đồ doanh thu theo ngày */}
            <Grid container spacing={0} mb={4} sx={{ width: '100%' }}>
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <Card sx={{ width: '100%', minWidth: '100%' }}>
                        <CardContent sx={{ width: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Doanh thu theo ngày
                            </Typography>
                            <Box sx={{
                                height: 400,
                                width: '100%',
                                minWidth: '100%',
                                position: 'relative'
                            }}>
                                <Line
                                    data={{
                                        labels: stats.labels,
                                        datasets: [
                                            {
                                                label: "Doanh thu",
                                                data: stats.revenueByDate,
                                                borderColor: "rgb(75, 192, 192)",
                                                backgroundColor: "rgba(75, 192, 192, 0.2)",
                                                tension: 0.1,
                                                fill: true
                                            }
                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {
                                                    callback: value => value.toLocaleString() + "đ"
                                                }
                                            }
                                        }
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            {/* <Grid container spacing={0} mb={4} sx={{ width: '100%' }}>
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <Card sx={{ width: '100%', minWidth: '100%' }}>
                        <CardContent sx={{ width: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Doanh thu theo ngày
                            </Typography>
                            <Box sx={{
                                height: 400,
                                width: '100%',
                                minWidth: '100%',
                                position: 'relative'
                            }}>
                                <Pie
                                    data={{
                                        labels: stats.labels,
                                        datasets: [
                                            {
                                                label: "Doanh thu",
                                                data: stats.revenueByDate,
                                                backgroundColor: [
                                                    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
                                                ]
                                            }
                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: "bottom" }
                                        }
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid> */}
            {/* Biểu đồ số đơn hàng & nhập kho theo ngày */}
            <Grid container spacing={0} mb={4} sx={{ width: '100%' }}>
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <Card sx={{ width: '100%', minWidth: '100%' }}>
                        <CardContent sx={{ width: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Số đơn hàng & nhập kho theo ngày
                            </Typography>
                            <Box sx={{
                                height: 400,
                                width: '100%',
                                minWidth: '100%',
                                position: 'relative'
                            }}>
                                <Bar
                                    data={{
                                        labels: stats.labels,
                                        datasets: [
                                            {
                                                label: "Đơn hàng",
                                                data: stats.orderCountByDate,
                                                backgroundColor: "rgba(54, 162, 235, 0.6)"
                                            },
                                            {
                                                label: "Tiền nhập kho",
                                                data: stats.importByDate,
                                                backgroundColor: "rgba(255, 206, 86, 0.6)"
                                            }
                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { position: "bottom" } },
                                        scales: {
                                            y: { beginAtZero: true }
                                        }
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Top khách hàng */}
            <Grid container spacing={0} mb={4} sx={{ width: '100%' }}>
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <Card sx={{ width: '100%', minWidth: '100%' }}>
                        <CardContent sx={{ width: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Top khách hàng
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Khách hàng</TableCell>
                                            <TableCell align="right">Số đơn</TableCell>
                                            <TableCell align="right">Tổng chi</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {stats.topCustomers.map((c, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.light" }}>
                                                            {c.name?.charAt(0).toUpperCase() || "?"}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {c.name || "N/A"}
                                                            </Typography>
                                                            <Typography variant="caption" color="textSecondary">
                                                                {c.email || c.phone}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">{c.total}</TableCell>
                                                <TableCell align="right">{c.spent.toLocaleString()}đ</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Top sản phẩm bán chạy */}
            <Grid container spacing={0} mb={4} sx={{ width: '100%' }}>
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <Card sx={{ width: '100%', minWidth: '100%' }}>
                        <CardContent sx={{ width: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Top sản phẩm bán chạy
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Sản phẩm</TableCell>
                                            <TableCell align="right">Đã bán</TableCell>
                                            <TableCell align="right">Doanh thu</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {stats.topProducts.map((p, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Avatar src={p.image} sx={{ width: 32, height: 32 }} />
                                                        <Typography variant="body2">{p.name}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">{p.sold}</TableCell>
                                                <TableCell align="right">{p.revenue.toLocaleString()}đ</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Thống kê trạng thái đơn hàng */}
            <Grid container spacing={0} mb={4} sx={{ width: '100%' }}>
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <Card sx={{ width: '100%', minWidth: '100%' }}>
                        <CardContent sx={{ width: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Thống kê trạng thái đơn hàng
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Trạng thái</TableCell>
                                            <TableCell align="right">Số lượng</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {stats.orderStatusStats.map((s, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <Chip label={s.status} size="small" />
                                                </TableCell>
                                                <TableCell align="right">{s.count}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Đơn hàng gần đây */}
            <Grid container spacing={0} mb={4} sx={{ width: '100%' }}>
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <Card sx={{ width: '100%', minWidth: '100%' }}>
                        <CardContent sx={{ width: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Đơn hàng gần đây
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Mã đơn</TableCell>
                                            <TableCell>Khách hàng</TableCell>
                                            <TableCell>Ngày</TableCell>
                                            <TableCell>Trạng thái</TableCell>
                                            <TableCell align="right">Tổng tiền</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {stats.recentOrders.map((o, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{o.code}</TableCell>
                                                <TableCell>{o.name}</TableCell>
                                                <TableCell>{o.date}</TableCell>
                                                <TableCell>
                                                    <Chip label={o.status} size="small" />
                                                </TableCell>
                                                <TableCell align="right">{o.total.toLocaleString()}đ</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard;