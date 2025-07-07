import React, { useEffect, useState } from "react";
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Pagination,
    Autocomplete, Stack, Chip, FormControl, InputLabel, Select, MenuItem,
    Checkbox, InputAdornment, List, ListItem, ListItemText, ListItemIcon, Divider
} from "@mui/material";
import { getImportReceiptById, getImportReceipts, importReceipts, updateImportReceipt } from "../../services/importReceiptsService";
import { getFlower } from "../../services/flowerService";
import { Add, Delete, Edit, KeyboardArrowDown, KeyboardArrowUp, Search } from "@mui/icons-material";

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
    // Thêm state để tìm kiếm phiếu nhập
    const [searchQuery, setSearchQuery] = useState("");
    // Thêm state để kiểm soát việc hiển thị dropdown
    const [flowerDropdownOpen, setFlowerDropdownOpen] = useState(false);

    useEffect(() => {
        fetchReceipts(page);
    }, [page]);

    const fetchReceipts = async (pageNum = 1) => {
        try {
            const res = await getImportReceipts(pageNum, fromDate, toDate, searchQuery);
            setReceipts(res.data.data || []);
            setTotalPages(res.data.meta ? res.data.meta.last_page : 1);
        } catch {
            alert("Lỗi khi tải phiếu nhập");
        }
    };

    // Lọc danh sách hoa theo từ khóa tìm kiếm
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

    // Xử lý chọn hoa
    // const handleCheckFlower = (flower) => {
    //     const exists = form.details.find(d => d.flower_id === flower.id);
    //     if (exists) {
    //         setForm({
    //             ...form,
    //             details: form.details.filter(d => d.flower_id !== flower.id)
    //         });
    //     } else {
    //         setForm({
    //             ...form,
    //             details: [
    //                 ...form.details,
    //                 {
    //                     flower_id: flower.id,
    //                     quantity: 1,
    //                     import_price: flower.price || 0,
    //                     status: "hoa tươi"
    //                 }
    //             ]
    //         });
    //     }
    // };

    const handleDetailChange = (flower_id, field, value) => {
        setForm({
            ...form,
            details: form.details.map(d =>
                d.flower_id === flower_id ? { ...d, [field]: value } : d
            )
        });
    };

    // Hàm mới để thêm hoa đã chọn vào danh sách
    const handleAddFlowerToList = () => {
        if (!selectedFlower) return;

        // Kiểm tra xem hoa đã có trong danh sách chưa
        const exists = form.details.find(d => d.flower_id === selectedFlower.id);
        if (exists) {
            // Cập nhật số lượng và giá nếu đã tồn tại
            setForm({
                ...form,
                details: form.details.map(d =>
                    d.flower_id === selectedFlower.id
                        ? { ...d, quantity: parseInt(quantity), import_price: parseFloat(importPrice) }
                        : d
                )
            });
        } else {
            // Thêm mới nếu chưa tồn tại
            setForm({
                ...form,
                details: [
                    ...form.details,
                    {
                        flower_id: selectedFlower.id,
                        quantity: parseInt(quantity),
                        import_price: parseFloat(importPrice),
                        status: "hoa tươi",
                        flower_name: selectedFlower.name // Thêm tên để hiển thị
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
        </Box>
    );
};

export default AdminReceipt;