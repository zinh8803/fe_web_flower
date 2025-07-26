import React, { useEffect, useState } from "react";
import { getallUsersSubScriber } from "../../services/userService";
import { getDiscounts, sendDiscountToSubscribers } from "../../services/discountService";
import {
    Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper,
    TableContainer, Pagination, Avatar, Chip, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, Checkbox, FormControlLabel, Alert, Snackbar,
    Grid, Card, CardContent, Divider, List, ListItem, ListItemText, CircularProgress
} from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import { Link } from "react-router-dom";
import { showNotification } from "../../store/notificationSlice";
import { useDispatch } from "react-redux";
const AdminSubscribers = () => {
    const dispatch = useDispatch();
    const [subscribers, setSubscribers] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [selectedDiscounts, setSelectedDiscounts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSubscribers(page);
        fetchDiscounts();
    }, [page]);

    const fetchSubscribers = async (pageNum) => {
        try {
            const res = await getallUsersSubScriber(pageNum);
            setSubscribers(res.data.data);
            setTotalPages(res.data.meta.last_page);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách người đăng ký:", err);
            setSubscribers([]);
        }
    };

    const fetchDiscounts = async () => {
        try {
            const res = await getDiscounts();
            const activeDiscounts = res.data.data.filter(discount =>
                discount.status && new Date(discount.end_date) >= new Date()
            );
            setDiscounts(activeDiscounts);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách mã giảm giá:", err);
            setDiscounts([]);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleOpenSendDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSelectDiscount = (discountId) => {
        setSelectedDiscounts(prev => {
            if (prev.includes(discountId)) {
                return prev.filter(id => id !== discountId);
            } else {
                return [...prev, discountId];
            }
        });
    };

    const handleSendDiscounts = async () => {
        if (selectedDiscounts.length === 0) {
            dispatch(showNotification({
                message: 'Vui lòng chọn ít nhất 1 mã giảm giá để gửi',
                severity: 'warning'
            }));
            return;
        }

        setLoading(true);
        try {
            await sendDiscountToSubscribers({ discount_ids: selectedDiscounts });
            dispatch(showNotification({
                message: "Đã gửi mã giảm giá đến người đăng ký thành công!",
                severity: "success"
            }));
            setOpenDialog(false);
            setSelectedDiscounts([]);
        } catch (error) {
            console.error("Lỗi khi gửi mã giảm giá:", error);
            dispatch(showNotification({
                message: 'Có lỗi xảy ra khi gửi mã giảm giá',
                severity: 'error'
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight={700}>
                    Quản lý người đăng ký nhận mã giảm giá
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EmailIcon />}
                    onClick={handleOpenSendDialog}
                    disabled={subscribers.length === 0}
                >
                    Gửi mã giảm giá
                </Button>
            </Box>

            {/* Hiển thị số lượng người đăng ký */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Tổng số người đăng ký
                            </Typography>
                            <Typography variant="h3" color="primary">
                                {subscribers.length > 0 ? subscribers.length : 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Mã giảm giá có sẵn
                            </Typography>
                            <Typography variant="h3" color="secondary">
                                {discounts.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Avatar</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Điện thoại</TableCell>
                            <TableCell>Vai trò</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Đăng ký từ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subscribers.length > 0 ? (
                            subscribers.map((user, index) => (
                                <TableRow key={user.id}>
                                    <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                                    <TableCell>
                                        <Avatar src={user.image_url} alt={user.name} />
                                    </TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone || "-"}</TableCell>
                                    <TableCell>
                                        <Chip label={user.role} color={user.role === "admin" ? "success" : "default"} size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label="Đã đăng ký"
                                            color="success"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(user.updated_at).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography variant="body1" sx={{ py: 2 }}>
                                        Chưa có người dùng nào đăng ký nhận thông báo
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {subscribers.length > 0 && (
                <Box display="flex" justifyContent="center" mt={3}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}

            {/* Dialog chọn mã giảm giá để gửi */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6">Chọn mã giảm giá để gửi</Typography>
                </DialogTitle>
                <DialogContent>
                    {discounts.length > 0 ? (
                        <List>
                            {discounts.map((discount) => (
                                <React.Fragment key={discount.id}>
                                    <ListItem
                                        button
                                        onClick={() => handleSelectDiscount(discount.id)}
                                        selected={selectedDiscounts.includes(discount.id)}
                                        sx={{
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '4px',
                                            mb: 1,
                                            backgroundColor: selectedDiscounts.includes(discount.id)
                                                ? 'rgba(25, 118, 210, 0.08)'
                                                : 'transparent'
                                        }}
                                    >
                                        <Checkbox
                                            checked={selectedDiscounts.includes(discount.id)}
                                            color="primary"
                                        />
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {discount.name}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" component="span">
                                                        Giá trị: {
                                                            discount.type === 'percent'
                                                                ? `${discount.value}%`
                                                                : `${discount.value.toLocaleString()}đ`
                                                        }
                                                    </Typography>
                                                    <br />
                                                    <Typography variant="body2" component="span">
                                                        Đơn tối thiểu: {
                                                            discount.min_total > 0
                                                                ? `${discount.min_total.toLocaleString()}đ`
                                                                : 'Không giới hạn'
                                                        }
                                                    </Typography>
                                                    <br />
                                                    <Typography variant="body2" component="span">
                                                        Hạn dùng: {new Date(discount.end_date).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <Chip
                                            label={selectedDiscounts.includes(discount.id) ? "Đã chọn" : "Chọn"}
                                            color={selectedDiscounts.includes(discount.id) ? "primary" : "default"}
                                            size="small"
                                        />
                                    </ListItem>
                                </React.Fragment>
                            ))}
                        </List>
                    ) : (
                        <Alert severity="info">
                            Không có mã giảm giá nào còn hiệu lực. Vui lòng tạo mã giảm giá mới.
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="inherit">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSendDiscounts}
                        color="primary"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        disabled={selectedDiscounts.length === 0 || loading}
                    >
                        {loading ? 'Đang gửi...' : 'Gửi mã giảm giá'}
                    </Button>
                </DialogActions>
            </Dialog>


        </Box>
    );
};

export default AdminSubscribers;