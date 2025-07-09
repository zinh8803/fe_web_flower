import React, { useEffect, useState } from "react";
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Pagination,
    Autocomplete, Stack, Chip, FormControl, InputLabel, Select, MenuItem,
    Checkbox, InputAdornment, List, ListItem, ListItemText, ListItemIcon, Divider
} from "@mui/material";
import { createAutoImportReceipt, getAutoImportReceipts, getImportReceiptById, getImportReceipts, importReceipts, updateImportReceipt } from "../../services/importReceiptsService";
import { getFlower } from "../../services/flowerService";
import { Add, Delete, Edit, KeyboardArrowDown, KeyboardArrowUp, Search, AccessAlarm } from "@mui/icons-material"; // icon cho nút tự động

const AdminReceipt = () => {
    const [receipts, setReceipts] = useState([]);
    const [flowerSearch, setFlowerSearch] = useState("");
    const [openRow, setOpenRow] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [flowers, setFlowers] = useState([]);
    const [form, setForm] = useState({
        import_date: "",
        note: "",
        details: []
    });
    const [editReceipt, setEditReceipt] = useState(null);
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectedFlower, setSelectedFlower] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [importPrice, setImportPrice] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [flowerDropdownOpen, setFlowerDropdownOpen] = useState(false);
    const [openAutoDialog, setOpenAutoDialog] = useState(false);
    const [autoConfig, setAutoConfig] = useState({
        import_date: "",
        run_time: "",
        details: [],
        enabled: true,
    });
    const [autoFlowerSearch, setAutoFlowerSearch] = useState("");
    const [autoFlowerDropdownOpen, setAutoFlowerDropdownOpen] = useState(false);

    useEffect(() => {
        fetchReceipts(page);
    }, [page]);

    // Thêm hàm fetchAutoConfig bên ngoài useEffect
    const fetchAutoConfig = async () => {
        try {
            const res = await getAutoImportReceipts();
            if (res.data && res.data.data) {
                const data = res.data.data;
                let import_date = data.import_date;
                if (import_date) {
                    import_date = import_date.split('T')[0];
                    if (import_date.includes(' ')) import_date = import_date.split(' ')[0];
                }
                let run_time = data.run_time;
                if (run_time && run_time.length > 5) {
                    run_time = run_time.slice(0, 5);
                }
                setAutoConfig({
                    ...data,
                    import_date: import_date || "",
                    run_time: run_time || "",
                    enabled: !!data.enabled,
                });
            }
        } catch (error) {
            console.error("Error fetching auto config:", error);
        }
    };
    // useEffect sẽ gọi hàm này khi mount
    useEffect(() => {
        fetchAutoConfig();
    }, []);

    const fetchReceipts = async (pageNum = 1) => {
        try {
            const res = await getImportReceipts(pageNum, fromDate, toDate, searchQuery);
            setReceipts(res.data.data || []);
            setTotalPages(res.data.meta ? res.data.meta.last_page : 1);
        } catch {
            alert("Lỗi khi tải phiếu nhập");
        }
    };

    const filteredFlowers = flowers.filter(flower =>
        flower.name.toLowerCase().includes(flowerSearch.toLowerCase())
    );

    const handleOpenDialog = async () => {
        try {
            const res = await getFlower();
            setFlowers(res.data.data || []);
            setForm({
                import_date: "",
                note: "",
                details: []
            });
            setEditReceipt(null);
            setFlowerSearch("");
            setSelectedFlower(null);
            setQuantity(1);
            setImportPrice(0);
            setOpenDialog(true);
        } catch {
            alert("Lỗi khi tải danh sách hoa");
        }
    };
    const handlePageChange = (event, value) => {
        setPage(value);
    };
    const handleCloseDialog = () => setOpenDialog(false);

    const handleDetailChange = (flower_id, field, value) => {
        setForm({
            ...form,
            details: form.details.map(d =>
                d.flower_id === flower_id ? { ...d, [field]: value } : d
            )
        });
    };

    const handleAddFlowerToList = () => {
        if (!selectedFlower) return;

        const exists = form.details.find(d => d.flower_id === selectedFlower.id);
        if (exists) {
            setForm({
                ...form,
                details: form.details.map(d =>
                    d.flower_id === selectedFlower.id
                        ? { ...d, quantity: parseInt(quantity), import_price: parseFloat(importPrice) }
                        : d
                )
            });
        } else {
            setForm({
                ...form,
                details: [
                    ...form.details,
                    {
                        flower_id: selectedFlower.id,
                        quantity: parseInt(quantity),
                        import_price: parseFloat(importPrice),
                        status: "hoa tươi",
                        flower_name: selectedFlower.name
                    }
                ]
            });
        }

        // Reset các trường sau khi thêm
        setSelectedFlower(null);
        setQuantity(1);
        setImportPrice(0);
    };

    // Hàm xóa hoa khỏi danh sách
    const handleRemoveFlower = (flowerId) => {
        setForm({
            ...form,
            details: form.details.filter(d => d.flower_id !== flowerId)
        });
    };

    // Xử lý submit
    const handleSubmit = async () => {
        try {
            if (editReceipt) {
                await updateImportReceipt(editReceipt.id, form);
            } else {
                await importReceipts(form);
            }
            setOpenDialog(false);
            fetchReceipts();
        } catch {
            alert("Lỗi khi lưu phiếu nhập");
        }
    };

    // Xử lý mở form sửa
    const handleOpenEdit = async (receipt) => {
        try {
            const res = await getImportReceiptById(receipt.id);
            const data = res.data.data;
            setEditReceipt(data);
            setForm({
                import_date: data.import_date,
                note: data.note,
                details: data.details.map(d => ({
                    flower_id: d.flower_id,
                    quantity: d.quantity,
                    import_price: d.import_price,
                    status: d.status
                }))
            });
            // Lấy lại danh sách hoa (nếu cần)
            const flowerRes = await getFlower();
            setFlowers(flowerRes.data.data || []);
            setOpenDialog(true);
        } catch {
            alert("Lỗi khi tải chi tiết phiếu nhập");
        }
    };

    // Thêm hàm để kiểm tra hoa đã được chọn chưa
    const isFlowerSelected = (flowerId) => {
        return form.details.some(d => d.flower_id === flowerId);
    };

    const handleOpenAutoDialog = async () => {
        try {
            // Tải danh sách hoa (nếu chưa có)
            if (flowers.length === 0) {
                const res = await getFlower();
                setFlowers(res.data.data || []);
            }

            // Refresh cấu hình tự động mỗi khi mở dialog
            await fetchAutoConfig();

            // Không cần set lại autoConfig ở đây nữa vì đã được set trong fetchAutoConfig
            setAutoFlowerSearch("");
            setOpenAutoDialog(true);
        } catch (error) {
            console.error(error);
            alert("Lỗi khi tải danh sách hoa!");
        }
    };

    // Thêm các hàm xử lý cho Auto Config:
    const isAutoFlowerSelected = (flowerId) => {
        return autoConfig.details.some(d => d.flower_id === flowerId);
    };

    const handleAutoDetailChange = (flower_id, field, value) => {
        setAutoConfig({
            ...autoConfig,
            details: autoConfig.details.map(d =>
                d.flower_id === flower_id ? { ...d, [field]: value } : d
            )
        });
    };

    const handleAddAutoFlower = (flower) => {
        if (isAutoFlowerSelected(flower.id)) {
            // Nếu đã có, xóa ra
            setAutoConfig({
                ...autoConfig,
                details: autoConfig.details.filter(d => d.flower_id !== flower.id)
            });
        } else {
            // Nếu chưa có, thêm vào
            setAutoConfig({
                ...autoConfig,
                details: [
                    ...autoConfig.details,
                    {
                        flower_id: flower.id,
                        flower_name: flower.name,
                        quantity: 10,
                        import_price: flower.price || 0,
                        status: "hoa tươi"
                    }
                ]
            });
        }
    };

    const handleRemoveAutoFlower = (flowerId) => {
        setAutoConfig({
            ...autoConfig,
            details: autoConfig.details.filter(d => d.flower_id !== flowerId)
        });
    };

    // Lọc hoa cho dialog tự động
    const filteredAutoFlowers = flowers.filter(flower =>
        flower.name.toLowerCase().includes(autoFlowerSearch.toLowerCase())
    );

    const handleSaveAutoConfig = async () => {
        try {
            await createAutoImportReceipt(autoConfig);
            setOpenAutoDialog(false);

            // Refresh dữ liệu sau khi lưu
            await fetchAutoConfig();

            alert("Đã lưu cấu hình tự động nhập!");
        } catch (error) {
            console.error("Error saving auto config:", error);
            alert("Lỗi khi lưu cấu hình tự động!");
        }
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Quản lý phiếu nhập
            </Typography>
            <Button variant="contained" color="success" sx={{ mb: 2 }} onClick={() => handleOpenDialog()}>
                Thêm phiếu nhập
            </Button>

            {/* Thêm ô tìm kiếm phiếu nhập */}
            <Box display="flex" gap={2} mb={2} flexWrap="wrap" alignItems="center">
                {/* <TextField
                    label="Tìm kiếm phiếu"
                    size="small"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    sx={{ minWidth: 200 }}
                    placeholder="Tìm theo mã, ghi chú..."
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Search />
                            </InputAdornment>
                        )
                    }}
                /> */}
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
                <Button variant="contained" onClick={() => fetchReceipts(1)}>
                    Lọc
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setSearchQuery("");
                        setFromDate("");
                        setToDate("");
                        fetchReceipts(1);
                    }}
                >
                    Xóa bộ lọc
                </Button>
                <Button
                    variant="outlined"
                    color="info"
                    startIcon={<AccessAlarm />}
                    onClick={handleOpenAutoDialog}
                >
                    Tự động nhập
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Mã phiếu</TableCell>
                            <TableCell>Ngày nhập</TableCell>
                            <TableCell>Ghi chú</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {receipts.map((receipt) => (
                            <React.Fragment key={receipt.id}>
                                <TableRow>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                setOpenRow(openRow === receipt.id ? null : receipt.id)
                                            }
                                        >
                                            {openRow === receipt.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>{receipt.import_code}</TableCell>
                                    <TableCell>{receipt.import_date}</TableCell>
                                    <TableCell>{receipt.note}</TableCell>
                                    <TableCell>
                                        {Number(receipt.total_price).toLocaleString()} đ

                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            sx={{ ml: 1 }}
                                            onClick={() => handleOpenEdit(receipt)}
                                        >
                                            <Edit />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                                        <Collapse in={openRow === receipt.id} timeout="auto" unmountOnExit>
                                            <Box margin={2}>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    Chi tiết phiếu nhập
                                                </Typography>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Tên hoa</TableCell>
                                                            <TableCell>Số lượng nhập</TableCell>
                                                            <TableCell>Đã dùng</TableCell>
                                                            <TableCell>Còn lại</TableCell>
                                                            <TableCell>Giá nhập</TableCell>
                                                            <TableCell>Thành tiền</TableCell>
                                                            <TableCell>Trạng thái</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {receipt.details.map((d) => (
                                                            <TableRow key={d.id}>
                                                                <TableCell>{d.flower_name}</TableCell>
                                                                <TableCell>{d.quantity}</TableCell>
                                                                <TableCell>{d.used_quantity}</TableCell>
                                                                <TableCell>{d.remaining_quantity}</TableCell>
                                                                <TableCell>{Number(d.import_price).toLocaleString()} đ</TableCell>
                                                                <TableCell>{Number(d.subtotal).toLocaleString()} đ</TableCell>
                                                                <TableCell>{d.status}</TableCell>
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
            {/* Dialog thêm phiếu nhập */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>{editReceipt ? "Sửa phiếu nhập" : "Thêm phiếu nhập"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Ngày nhập"
                        type="date"
                        name="import_date"
                        value={form.import_date}
                        onChange={e => setForm({ ...form, import_date: e.target.value })}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Ghi chú"
                        name="note"
                        value={form.note}
                        onChange={e => setForm({ ...form, note: e.target.value })}
                        fullWidth
                        margin="normal"
                    />

                    {/* Phần tìm kiếm hoa */}
                    <Box sx={{ mt: 3, position: 'relative' }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Chọn hoa cho phiếu nhập
                        </Typography>

                        <TextField
                            label="Tìm kiếm hoa"
                            value={flowerSearch}
                            onChange={(e) => setFlowerSearch(e.target.value)}
                            onFocus={() => setFlowerDropdownOpen(true)}
                            fullWidth
                            margin="normal"
                            size="small"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Search />
                                    </InputAdornment>
                                )
                            }}
                        />

                        {/* Dropdown menu cho danh sách hoa */}
                        {flowerDropdownOpen && (
                            <Paper
                                variant="outlined"
                                sx={{
                                    position: 'absolute',
                                    zIndex: 1000,
                                    width: '100%',
                                    maxHeight: 300,
                                    overflow: 'auto',
                                    mt: 0.5,
                                    boxShadow: 3
                                }}
                            >
                                <Box display="flex" justifyContent="flex-end" p={1}>
                                    <Button
                                        size="small"
                                        onClick={() => setFlowerDropdownOpen(false)}
                                    >
                                        Đóng
                                    </Button>
                                </Box>
                                <List dense>
                                    {filteredFlowers.length === 0 ? (
                                        <ListItem>
                                            <ListItemText primary="Không tìm thấy hoa phù hợp" />
                                        </ListItem>
                                    ) : (
                                        filteredFlowers.map((flower) => {
                                            const isSelected = isFlowerSelected(flower.id);

                                            return (
                                                <React.Fragment key={flower.id}>
                                                    <ListItem
                                                        button
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                handleRemoveFlower(flower.id);
                                                            } else {
                                                                setSelectedFlower(flower);
                                                                setImportPrice(flower.price || 0);
                                                                handleAddFlowerToList();
                                                            }
                                                            // Không đóng dropdown sau khi chọn để người dùng có thể chọn nhiều hoa
                                                        }}
                                                    >
                                                        <ListItemIcon>
                                                            <Checkbox
                                                                edge="start"
                                                                checked={isSelected}
                                                                tabIndex={-1}
                                                                disableRipple
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={flower.name}
                                                            secondary={`Giá: ${Number(flower.price).toLocaleString()} đ`}
                                                        />
                                                        {isSelected && (
                                                            <Box display="flex" alignItems="center" gap={1}>
                                                                <TextField
                                                                    label="SL"
                                                                    type="number"
                                                                    size="small"
                                                                    value={form.details.find(d => d.flower_id === flower.id)?.quantity || 1}
                                                                    onChange={(e) => {
                                                                        e.stopPropagation(); // Ngăn event bubble lên ListItem
                                                                        handleDetailChange(flower.id, "quantity", parseInt(e.target.value) || 1);
                                                                    }}
                                                                    onClick={(e) => e.stopPropagation()} // Ngăn event bubble lên ListItem
                                                                    inputProps={{ min: 1, style: { width: '50px' } }}
                                                                />
                                                                <TextField
                                                                    label="Giá"
                                                                    type="number"
                                                                    size="small"
                                                                    value={form.details.find(d => d.flower_id === flower.id)?.import_price || 0}
                                                                    onChange={(e) => {
                                                                        e.stopPropagation(); // Ngăn event bubble lên ListItem
                                                                        handleDetailChange(flower.id, "import_price", parseFloat(e.target.value) || 0);
                                                                    }}
                                                                    onClick={(e) => e.stopPropagation()} // Ngăn event bubble lên ListItem
                                                                    inputProps={{ min: 0, style: { width: '80px' } }}
                                                                />
                                                            </Box>
                                                        )}
                                                    </ListItem>
                                                    <Divider />
                                                </React.Fragment>
                                            );
                                        })
                                    )}
                                </List>
                            </Paper>
                        )}
                    </Box>

                    {/* Hiển thị danh sách hoa đã chọn */}
                    {form.details.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Danh sách hoa đã chọn ({form.details.length})
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tên hoa</TableCell>
                                        <TableCell>Số lượng</TableCell>
                                        <TableCell>Giá nhập</TableCell>
                                        <TableCell>Thành tiền</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {form.details.map((detail) => {
                                        const flower = flowers.find(f => f.id === detail.flower_id);
                                        const flowerName = flower ? flower.name : detail.flower_name || "Không xác định";
                                        return (
                                            <TableRow key={detail.flower_id}>
                                                <TableCell>{flowerName}</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        value={detail.quantity}
                                                        onChange={e => handleDetailChange(detail.flower_id, "quantity", parseInt(e.target.value) || 1)}
                                                        inputProps={{ min: 1 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        value={detail.import_price}
                                                        onChange={e => handleDetailChange(detail.flower_id, "import_price", parseFloat(e.target.value) || 0)}
                                                        inputProps={{ min: 0 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {(detail.quantity * detail.import_price).toLocaleString()} đ
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleRemoveFlower(detail.flower_id)}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button onClick={handleSubmit} variant="contained" color="success">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog cấu hình tự động */}
            <Dialog open={openAutoDialog} onClose={() => setOpenAutoDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Cấu hình tự động nhập phiếu</DialogTitle>
                <DialogContent>
                    {/* Thêm input cho import_date */}
                    <TextField
                        label="Ngày nhập"
                        type="date"
                        value={autoConfig.import_date}
                        onChange={e => setAutoConfig({ ...autoConfig, import_date: e.target.value })}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        label="Giờ chạy (HH:mm)"
                        type="time"
                        value={autoConfig.run_time}
                        onChange={e => setAutoConfig({ ...autoConfig, run_time: e.target.value })}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            value={autoConfig.enabled ? 1 : 0}
                            onChange={e => setAutoConfig({ ...autoConfig, enabled: !!e.target.value })}
                            label="Trạng thái"
                        >
                            <MenuItem value={1}>Bật</MenuItem>
                            <MenuItem value={0}>Tắt</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Phần chọn hoa cho cấu hình tự động */}
                    <Box sx={{ mt: 3, position: 'relative' }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Chọn hoa cho phiếu nhập tự động
                        </Typography>

                        <TextField
                            label="Tìm kiếm hoa"
                            value={autoFlowerSearch}
                            onChange={(e) => setAutoFlowerSearch(e.target.value)}
                            onFocus={() => setAutoFlowerDropdownOpen(true)}
                            fullWidth
                            margin="normal"
                            size="small"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Search />
                                    </InputAdornment>
                                )
                            }}
                        />

                        {/* Dropdown menu cho danh sách hoa */}
                        {autoFlowerDropdownOpen && (
                            <Paper
                                variant="outlined"
                                sx={{
                                    position: 'absolute',
                                    zIndex: 1000,
                                    width: '100%',
                                    maxHeight: 300,
                                    overflow: 'auto',
                                    mt: 0.5,
                                    boxShadow: 3
                                }}
                            >
                                <Box display="flex" justifyContent="flex-end" p={1}>
                                    <Button
                                        size="small"
                                        onClick={() => setAutoFlowerDropdownOpen(false)}
                                    >
                                        Đóng
                                    </Button>
                                </Box>
                                <List dense>
                                    {filteredAutoFlowers.length === 0 ? (
                                        <ListItem>
                                            <ListItemText primary="Không tìm thấy hoa phù hợp" />
                                        </ListItem>
                                    ) : (
                                        filteredAutoFlowers.map((flower) => {
                                            const isSelected = isAutoFlowerSelected(flower.id);

                                            return (
                                                <React.Fragment key={flower.id}>
                                                    <ListItem
                                                        button
                                                        onClick={() => handleAddAutoFlower(flower)}
                                                    >
                                                        <ListItemIcon>
                                                            <Checkbox
                                                                edge="start"
                                                                checked={isSelected}
                                                                tabIndex={-1}
                                                                disableRipple
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={flower.name}
                                                            secondary={`Giá: ${Number(flower.price).toLocaleString()} đ`}
                                                        />
                                                        {isSelected && (
                                                            <Box display="flex" alignItems="center" gap={1}>
                                                                <TextField
                                                                    label="SL"
                                                                    type="number"
                                                                    size="small"
                                                                    value={autoConfig.details.find(d => d.flower_id === flower.id)?.quantity || 10}
                                                                    onChange={(e) => {
                                                                        e.stopPropagation();
                                                                        handleAutoDetailChange(flower.id, "quantity", parseInt(e.target.value) || 10);
                                                                    }}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    inputProps={{ min: 1, style: { width: '50px' } }}
                                                                />
                                                                <TextField
                                                                    label="Giá"
                                                                    type="number"
                                                                    size="small"
                                                                    value={autoConfig.details.find(d => d.flower_id === flower.id)?.import_price || 0}
                                                                    onChange={(e) => {
                                                                        e.stopPropagation();
                                                                        handleAutoDetailChange(flower.id, "import_price", parseFloat(e.target.value) || 0);
                                                                    }}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    inputProps={{ min: 0, style: { width: '80px' } }}
                                                                />
                                                            </Box>
                                                        )}
                                                    </ListItem>
                                                    <Divider />
                                                </React.Fragment>
                                            );
                                        })
                                    )}
                                </List>
                            </Paper>
                        )}
                    </Box>

                    {/* Hiển thị danh sách hoa đã chọn cho auto config */}
                    {autoConfig.details.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Danh sách hoa sẽ tự động nhập ({autoConfig.details.length})
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tên hoa</TableCell>
                                        <TableCell>Số lượng</TableCell>
                                        <TableCell>Giá nhập</TableCell>
                                        <TableCell>Thành tiền</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {autoConfig.details.map((detail) => {
                                        const flower = flowers.find(f => f.id === detail.flower_id);
                                        const flowerName = flower ? flower.name : detail.flower_name || "Không xác định";
                                        return (
                                            <TableRow key={detail.flower_id}>
                                                <TableCell>{flowerName}</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        value={detail.quantity}
                                                        onChange={e => handleAutoDetailChange(detail.flower_id, "quantity", parseInt(e.target.value) || 10)}
                                                        inputProps={{ min: 1 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        value={detail.import_price}
                                                        onChange={e => handleAutoDetailChange(detail.flower_id, "import_price", parseFloat(e.target.value) || 0)}
                                                        inputProps={{ min: 0 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {(detail.quantity * detail.import_price).toLocaleString()} đ
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleRemoveAutoFlower(detail.flower_id)}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Box>
                    )}

                    {/* Hiển thị thông tin cấu hình hiện tại nếu có */}
                    <Box sx={{ mt: 3, mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            Cấu hình hiện tại:
                        </Typography>
                        <Typography>
                            Ngày nhập: {autoConfig.import_date || 'Chưa cấu hình'}
                        </Typography>
                        <Typography>
                            Giờ chạy: {autoConfig.run_time || 'Chưa cấu hình'}
                        </Typography>
                        <Typography>
                            Trạng thái: {autoConfig.enabled ? 'Bật' : 'Tắt'}
                        </Typography>
                        <Typography>
                            Số loại hoa: {autoConfig.details?.length || 0}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAutoDialog(false)}>Hủy</Button>
                    <Button variant="contained" onClick={handleSaveAutoConfig}>Lưu</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminReceipt;