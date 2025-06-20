import React, { useEffect, useState } from "react";
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {
    getFlower,
    createFlower,
    updateFlower,
    deleteFlower
} from "../../services/flowerService";

const AdminFlower = () => {
    const [flowers, setFlowers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editFlower, setEditFlower] = useState(null);
    const [form, setForm] = useState({ name: "", description: "" });

    const fetchFlowers = async () => {
        try {
            const res = await getFlower();
            setFlowers(res.data.data || []);
        } catch {
            alert("Lỗi khi tải hoa");
        }
    };

    useEffect(() => {
        fetchFlowers();
    }, []);

    const handleOpenAdd = () => {
        setEditFlower(null);
        setForm({ name: "", description: "" });
        setOpenDialog(true);
    };

    const handleOpenEdit = (flower) => {
        setEditFlower(flower);
        setForm({ name: flower.name, description: flower.description || "" });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            if (editFlower) {
                await updateFlower(editFlower.id, form);
            } else {
                await createFlower(form);
            }
            setOpenDialog(false);
            fetchFlowers();
        } catch {
            alert("Lỗi khi lưu hoa");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
        try {
            await deleteFlower(id);
            fetchFlowers();
        } catch {
            alert("Lỗi khi xóa hoa");
        }
    };

    return (
        <Box maxWidth="700px" mx="auto" mt={4}>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Quản lý hoa
            </Typography>
            <Button variant="contained" color="success" onClick={handleOpenAdd} sx={{ mb: 2 }}>
                Thêm hoa
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên hoa</TableCell>
                            <TableCell>Mô tả</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {flowers.map((flower) => (
                            <TableRow key={flower.id}>
                                <TableCell>{flower.name}</TableCell>
                                <TableCell>{flower.description}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleOpenEdit(flower)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(flower.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{editFlower ? "Sửa hoa" : "Thêm hoa"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Tên hoa"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Mô tả"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
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

export default AdminFlower;
