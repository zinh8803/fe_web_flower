import React, { useEffect, useState } from "react";
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, FormControlLabel, Switch
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {
    getDiscounts,
    createDiscount,
    updateDiscount,
    deleteDiscount
} from "../../services/discountService";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/notificationSlice";
import ConfirmDeleteDialog from "../../component/dialog/admin/ConfirmDeleteDialog";
const AdminDiscount = () => {
    const [discounts, setDiscounts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editDiscount, setEditDiscount] = useState(null);
    const [form, setForm] = useState({
        name: "",
        value: "",
        type: "fixed",
        start_date: "",
        end_date: "",
        min_total: "",
        status: true,
    });
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const dispatch = useDispatch();
    const fetchDiscounts = async () => {
        try {
            const res = await getDiscounts();
            setDiscounts(res.data.data || []);
        } catch (e) {
            console.error(e);
            dispatch(showNotification({
                message: "Lỗi khi tải mã giảm giá",
                severity: "error"
            }));
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const handleOpenAdd = () => {
        const today = new Date().toISOString().slice(0, 10);
        setEditDiscount(null);
        setForm({
            name: "",
            value: "",
            type: "fixed",
            start_date: today,
            end_date: "",
            status: true,
            min_total: "",
        });
        setOpenDialog(true);
    };

    const handleOpenEdit = (discount) => {
        setEditDiscount(discount);
        setForm({
            name: discount.name,
            value: discount.value,
            type: discount.type,
            start_date: discount.start_date ? discount.start_date.slice(0, 10) : "",
            end_date: discount.end_date ? discount.end_date.slice(0, 10) : "",
            status: discount.status === 1 || discount.status === true,
            min_total: discount.min_total || "",
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async () => {
        try {
            const data = {
                ...form,
                status: form.status ? 1 : 0,
            };
            if (editDiscount) {
                await updateDiscount(editDiscount.id, data);
                dispatch(showNotification({
                    message: "Cập nhật mã giảm giá thành công",
                    severity: "success"
                }));
            } else {
                await createDiscount(data);
                dispatch(showNotification({
                    message: "Thêm mã giảm giá thành công",
                    severity: "success"
                }));
            }
            setOpenDialog(false);
            fetchDiscounts();
        } catch (e) {
            console.error(e);
            const errorMessage = e.response?.data?.message || "Lỗi khi lưu mã giảm giá";
            dispatch(showNotification({
                message: errorMessage,
                severity: "error"
            }));
        }
    };

    const handleDelete = async (id) => {
        setConfirmDeleteId(id);
    };
    const handleConfirmDelete = async () => {
        try {
            await deleteDiscount(confirmDeleteId);
            fetchDiscounts();
            dispatch(showNotification({
                message: "Xóa mã giảm giá thành công",
                severity: "success"
            }));
        } catch (e) {
            console.error(e);
            dispatch(showNotification({
                message: "Lỗi khi xóa mã giảm giá",
                severity: "error"
            }));
        }
        setConfirmDeleteId(null);
    };

    const handleCancelDelete = () => setConfirmDeleteId(null);
    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Quản lý mã giảm giá
            </Typography>
            <Button variant="contained" color="success" onClick={handleOpenAdd} sx={{ mb: 2 }}>
                Thêm mã giảm giá
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Tên mã</TableCell>
                            <TableCell>Loại</TableCell>
                            <TableCell>Giá trị</TableCell>
                            <TableCell>Giá trị tối thiểu</TableCell>
                            <TableCell>Ngày bắt đầu</TableCell>
                            <TableCell>Ngày kết thúc</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {discounts.map((d, index) => (
                            <TableRow key={d.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{d.name}</TableCell>
                                <TableCell>{d.type === "fixed" ? "Tiền mặt" : "Phần trăm"}</TableCell>
                                <TableCell>
                                    {d.type === "fixed"
                                        ? Number(d.value).toLocaleString() + "đ"
                                        : d.value + "%"}
                                </TableCell>
                                <TableCell>
                                    {d.min_total ? Number(d.min_total).toLocaleString() + "đ" : "Không yêu cầu"}
                                </TableCell>
                                <TableCell>{d.start_date ? d.start_date.slice(0, 10) : ""}</TableCell>
                                <TableCell>{d.end_date ? d.end_date.slice(0, 10) : ""}</TableCell>
                                <TableCell>
                                    {d.status ? "Đang hoạt động" : "Ngừng hoạt động"}
                                </TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleOpenEdit(d)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(d.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{editDiscount ? "Sửa mã giảm giá" : "Thêm mã giảm giá"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Tên mã"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Loại"
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        fullWidth
                        margin="normal"
                    >
                        <option value="fixed">Tiền mặt</option>
                        <option value="percent">Phần trăm</option>
                    </TextField>
                    <TextField
                        label="Giá trị"
                        name="value"
                        value={form.value}
                        onChange={e => {
                            const val = Number(e.target.value);
                            setForm({ ...form, value: val < 0 ? 0 : val });
                        }}
                        fullWidth
                        margin="normal"
                        type="number"
                        inputProps={{ min: 0 }}
                    />
                    <TextField
                        label="Giá trị tối thiểu"
                        name="min_total"
                        value={form.min_total}
                        onChange={e => {
                            const val = Number(e.target.value);
                            setForm({ ...form, min_total: val < 0 ? 0 : val });
                        }}
                        fullWidth
                        margin="normal"
                        type="number"
                        inputProps={{ min: 0 }}
                    />
                    <TextField
                        label="Ngày bắt đầu"
                        name="start_date"
                        type="date"
                        value={form.start_date}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Ngày kết thúc"
                        name="end_date"
                        type="date"
                        value={form.end_date}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    {editDiscount && (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={form.status}
                                    onChange={handleChange}
                                    name="status"
                                    color="success"
                                />
                            }
                            label="Đang hoạt động"
                            sx={{ mt: 2 }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button onClick={handleSubmit} variant="contained" color="success">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
            <ConfirmDeleteDialog
                open={!!confirmDeleteId}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                content="Bạn chắc chắn muốn xóa mã giảm giá này?"
            />
        </Box>
    );
};

export default AdminDiscount;