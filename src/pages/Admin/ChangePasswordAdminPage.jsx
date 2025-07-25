import { Box, Button, TextField, Typography, CircularProgress, Card, CardContent, Stack, IconButton, InputAdornment } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showNotification } from '../../store/notificationSlice';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Breadcrumb from '../../component/breadcrumb/Breadcrumb';
import { changePasswordAdmin } from '../../services/Employee';

const ChangePasswordAdminPage = () => {
    document.title = 'Đổi mật khẩu Admin';
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const dispatch = useDispatch();
    const admin = useSelector((state) => state.user.user);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            dispatch(showNotification({ message: "Mật khẩu mới và xác nhận không khớp!", severity: "error" }));
            return;
        }

        setLoading(true);
        console.log("Payload gửi lên:", {
            admin_id: admin.id,
            currentPassword,
            newPassword,
            confirmPassword
        });

        try {
            await changePasswordAdmin(currentPassword, newPassword, confirmPassword);
            dispatch(showNotification({ message: "Đổi mật khẩu thành công!", severity: "success" }));
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            const message = error.response?.data?.message || "Đổi mật khẩu thất bại!";
            dispatch(showNotification({ message: message.toString(), severity: "error" }));
            console.error("Đổi mật khẩu thất bại:", error);
            if (error.response) {
                console.log("Lỗi 422 trả về:", error.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxWidth="1450px" mx="auto" mt={4}>

            <Typography variant="h5" fontWeight={700} mb={3}>
                Đổi mật khẩu Admin
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Mật khẩu hiện tại"
                    type={showCurrent ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle current password visibility"
                                    onClick={() => setShowCurrent((show) => !show)}
                                    edge="end"
                                >
                                    {showCurrent ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    label="Mật khẩu mới"
                    type={showNew ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle new password visibility"
                                    onClick={() => setShowNew((show) => !show)}
                                    edge="end"
                                >
                                    {showNew ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    label="Xác nhận mật khẩu mới"
                    type={showConfirm ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle confirm password visibility"
                                    onClick={() => setShowConfirm((show) => !show)}
                                    edge="end"
                                >
                                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Stack direction="row" spacing={2} mt={2} justifyContent="center">
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Lưu"}
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};

export default ChangePasswordAdminPage;