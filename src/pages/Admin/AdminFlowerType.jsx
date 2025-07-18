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
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/notificationSlice";
import ConfirmDeleteDialog from "../../component/dialog/admin/ConfirmDeleteDialog";
const AdminFlowerType = () => {
    const [types, setTypes] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editType, setEditType] = useState(null);
    const [form, setForm] = useState({ name: "" });
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const dispatch = useDispatch();

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
                dispatch(showNotification({
                    message: "Cập nhật loại hoa thành công!",
                    severity: "success"
                }));
            } else {
                await createFlowerType(form);
                dispatch(showNotification({
                    message: "Thêm loại hoa thành công!",
                    severity: "success"
                }));
            }
            setOpenDialog(false);
            fetchTypes();
        } catch {
            dispatch(showNotification({
                message: "Lỗi khi lưu loại hoa",
                severity: "error"
            }));
        }
    };

    const handleDelete = async (id) => {
        setConfirmDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteFlowerType(confirmDeleteId);
            fetchTypes();
            dispatch(showNotification({
                message: "Xóa loại hoa thành công!",
                severity: "success"
            }));
        } catch {
            dispatch(showNotification({
                message: "Loại hoa đã có sản phẩm, không thể xóa",
                severity: "error"
            }));
        }
        setConfirmDeleteId(null);
    };

    const handleCancelDelete = () => setConfirmDeleteId(null);

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
            <ConfirmDeleteDialog
                open={!!confirmDeleteId}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            />
        </Box>
    );
};

export default AdminFlowerType;