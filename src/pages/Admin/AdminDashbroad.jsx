import React, { useEffect, useState } from "react";
import {
    Box, Typography, Grid, Card, CardContent, Avatar, LinearProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip
} from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend
} from "chart.js";
import { getOrders } from "../../services/orderService";
import { getImportReceipts } from "../../services/importReceiptsService";
import { ShoppingCart, DollarSign, Users, Package, TrendingUp, FileText } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AdminDashbroad = () => {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [receipts, setReceipts] = useState([]);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        totalProducts: 0,
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
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Lấy tất cả đơn hàng (nhiều trang)
            let allOrders = [];
            let page = 1, lastPage = 1;
            do {
                const res = await getOrders(page);
                allOrders = allOrders.concat(res.data.data || []);
                lastPage = res.data.meta?.last_page || 1;
                page++;
            } while (page <= lastPage);

            // Lấy tất cả phiếu nhập (nhiều trang)
            let allReceipts = [];
            page = 1; lastPage = 1;
            do {
                const res = await getImportReceipts(page);
                allReceipts = allReceipts.concat(res.data.data || []);
                lastPage = res.data.meta?.last_page || 1;
                page++;
            } while (page <= lastPage);

            setOrders(allOrders);
            setReceipts(allReceipts);

            // Xử lý thống kê
            processStats(allOrders, allReceipts);
        } catch (err) {
            setOrders([]);
            setReceipts([]);
        }
        setLoading(false);
    };

    const processStats = (orders, receipts) => {
        // Tổng đơn hàng, doanh thu, khách hàng
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_price || 0), 0);
        const customers = {};
        orders.forEach(o => {
            const key = o.email || o.phone || o.name;
            if (!customers[key]) customers[key] = { name: o.name, email: o.email, phone: o.phone, total: 0, spent: 0 };
            customers[key].total += 1;
            customers[key].spent += Number(o.total_price || 0);
        });
        const totalCustomers = Object.keys(customers).length;

        // Top khách hàng
        const topCustomers = Object.values(customers)
            .sort((a, b) => b.spent - a.spent)
            .slice(0, 5);

        // Thống kê trạng thái đơn hàng
        const statusStats = {};
        orders.forEach(o => {
            statusStats[o.status] = (statusStats[o.status] || 0) + 1;
        });
        const orderStatusStats = Object.entries(statusStats).map(([status, count]) => ({
            status, count
        }));

        // Top sản phẩm bán chạy
        const productStats = {};
        orders.forEach(o => {
            (o.order_details || []).forEach(d => {
                const key = d.product?.id || d.product_id;
                if (!productStats[key]) productStats[key] = {
                    name: d.product?.name || "Sản phẩm",
                    image: d.product?.image_url,
                    sold: 0,
                    revenue: 0
                };
                productStats[key].sold += d.quantity;
                productStats[key].revenue += (Number(d.product_size?.price || d.price || 0) * d.quantity);
            });
        });
        const topProducts = Object.values(productStats)
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 5);

        // Đơn hàng gần đây
        const recentOrders = orders
            .sort((a, b) => new Date(b.buy_at || b.created_at) - new Date(a.buy_at || a.created_at))
            .slice(0, 10)
            .map(o => ({
                code: o.order_code,
                name: o.name,
                date: o.buy_at || o.created_at,
                status: o.status,
                total: Number(o.total_price || 0)
            }));

        // Tổng phiếu nhập, tổng tiền nhập
        const totalReceipts = receipts.length;
        const totalImport = receipts.reduce((sum, r) => sum + Number(r.total_price || 0), 0);

        // Biểu đồ doanh thu và đơn hàng theo ngày
        const allDates = [
            ...orders.map(o => (o.buy_at || o.created_at)?.slice(0, 10)),
            ...receipts.map(r => r.import_date?.slice(0, 10))
        ].filter(Boolean);
        const uniqueDates = Array.from(new Set(allDates)).sort();

        const revenueByDate = uniqueDates.map(date =>
            orders.filter(o => (o.buy_at || o.created_at)?.slice(0, 10) === date)
                .reduce((sum, o) => sum + Number(o.total_price || 0), 0)
        );
        const orderCountByDate = uniqueDates.map(date =>
            orders.filter(o => (o.buy_at || o.created_at)?.slice(0, 10) === date).length
        );
        const importByDate = uniqueDates.map(date =>
            receipts.filter(r => r.import_date?.slice(0, 10) === date)
                .reduce((sum, r) => sum + Number(r.total_price || 0), 0)
        );

        setStats({
            totalOrders, totalRevenue, totalCustomers, totalReceipts, totalImport,
            topCustomers, topProducts, recentOrders, orderStatusStats,
            revenueByDate, orderCountByDate, importByDate, labels: uniqueDates
        });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight="bold" mb={3}>
                Dashboard Thống Kê
            </Typography>
            {loading && <LinearProgress sx={{ mb: 2 }} />}
            <Grid container spacing={3} mb={4}>
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

            {/* Biểu đồ */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Doanh thu theo ngày
                            </Typography>
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
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Số đơn hàng & nhập kho theo ngày
                            </Typography>
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
                                    plugins: { legend: { position: "bottom" } },
                                    scales: {
                                        y: { beginAtZero: true }
                                    }
                                }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Top khách hàng và sản phẩm */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
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
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
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
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
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
                {/* Đơn hàng gần đây */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
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

export default AdminDashbroad;