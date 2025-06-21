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

const AdminCategory = () => {
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const [form, setForm] = useState({ name: "" });

    const fetchCategories = async () => {
        try {
            const res = await getCategory();
            setCategories(res.data.data || []);
        } catch {
            alert("Lỗi khi tải danh mục");
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
            } else {
                await createCategory(form);
            }
            setOpenDialog(false);
            fetchCategories();
        } catch {
            alert("Lỗi khi lưu danh mục");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
        try {
            await deleteCategory(id);
            fetchCategories();
        } catch {
            alert("Lỗi khi xóa danh mục");
        }
    };

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