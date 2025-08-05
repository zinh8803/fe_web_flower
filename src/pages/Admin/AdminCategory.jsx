import React, { useEffect, useState } from "react";
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} from "../../services/categoryService";
import { showNotification } from "../../store/notificationSlice";
import { useDispatch } from "react-redux";
import ConfirmDeleteDialog from "../../component/dialog/admin/ConfirmDeleteDialog";
const AdminCategory = () => {
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const [form, setForm] = useState({ name: "" });
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const dispatch = useDispatch();
    const fetchCategories = async () => {
        try {
            const res = await getCategory();
            setCategories(res.data.data || []);
        } catch {
            dispatch(showNotification({
                message: "Lỗi khi tải danh mục",
                severity: "error"
            }));
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenAdd = () => {
        setEditCategory(null);
        setForm({ name: "" });
        setOpenDialog(true);
    };

    const handleOpenEdit = (cat) => {
        setEditCategory(cat);
        setForm({ name: cat.name });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            if (editCategory) {
                await updateCategory(editCategory.id, form);
                dispatch(showNotification({
                    message: "Cập nhật danh mục thành công!",
                    severity: "success"
                }));
            } else {
                await createCategory(form);
                dispatch(showNotification({
                    message: "Thêm danh mục thành công!",
                    severity: "success"
                }));
            }
            setOpenDialog(false);
            fetchCategories();
        } catch {
            dispatch(showNotification({
                message: "Lỗi khi lưu danh mục",
                severity: "error"
            }));
        }
    };
    const handleDelete = async (id) => {
        setConfirmDeleteId(id);
    };
    const handleConfirmDelete = async () => {
        try {
            await deleteCategory(confirmDeleteId);
            fetchCategories();
            dispatch(showNotification({
                message: "Xóa danh mục thành công!",
                severity: "success"
            }));
        } catch (e) {
            console.error("Lỗi khi xóa danh mục:", e);
            //const errorMessage = e.response?.data?.message || "Lỗi khi xóa danh mục";
            dispatch(showNotification({
                message: "Danh mục đã có sản phẩm, không thể xóa",
                severity: "error"
            }));
        }
        setConfirmDeleteId(null);
    };
    const handleCancelDelete = () => setConfirmDeleteId(null);
    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Quản lý danh mục
            </Typography>
            <Button variant="contained" color="success" onClick={handleOpenAdd} sx={{ mb: 2 }}>
                Thêm danh mục
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên danh mục</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((cat) => (
                            <TableRow key={cat.id}>
                                <TableCell>{cat.name}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleOpenEdit(cat)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(cat.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <ConfirmDeleteDialog
                        open={!!confirmDeleteId}
                        onClose={handleCancelDelete}
                        onConfirm={handleConfirmDelete}
                        content="Bạn chắc chắn muốn xóa danh mục này?"
                    />
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{editCategory ? "Sửa danh mục" : "Thêm danh mục"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Tên danh mục"
                        name="name"
                        value={form.name}
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
        </Box>
    );
};

export default AdminCategory;