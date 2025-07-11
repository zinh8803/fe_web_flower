import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../services/userService";
import {
    Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, Pagination, Avatar, Chip
} from "@mui/material";
import { createEmployee } from "../../services/Employee";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import Button from "@mui/material/Button";

const AdminUser = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "employee",
        status: 1
    });

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const fetchUsers = async (pageNum) => {
        try {
            const res = await getAllUsers(pageNum);
            setUsers(res.data.data);
            setTotalPages(res.data.meta.last_page);
        } catch (err) {
            console.error(err);
            setUsers([]);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await createEmployee(form);
            setOpen(false);
            setForm({
                name: "",
                email: "",
                password: "",
                role: "employee",
                status: 1
            });
            fetchUsers(page);
        } catch (err) {
            console.error(err);
            alert(err);
        }
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Quản lý người dùng
            </Typography>
            <Button variant="contained" color="success" sx={{ mb: 2 }} onClick={handleOpen}>
                Thêm nhân viên
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Thêm nhân viên</DialogTitle>
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
                        fullWidth
                        value={form.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Mật khẩu"
                        name="password"
                        type="password"
                        fullWidth
                        value={form.password}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Huỷ</Button>
                    <Button onClick={handleSubmit} variant="contained">Thêm</Button>
                </DialogActions>
            </Dialog>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Avatar</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Điện thoại</TableCell>
                            <TableCell>Địa chỉ</TableCell>
                            <TableCell>Vai trò</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>
                                    <Avatar src={user.image_url} alt={user.name} />
                                </TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone || "-"}</TableCell>
                                <TableCell>{user.address || "-"}</TableCell>
                                <TableCell>
                                    <Chip label={user.role} color={user.role === "admin" ? "success" : "default"} size="small" />
                                </TableCell>
                                <TableCell>
                                    <Chip label={user.status === 1 ? "Hoạt động" : "Khoá"} color={user.status === 1 ? "success" : "error"} size="small" />
                                </TableCell>
                                <TableCell>
                                    {new Date(user.created_at).toLocaleString()}
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

export default AdminUser;