import React, { useEffect, useState } from "react";
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {
    getDiscounts,
    createDiscount,
    updateDiscount,
    deleteDiscount
} from "../../services/discountService";

const AdminDiscount = () => {
    const [discounts, setDiscounts] = useState([]);
    // Removed unused loading state
    const [openDialog, setOpenDialog] = useState(false);
    const [editDiscount, setEditDiscount] = useState(null);
    const [form, setForm] = useState({ name: "", value: "", type: "fixed" });

    const fetchDiscounts = async () => {
        try {
            const res = await getDiscounts();
            setDiscounts(res.data.data || []);
        } catch (e) {
            console.error(e);
            alert("Lỗi khi tải danh sách mã giảm giá");
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const handleOpenAdd = () => {
        setEditDiscount(null);
        setForm({ name: "", value: "", type: "fixed" });
        setOpenDialog(true);
    };

    const handleOpenEdit = (discount) => {
        setEditDiscount(discount);
        setForm({
            name: discount.name,
            value: discount.value,
            type: discount.type
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            if (editDiscount) {
                await updateDiscount(editDiscount.id, form);
            } else {
                await createDiscount(form);
            }
            setOpenDialog(false);
            fetchDiscounts();
        } catch (e) {
            console.error(e);
            alert("Lỗi khi lưu mã giảm giá");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
        try {
            await deleteDiscount(id);
            fetchDiscounts();
        } catch (e) {
            console.error(e);
            alert("Lỗi khi xóa mã giảm giá");
        }
    };

    return (
        <Box maxWidth="900px" mx="auto" mt={4}>
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
                            <TableCell>Tên mã</TableCell>
                            <TableCell>Loại</TableCell>
                            <TableCell>Giá trị</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {discounts.map((d) => (
                            <TableRow key={d.id}>
                                <TableCell>{d.name}</TableCell>
                                <TableCell>{d.type === "fixed" ? "Tiền mặt" : "Phần trăm"}</TableCell>
                                <TableCell>
                                    {d.type === "fixed"
                                        ? Number(d.value).toLocaleString() + "đ"
                                        : d.value + "%"}
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
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        type="number"
                    />
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

export default AdminDiscount;