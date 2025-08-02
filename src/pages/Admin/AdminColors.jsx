import React, { useEffect, useState } from "react";
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {
    getColor,
    createColor,
    updateColor,
    deleteColor
} from "../../services/ColorService";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/notificationSlice";
import ConfirmDeleteDialog from "../../component/dialog/admin/ConfirmDeleteDialog";

const AdminColors = () => {
    const [colors, setColors] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editColor, setEditColor] = useState(null);
    const [form, setForm] = useState({ name: "", hex_code: "" });
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const dispatch = useDispatch();

    const fetchColors = async () => {
        try {
            const res = await getColor();
            setColors(res.data.data || []);
        } catch {
            dispatch(showNotification({
                message: "Lỗi khi tải màu hoa",
                severity: "error"
            }));
        }
    };

    useEffect(() => {
        fetchColors();
    }, []);

    const handleOpenAdd = () => {
        setEditColor(null);
        setForm({ name: "" });
        setOpenDialog(true);
    };

    const handleOpenEdit = (color) => {
        setEditColor(color);
        setForm({ name: color.name, hex_code: color.hex_code });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            if (editColor) {
                await updateColor(editColor.id, form);
                dispatch(showNotification({
                    message: "Cập nhật màu hoa thành công!",
                    severity: "success"
                }));
            } else {
                await createColor(form);
                dispatch(showNotification({
                    message: "Thêm màu hoa thành công!",
                    severity: "success"
                }));
            }
            setOpenDialog(false);
            fetchColors();
        } catch {
            dispatch(showNotification({
                message: "Lỗi khi lưu màu hoa",
                severity: "error"
            }));
        }
    };

    const handleDelete = async (id) => {
        setConfirmDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteColor(confirmDeleteId);
            fetchColors();
            dispatch(showNotification({
                message: "Xóa màu hoa thành công!",
                severity: "success"
            }));
        } catch {
            dispatch(showNotification({
                message: "Màu hoa đã có sản phẩm, không thể xóa",
                severity: "error"
            }));
        }
        setConfirmDeleteId(null);
    };

    const handleCancelDelete = () => setConfirmDeleteId(null);

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Quản lý màu hoa
            </Typography>
            <Button variant="contained" color="success" onClick={handleOpenAdd} sx={{ mb: 2 }}>
                Thêm màu hoa
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Tên màu</TableCell>
                            <TableCell>Mã màu</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {colors.map((color, index) => (
                            <TableRow key={color.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{color.name}</TableCell>
                                <TableCell>{color.hex_code}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleOpenEdit(color)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(color.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{editColor ? "Sửa màu hoa" : "Thêm màu hoa"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Tên màu hoa"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Mã màu hoa"
                        name="hex_code"
                        value={form.hex_code}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
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
            />
        </Box>
    );
};

export default AdminColors;