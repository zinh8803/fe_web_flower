// src/component/LoginDialog.jsx
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    TextField,
    Button,
    Typography,
    Box,
    Link,
    IconButton,
    RadioGroup,
    Radio,
    FormControlLabel,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import { register, getProfile } from "../../services/userService";

const RegisterDialog = ({ open, onClose, onSwitchToLogin }) => {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        password_confirmation: "",
        // gender: "male",
    });

    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleRegister = async () => {
        try {
            const res = await register(form);

            if (res.data && res.data.token) {
                const profileRes = await getProfile(res.data.token);
                dispatch(setUser({ user: profileRes.data, token: res.data.token }));
                onClose();
            }
        } catch (err) {
            console.error(err);
            alert("Đăng ký thất bại");
        }
    };

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
                />

                <Typography variant="body1" fontWeight="bold">
                    Email
                </Typography>
                <TextField
                    fullWidth
                    label="Nhập email"
                    variant="outlined"
                    margin="normal"
                    name="email"
                    value={form.email}
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

                {/* <Typography variant="body1" fontWeight="bold" mt={2}>
                    Giới tính
                </Typography>
                <RadioGroup row value={form.gender} onChange={handleChange} name="gender">
                    <FormControlLabel value="male" control={<Radio />} label="Nam" />
                    <FormControlLabel value="female" control={<Radio />} label="Nữ" />
                </RadioGroup> */}

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
                    >
                        ĐĂNG KÝ
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
