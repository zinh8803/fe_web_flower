// src/component/LoginDialog.jsx
import React, { useState, useRef } from "react";
import {
    Dialog, DialogContent, TextField, Button, Typography, Box, Link, IconButton, CircularProgress
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import { register, getProfile } from "../../services/userService";
import { sendOtpMail } from "../../services/mailService";
import { showNotification } from "../../store/notificationSlice";

const RegisterDialog = ({ open, onClose, onSwitchToLogin }) => {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        password_confirmation: "",
        otp: ""
    });
    const [otpTimer, setOtpTimer] = useState(0);
    const [loadingOtp, setLoadingOtp] = useState(false);
    const [loadingRegister, setLoadingRegister] = useState(false);
    const [errors, setErrors] = useState({ phone: "", email: "" });
    const timerRef = useRef(null);

    const dispatch = useDispatch();

    const phoneRegex = /^0\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });

        // Kiểm tra lỗi realtime
        if (name === "phone") {
            setErrors(errors => ({
                ...errors,
                phone: value && !phoneRegex.test(value)
                    ? "Số điện thoại phải 10 số và bắt đầu bằng 0"
                    : ""
            }));
        }
        if (name === "email") {
            setErrors(errors => ({
                ...errors,
                email: value && !emailRegex.test(value)
                    ? "Email không đúng định dạng"
                    : ""
            }));
        }
    };

    const handleSendOtp = async () => {
        if (!form.email) {
            dispatch(showNotification({
                message: "Vui lòng nhập email trước!",
                severity: "warning"
            }));
            return;
        }
        setLoadingOtp(true);
        try {
            await sendOtpMail(form.email);
            setOtpTimer(60);
            timerRef.current = setInterval(() => {
                setOtpTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            dispatch(showNotification({
                message: "Đã gửi mã OTP tới email!",
                severity: "success"
            }));
        } catch (err) {
            console.error(err);
            dispatch(showNotification({
                message: "Email đã đăng ký!",
                severity: "error"
            }));
        }
        setLoadingOtp(false);
    };

    const handleRegister = async () => {
        if (
            !form.name.trim() ||
            !form.phone.trim() ||
            !form.email.trim() ||
            !form.password ||
            !form.password_confirmation ||
            !form.otp.trim()
        ) {
            dispatch(showNotification({
                message: "Vui lòng nhập đầy đủ thông tin!",
                severity: "warning"
            }));
            return;
        }
        if (form.password !== form.password_confirmation) {
            dispatch(showNotification({
                message: "Mật khẩu xác nhận không khớp!",
                severity: "warning"
            }));
            return;
        }

        setLoadingRegister(true);
        try {
            await register(form);
            const profileRes = await getProfile();
            const userData = profileRes.data.data;

            dispatch(setUser({
                user: userData,
            }));

            localStorage.setItem("user", JSON.stringify(userData));

            dispatch(showNotification({
                message: "Đăng ký thành công!",
                severity: "success"
            }));
            handleResetForm();
            onClose();
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                const errorMessage = err.response.data.message || "Đăng ký thất bại";
                dispatch(showNotification({
                    message: errorMessage,
                    severity: "error"
                }));
                setLoadingRegister(false);
                return;
            }
            dispatch(showNotification({
                message: "Đăng ký thất bại",
                severity: "error"
            }));
        }
        setLoadingRegister(false);
    };

    const handleResetForm = () => {
        setForm({
            name: "",
            phone: "",
            email: "",
            password: "",
            password_confirmation: "",
            otp: "",
        });
        setErrors({ phone: "", email: "" });
        setOtpTimer(0);
        clearInterval(timerRef.current);
        setLoadingOtp(false);
        setLoadingRegister(false);
    };

    // Clear timer khi đóng dialog
    React.useEffect(() => {
        if (!open) {
            clearInterval(timerRef.current);
            setOtpTimer(0);
        }
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent sx={{ width: "600px", padding: 3, position: 'relative' }}>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography variant="h6" fontWeight="bold" color="green" mb={2}>
                    Đăng ký
                </Typography>

                <Typography variant="body1" fontWeight="bold">
                    Tên người dùng
                </Typography>
                <TextField
                    fullWidth
                    label="Nhập tên người dùng"
                    variant="outlined"
                    margin="normal"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                />

                <Typography variant="body1" fontWeight="bold">
                    Số điện thoại
                </Typography>
                <TextField
                    fullWidth
                    label="Nhập số điện thoại"
                    variant="outlined"
                    margin="normal"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                />

                <Typography variant="body1" fontWeight="bold">
                    Email
                </Typography>
                <Box display="flex" gap={1} alignItems="center">
                    <TextField
                        fullWidth
                        label="Nhập Email"
                        variant="outlined"
                        margin="normal"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ minWidth: 120, height: 40, mt: 1 }}
                        onClick={handleSendOtp}
                        disabled={otpTimer > 0 || loadingOtp}
                    >
                        {loadingOtp ? <CircularProgress size={20} color="inherit" /> :
                            (otpTimer > 0 ? `Gửi lại (${otpTimer}s)` : "Gửi mã")}
                    </Button>
                </Box>
                {otpTimer > 0 && (
                    <Typography color="primary" fontSize={14} mt={0.5} ml={1}>
                        Vui lòng kiểm tra email. Bạn có thể gửi lại mã sau {otpTimer}s
                    </Typography>
                )}

                <Typography variant="body1" fontWeight="bold" mt={2}>
                    Mã OTP
                </Typography>
                <TextField
                    fullWidth
                    label="Nhập mã OTP"
                    variant="outlined"
                    margin="normal"
                    name="otp"
                    value={form.otp}
                    onChange={handleChange}
                />

                <Typography variant="body1" fontWeight="bold">
                    Mật khẩu
                </Typography>
                <TextField
                    fullWidth
                    label="Nhập mật khẩu"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                />

                <Typography variant="body1" fontWeight="bold">
                    Nhập lại mật khẩu
                </Typography>
                <TextField
                    fullWidth
                    label="Nhập lại mật khẩu"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                />

                <Box display="flex" justifyContent="center" mt={3}>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            backgroundColor: "orange",
                            borderRadius: 5,
                            maxWidth: "80%",
                            '&:hover': {
                                backgroundColor: "#fb8c00"
                            }
                        }}
                        onClick={handleRegister}
                        disabled={loadingRegister}
                    >
                        {loadingRegister ? <CircularProgress size={24} color="inherit" /> : "ĐĂNG KÝ"}
                    </Button>
                </Box>

                <Box mt={2} textAlign="center">
                    <Typography fontSize={14}>
                        Bạn đã có tài khoản?{" "}
                        <Link
                            onClick={onSwitchToLogin}
                            sx={{
                                color: 'orange',
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            Đăng nhập
                        </Link>
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default RegisterDialog;
