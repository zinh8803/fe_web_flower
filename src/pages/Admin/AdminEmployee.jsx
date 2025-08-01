import React, { useEffect, useState } from "react";
import { getEmployee, createEmployee, updateEmployee } from "../../services/Employee";
import { updateUserStatus } from "../../services/userService";
import {
    Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, Pagination, Avatar, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
    CircularProgress,
    IconButton
} from "@mui/material";
import { showNotification } from "../../store/notificationSlice";
import { useDispatch } from "react-redux";
import ConfirmDeleteDialog from "../../component/dialog/admin/ConfirmDeleteDialog";
import { LockOpenIcon } from "lucide-react";
import { LockIcon } from "lucide-react";
import { Edit } from "@mui/icons-material";
const AdminEmployee = () => {
    const dispatch = useDispatch();
    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [open, setOpen] = useState(false);
    const [loadingLockId, setLoadingLockId] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "employee",
        status: 1
    });

    useEffect(() => {
        fetchEmployees(page);
    }, [page]);

    const fetchEmployees = async (pageNum) => {
        try {
            const res = await getEmployee(pageNum);
            setEmployees(res.data.data);
            setTotalPages(res.data.meta?.last_page || 1);
        } catch (err) {
            console.error(err);
            setEmployees([]);
        }
    };

    const handlePageChange = (event, value) => setPage(value);
    //  const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdateStatus = async (id) => {
        setLoadingLockId(id);
        try {
            await updateUserStatus(id);
            fetchEmployees(page);
            dispatch(showNotification({
                message: "Cập nhật trạng thái nhân viên thành công!",
                severity: "success"
            }));
        } catch (err) {
            console.error(err);
            dispatch(showNotification({
                message: "Cập nhật trạng thái nhân viên thất bại!",
                severity: "error"
            }));
        }
        setLoadingLockId(null);
    };

    const handleSave = async () => {
        try {
            if (form.id) {
                await updateEmployee(form.id, {
                    name: form.name,
                    email: form.email,
                    ...(form.password && { password: form.password }),
                    phone: form.phone,
                    role: form.role,
                    status: form.status
                });
                dispatch(showNotification({
                    message: "Cập nhật nhân viên thành công!",
                    severity: "success"
                }));
            } else {
                await createEmployee(form);
                dispatch(showNotification({
                    message: "Thêm nhân viên thành công!",
                    severity: "success"
                }));
            }
            setOpen(false);
            setForm({
                name: "",
                email: "",
                password: "",
                phone: "",
                role: "employee",
                status: 1
            });
            fetchEmployees(page);
        } catch (err) {
            console.error(err);
            const message = err.response?.data?.message || (form.id ? "Cập nhật nhân viên thất bại!" : "Thêm nhân viên thất bại!");
            dispatch(showNotification({
                message,
                severity: "error"
            }));
        }
    };
    const handleOpenEdit = (employee) => {
        setForm({
            id: employee.id,
            name: employee.name,
            email: employee.email,
            password: "",
            phone: employee.phone || "",
            role: employee.role,
            status: employee.status
        });
        setOpen(true);
    };

    // Khi mở thêm mới, xóa form.id
    const handleOpen = () => {
        setForm({
            name: "",
            email: "",
            phone: "",
            role: "employee",
            status: 1
        });
        setOpen(true);
    };
    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Quản lý nhân viên
            </Typography>
            <Button variant="contained" color="success" sx={{ mb: 2 }} onClick={handleOpen}>
                Thêm nhân viên
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>nhân viên</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Tên"
                        name="name"
                        fullWidth
                        value={form.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        disabled={form.id ? true : false}
                        fullWidth
                        value={form.email}
                        onChange={handleChange}
                    />
                    {form.id && (
                        <TextField
                            margin="dense"
                            label="Mật khẩu"
                            name="password"
                            type="password"
                            fullWidth
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    )}
                    <TextField
                        margin="dense"
                        label="Số điện thoại"
                        name="phone"
                        fullWidth
                        value={form.phone}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Huỷ</Button>
                    <Button onClick={handleSave} variant="contained">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Avatar</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Điện thoại</TableCell>
                            <TableCell>Địa chỉ</TableCell>
                            <TableCell>Vai trò</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((emp, index) => (
                            <TableRow key={emp.id} sx={{ backgroundColor: emp.status === 0 ? '#EEEEEE' : 'inherit' }}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <Avatar src={emp.image_url} alt={emp.name} />
                                </TableCell>
                                <TableCell>{emp.name}</TableCell>
                                <TableCell>{emp.email}</TableCell>
                                <TableCell>{emp.phone || "-"}</TableCell>
                                <TableCell>{emp.address || "-"}</TableCell>
                                <TableCell>
                                    <Chip label={emp.role} color="success" size="small" />
                                </TableCell>
                                <TableCell>
                                    <Chip label={emp.status === 1 ? "Hoạt động" : "Khoá"} color={emp.status === 1 ? "success" : "error"} size="small" />
                                </TableCell>
                                <TableCell>
                                    {new Date(emp.created_at).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        variant="contained"
                                        color={emp.status === 1 ? "error" : "success"}
                                        onClick={() => handleUpdateStatus(emp.id)}
                                        disabled={loadingLockId === emp.id}
                                    >
                                        {loadingLockId === emp.id
                                            ? <CircularProgress size={24} />
                                            : emp.status === 1
                                                ? <LockOpenIcon />
                                                : <LockIcon />}
                                    </IconButton>
                                    <IconButton color="primary" onClick={() => handleOpenEdit(emp)}>
                                        <Edit />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
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
        </Box>
    );
};

export default AdminEmployee;