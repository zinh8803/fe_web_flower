import React, { useEffect, useState } from "react";
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {
    getFlowerTypes,
    createFlowerType,
    updateFlowerType,
    deleteFlowerType
} from "../../services/flowerTypeService";

const AdminFlowerType = () => {
    const [types, setTypes] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editType, setEditType] = useState(null);
    const [form, setForm] = useState({ name: "" });

    const fetchTypes = async () => {
        try {
            const res = await getFlowerTypes();
            setTypes(res.data.data || []);
        } catch {
            alert("Lỗi khi tải loại hoa");
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    const handleOpenAdd = () => {
        setEditType(null);
        setForm({ name: "" });
        setOpenDialog(true);
    };

    const handleOpenEdit = (type) => {
        setEditType(type);
        setForm({ name: type.name });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            if (editType) {
                await updateFlowerType(editType.id, form);
            } else {
                await createFlowerType(form);
            }
            setOpenDialog(false);
            fetchTypes();
        } catch {
            alert("Lỗi khi lưu loại hoa");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
        try {
            await deleteFlowerType(id);
            fetchTypes();
        } catch {
            alert("Lỗi khi xóa loại hoa");
        }
    };

    return (
        <Box >
            <Typography variant="h5" fontWeight={700} mb={3}>
                Quản lý loại hoa
            </Typography>
            <Button variant="contained" color="success" onClick={handleOpenAdd} sx={{ mb: 2 }}>
                Thêm loại hoa
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Tên loại hoa</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {types.map((type, index) => (
                            <TableRow key={type.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{type.name}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleOpenEdit(type)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(type.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{editType ? "Sửa loại hoa" : "Thêm loại hoa"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Tên loại hoa"
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

export default AdminFlowerType;