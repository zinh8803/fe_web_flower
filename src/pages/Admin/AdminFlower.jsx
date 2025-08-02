import React, { useEffect, useState } from "react";
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, MenuItem
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {
    getFlower,
    createFlower,
    updateFlower,
    deleteFlower
} from "../../services/flowerService";
import { getFlowerTypes } from "../../services/flowerTypeService";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/notificationSlice";
import ConfirmDeleteDialog from "../../component/dialog/admin/ConfirmDeleteDialog";
import { getColor } from "../../services/ColorService";

const AdminFlower = () => {
    const [flowers, setFlowers] = useState([]);
    const [flowerTypes, setFlowerTypes] = useState([]);
    const [colors, setColors] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editFlower, setEditFlower] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        flower_type_id: "",
        color_id: "",
        price: "",
    });
    const dispatch = useDispatch();

    const fetchFlowers = async () => {
        try {
            const res = await getFlower();
            setFlowers(res.data.data || []);
        } catch {
            alert("Lỗi khi tải hoa");
        }
    };

    const fetchFlowerTypes = async () => {
        try {
            const res = await getFlowerTypes();
            setFlowerTypes(res.data.data || []);
        } catch {
            alert("Lỗi khi tải loại hoa");
        }
    };

    const fetchColors = async () => {
        try {
            const res = await getColor();
            setColors(res.data.data || []);
        } catch {
            alert("Lỗi khi tải màu hoa");
        }
    };

    useEffect(() => {
        fetchFlowers();
        fetchFlowerTypes();
        fetchColors();
    }, []);

    const handleOpenAdd = () => {
        setEditFlower(null);
        setForm({
            name: "",
            flower_type_id: "",
            color_id: "",
            price: "",
        });
        setOpenDialog(true);
    };

    const handleOpenEdit = (flower) => {
        setEditFlower(flower);
        setForm({
            name: flower.name,
            description: flower.description || "",
            flower_type_id: flower.flower_type_id || (flower.flower_type && flower.flower_type.id) || "",
            color_id: flower.color_id || (flower.color && flower.color.id) || "",
            price: flower.price || "",
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            if (editFlower) {
                await updateFlower(editFlower.id, form);
                dispatch(showNotification({
                    message: "Cập nhật hoa thành công!",
                    severity: "success"
                }));
            } else {
                await createFlower(form);
                dispatch(showNotification({
                    message: "Thêm hoa thành công!",
                    severity: "success"
                }));
            }
            setOpenDialog(false);
            fetchFlowers();
        } catch (error) {
            console.log(error.response.data);
            const errorMessage = error?.response?.data?.message;
            dispatch(showNotification({
                message: errorMessage,
                severity: "error"
            }));
        }
    };

    const handleDelete = (id) => {
        setConfirmDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteFlower(confirmDeleteId);
            fetchFlowers();
            dispatch(showNotification({
                message: "Xóa hoa thành công!",
                severity: "success"
            }));
        } catch {
            dispatch(showNotification({
                message: "Hoa đã có trong sản phẩm, không thể xóa",
                severity: "error"
            }));
        }
        setConfirmDeleteId(null);
    };

    const handleCancelDelete = () => setConfirmDeleteId(null);

    return (
        <Box>
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
                            <TableCell>STT</TableCell>
                            <TableCell>Tên hoa</TableCell>
                            <TableCell>Loại hoa</TableCell>
                            <TableCell>Màu hoa</TableCell>
                            <TableCell>Giá</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {flowers.map((flower, index) => (
                            <TableRow key={flower.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{flower.name}</TableCell>
                                <TableCell>{flower.flower_type?.name}</TableCell>
                                <TableCell>{flower.color?.name}</TableCell>
                                <TableCell>{Number(flower.price).toLocaleString()} đ</TableCell>
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
                        label="Loại hoa"
                        name="flower_type_id"
                        value={form.flower_type_id}
                        onChange={handleChange}
                        select
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="">Chọn loại hoa</MenuItem>
                        {flowerTypes.map(type => (
                            <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Màu hoa"
                        name="color_id"
                        value={form.color_id}
                        onChange={handleChange}
                        select
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="">Chọn màu hoa</MenuItem>
                        {colors.map(color => (
                            <MenuItem key={color.id} value={color.id}>{color.name}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Giá"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        type="number"
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
                content="Bạn chắc chắn muốn xóa hoa này?"
            />
        </Box>
    );
};

export default AdminFlower;
