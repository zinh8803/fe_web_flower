// src/component/LoginDialog.jsx
import React from "react";
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

const RegisterDialog = ({ open, onClose, onSwitchToLogin }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent sx={{ width: "600px", padding: 3, position: 'relative' }}>
                <IconButton
                    aria-label="close"
                    onClick={onClose}  // This will now call handleCloseAll from LoginDialog
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
                />

                <Typography variant="body1" fontWeight="bold">
                    Số điện thoại
                </Typography>
                <TextField
                    fullWidth
                    label="Nhập số điện thoại"
                    variant="outlined"
                    margin="normal"
                />

                <Typography variant="body1" fontWeight="bold">
                    Email
                </Typography>
                <TextField
                    fullWidth
                    label="Nhập email"
                    variant="outlined"
                    margin="normal"
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
                />

                <Typography variant="body1" fontWeight="bold" mt={2}>
                    Giới tính
                </Typography>
                <RadioGroup row>
                    <FormControlLabel value="nam" control={<Radio />} label="Nam" />
                    <FormControlLabel value="nu" control={<Radio />} label="Nữ" />
                </RadioGroup>

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
