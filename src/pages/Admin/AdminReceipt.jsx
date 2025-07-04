import React, { useEffect, useState } from "react";
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, TextField,
    Pagination
} from "@mui/material";
import { getImportReceiptById, getImportReceipts, importReceipts, updateImportReceipt } from "../../services/importReceiptsService";
import { getFlower } from "../../services/flowerService";
import { Edit, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const AdminReceipt = () => {
    const [receipts, setReceipts] = useState([]);
    // State tìm kiếm hoa cho popup
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
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    useEffect(() => {
        fetchReceipts(page);
    }, [page]);

    const fetchReceipts = async (pageNum = 1) => {
        try {
            const res = await getImportReceipts(pageNum, fromDate, toDate);
            setReceipts(res.data.data || []);
            setTotalPages(res.data.meta ? res.data.meta.last_page : 1);
        } catch {
            alert("Lỗi khi tải phiếu nhập");
        }
    };

    // Lấy danh sách hoa khi mở dialog
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
            setFlowerSearch(""); // reset tìm kiếm khi mở dialog
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
    const handleCheckFlower = (flower) => {
        const exists = form.details.find(d => d.flower_id === flower.id);
        if (exists) {
            setForm({
                ...form,
                details: form.details.filter(d => d.flower_id !== flower.id)
            });
        } else {
            setForm({
                ...form,
                details: [
                    ...form.details,
                    {
                        flower_id: flower.id,
                        quantity: 1,
                        import_price: flower.price || 0,
                        status: "hoa tươi"
                    }
                ]
            });
        }
    };

    const handleDetailChange = (flower_id, field, value) => {
        setForm({
            ...form,
            details: form.details.map(d =>
                d.flower_id === flower_id ? { ...d, [field]: value } : d
            )
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

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Quản lý phiếu nhập
            </Typography>
            <Button variant="contained" color="success" sx={{ mb: 2 }} onClick={() => handleOpenDialog()}>
                Thêm phiếu nhập
            </Button>
            <Box display="flex" gap={2} mb={2}>
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
                <DialogTitle>Thêm phiếu nhập</DialogTitle>
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
                    <Typography variant="subtitle1" mt={2} mb={1}>Chọn hoa nhập kho</Typography>
                    <TextField
                        size="small"
                        placeholder="Tìm kiếm hoa..."
                        value={flowerSearch}
                        onChange={e => setFlowerSearch(e.target.value)}
                        sx={{ mb: 1, width: 300 }}
                    />
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Tên hoa</TableCell>
                                <TableCell>Số lượng</TableCell>
                                <TableCell>Giá nhập</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {flowers.filter(f => f.name.toLowerCase().includes(flowerSearch.toLowerCase())).map(flower => {
                                const detail = form.details.find(d => d.flower_id === flower.id);
                                return (
                                    <TableRow key={flower.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={!!detail}
                                                onChange={() => handleCheckFlower(flower)}
                                            />
                                        </TableCell>
                                        <TableCell>{flower.name}</TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                size="small"
                                                value={detail ? detail.quantity : ""}
                                                onChange={e => handleDetailChange(flower.id, "quantity", e.target.value)}
                                                disabled={!detail}
                                                inputProps={{ min: 1 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                size="small"
                                                value={detail ? detail.import_price : ""}
                                                onChange={e => handleDetailChange(flower.id, "import_price", e.target.value)}
                                                disabled={!detail}
                                                inputProps={{ min: 0 }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
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