import { Box, Button, TextField, Typography, CircularProgress, Card, CardContent, Stack, IconButton, InputAdornment } from '@mui/material';
import React, { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/notificationSlice';
import { sendResetPassword } from '../../services/mailService';
import { resetPassword } from '../../services/userService';
import { redirect } from 'react-router-dom';

const ResetPassWordPage = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [new_password, setNewPassword] = useState('');
    const [new_password_confirmation, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const dispatch = useDispatch();

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            await sendResetPassword(email);
            dispatch(showNotification({ message: "Đã gửi mã OTP về email!", severity: "success" }));
        } catch (error) {
            console.error("Gửi OTP thất bại:", error);
            const message = error.response?.data?.message || "Gửi OTP thất bại!";
            dispatch(showNotification({ message: message, severity: "error" }));
        }
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (new_password !== new_password_confirmation) {
            dispatch(showNotification({ message: "Mật khẩu mới và xác nhận không khớp!", severity: "error" }));
            return;
        }
        setLoading(true);
        try {
            await resetPassword(email, otp, new_password, new_password_confirmation);
            dispatch(showNotification({ message: "Đặt lại mật khẩu thành công!", severity: "success" }));
            setEmail('');
            setOtp('');
            setNewPassword('');
            setConfirmPassword('');

            redirect('/login');
        } catch (error) {
            const message =
                error.response?.data?.message ||
                    error.response?.data?.status === false
                    ? error.response?.data?.message
                    : "Đặt lại mật khẩu thất bại!";
            console.error("Đặt lại mật khẩu thất bại:", error);
            dispatch(showNotification({ message: message, severity: "error" }));
        }
        setLoading(false);
    };

    return (
        <Box maxWidth="1500px" mx="auto" mt={4}>
            <Card>
                <CardContent>
                    <Typography variant="h5" fontWeight={700} mb={3}>
                        Đặt lại mật khẩu
                    </Typography>
                    <form onSubmit={handleResetPassword}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <Box display="flex" alignItems="center" gap={2}>
                            <TextField
                                label="OTP"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                            />
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleSendOtp}
                                disabled={loading}
                                sx={{ height: 56, minWidth: 120, mt: '8px' }}
                            >
                                Gửi OTP
                            </Button>
                        </Box>
                        <TextField
                            label="Mật khẩu mới"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type={showNew ? "text" : "password"}
                            value={new_password}
                            onChange={e => setNewPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle new password visibility"
                                            onClick={() => setShowNew(show => !show)}
                                            edge="end"
                                        >
                                            {showNew ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Xác nhận mật khẩu"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type={showConfirm ? "text" : "password"}
                            value={new_password_confirmation}
                            onChange={e => setConfirmPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={() => setShowConfirm(show => !show)}
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
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Đặt lại mật khẩu"}
                            </Button>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ResetPassWordPage;