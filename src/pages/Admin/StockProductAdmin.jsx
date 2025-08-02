import React, { useEffect, useState } from "react";
import {
    Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip,
    CircularProgress, List, ListItem, ListItemText, Pagination, TextField, Button,
    InputAdornment, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { searchStockWarning } from "../../services/productService";
import { Search as SearchIcon, FilterAlt as FilterIcon } from "@mui/icons-material";

const StockProductAdmin = () => {
    const [data, setData] = useState({ available: [], low: [], out: [] });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState({ available: 1, low: 1, out: 1 });
    const [search, setSearch] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [activeTab, setActiveTab] = useState("available");

    const fetchData = (q, p, date) => {
        setLoading(true);
        const formattedDate = date || null;
        searchStockWarning(q, p, formattedDate)
            .then(res => {
                setData({
                    available: res.data?.available?.data || [],
                    low: res.data?.low?.data || [],
                    out: res.data?.out?.data || [],
                });
                setLastPage({
                    available: res.data?.available?.last_page || 1,
                    low: res.data?.low?.last_page || 1,
                    out: res.data?.out?.last_page || 1,
                });
            })
            .catch(() => setData({ available: [], low: [], out: [] }))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData(search, page, selectedDate);
    }, [search, page, selectedDate]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchValue);
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setPage(1);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(1);
    };

    const handleResetFilters = () => {
        setSelectedDate("");
        setSearchValue("");
        setSearch("");
        setPage(1);
    };

    const getStockStatusLabel = (maxQuantity) => {
        if (maxQuantity === 0) return { label: "Hết hàng", color: "error" };
        if (maxQuantity <= 10) return { label: "Gần hết", color: "warning" };
        return { label: "Còn hàng", color: "success" };
    };

    return (
        <Box>
            <Typography variant="h5" mb={3} fontWeight="bold">Tồn kho sản phẩm</Typography>
            <Box mb={3} sx={{ display: "flex", gap: 2, alignItems: "flex-end", flexWrap: "wrap" }}>
                <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", gap: 1 }}>
                    <TextField
                        label="Tìm kiếm sản phẩm"
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button type="submit" variant="contained">Tìm kiếm</Button>
                </Box>
                <TextField
                    label="Ngày nhập hàng"
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    size="small"
                    sx={{ minWidth: 200 }}
                    InputLabelProps={{ shrink: true }}
                />
                <Button
                    variant="outlined"
                    onClick={handleResetFilters}
                    sx={{ height: 40 }}
                >
                    Xóa bộ lọc
                </Button>
            </Box>
            <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
                <Button
                    variant={activeTab === "available" ? "contained" : "outlined"}
                    color="success"
                    onClick={() => handleTabChange("available")}
                >
                    Còn hàng
                </Button>
                <Button
                    variant={activeTab === "low" ? "contained" : "outlined"}
                    color="warning"
                    onClick={() => handleTabChange("low")}
                >
                    Gần hết
                </Button>
                <Button
                    variant={activeTab === "out" ? "contained" : "outlined"}
                    color="error"
                    onClick={() => handleTabChange("out")}
                >
                    Hết hàng
                </Button>
            </Box>
            {selectedDate && (
                <Typography variant="subtitle1" mb={2} color="primary">
                    Đang xem tồn kho ngày: {selectedDate.split('-').reverse().join('/')}
                </Typography>
            )}
            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                                <TableCell>STT</TableCell>
                                <TableCell>Hình ảnh</TableCell>
                                <TableCell>Sản phẩm</TableCell>
                                <TableCell>Kích thước & Tồn kho</TableCell>
                                <TableCell>Hoa gần hết</TableCell>
                                <TableCell>Trạng thái</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data[activeTab].length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="subtitle1" py={3}>
                                            Không tìm thấy sản phẩm nào
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data[activeTab].map((product, idx) => (
                                    <TableRow key={product.product_id}>
                                        <TableCell>{
                                            (page - 1) * 10 + idx + 1
                                        }
                                        </TableCell>
                                        <TableCell>
                                            <img src={product.product_image} alt={product.product_name} width={50} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography fontWeight="bold">
                                                {product.product_name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <List dense>
                                                {product.product_sizes.map((size) => (
                                                    <ListItem key={size.size_id} disablePadding>
                                                        <ListItemText
                                                            primary={`${size.size}: ${size.max_quantity} sản phẩm`}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </TableCell>
                                        <TableCell>
                                            <List dense>
                                                {product.product_sizes.map((size) => (
                                                    <ListItem key={size.size_id} disablePadding>
                                                        <ListItemText
                                                            primary={size.limiting_flower
                                                                ? `${size.limiting_flower.name} (còn ${size.limiting_flower.available})`
                                                                : "Không có"}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" flexDirection="column" gap={0.5}>
                                                {product.product_sizes.map((size) => {
                                                    const status = getStockStatusLabel(size.max_quantity);
                                                    return (
                                                        <Chip
                                                            key={size.size_id}
                                                            label={`${size.size}: ${status.label}`}
                                                            color={status.color}
                                                            size="small"
                                                            sx={{ fontWeight: "bold" }}
                                                        />
                                                    );
                                                })}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    <Box mt={2} display="flex" justifyContent="center">
                        <Pagination
                            count={lastPage[activeTab]}
                            page={page}
                            onChange={(_, value) => setPage(value)}
                            color="primary"
                        />
                    </Box>
                </>
            )}
        </Box>
    );
};

export default StockProductAdmin;