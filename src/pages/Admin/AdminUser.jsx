import React, { useEffect, useState } from "react";
import { getAllUsers, updateUserStatus } from "../../services/userService";
import {
    Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, Pagination, Avatar, Chip,
    CircularProgress
} from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { LockOpenIcon } from "lucide-react";
import { Unlock } from "lucide-react";
import { UnlockIcon } from "lucide-react";
import { LockIcon } from "lucide-react";

const AdminUser = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingLockId, setLoadingLockId] = useState(null);


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

    const handleUpdateStatus = async (id) => {
        setLoadingLockId(id);
        try {
            await updateUserStatus(id);
            fetchUsers(page);
        } catch (err) {
            console.error("Error updating user status:", err);
        }
        setLoadingLockId(null);
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Quản lý người dùng
            </Typography>


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
                        {users.map((user, index) => (
                            <TableRow key={user.id} sx={{ backgroundColor: user.status === 0 ? '#EEEEEE' : 'inherit' }}>
                                <TableCell>{index + 1}</TableCell>
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
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color={user.status === 1 ? "error" : "success"}
                                        onClick={() => handleUpdateStatus(user.id)}
                                        disabled={loadingLockId === user.id}
                                    >
                                        {loadingLockId === user.id ? <CircularProgress size={24} /> : user.status === 1 ? <LockOpenIcon /> : <LockIcon />}
                                    </Button>
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