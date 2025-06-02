// src/component/LoginDialog.jsx
import React from "react";
import {
    Dialog,
    DialogContent,
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    Typography,
    Box,
    Link,
    IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { orange } from "@mui/material/colors";
import RegisterDialog from "./RegisterDialog"; // Import RegisterDialog component

const LoginDialog = ({ open, onClose }) => {
    const [openRegister, setOpenRegister] = React.useState(false);

    const handleOpenRegister = () => {
        setOpenRegister(true);
    };

    const handleCloseAll = () => {
        setOpenRegister(false);
        onClose(false);
    };

    const handleSwitchToLogin = () => {
        setOpenRegister(false);
        setTimeout(() => {
            onClose(true); // Gọi với true để mở lại form đăng nhập
        }, 100);
    };

    return (
        <>
            <Dialog open={open} onClose={handleCloseAll}>
                <DialogContent sx={{ width: "600px", padding: 3, position: 'relative' }}>
                    {/* Add Close Button */}
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseAll}
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
                        Đăng nhập
                    </Typography>

                    <Typography variant="body1" fontWeight="bold" >
                        Đăng nhập bằng email
                    </Typography>
                    <TextField
                        fullWidth
                        label="email"
                        variant="outlined"
                        margin="normal"
                    />

                    <Typography variant="body1" fontWeight="bold">
                        Mật khẩu
                    </Typography>
                    <TextField
                        fullWidth
                        label="Mật khẩu"
                        type="password"
                        variant="outlined"
                        margin="normal"
                    />

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <FormControlLabel control={<Checkbox />} label="Ghi nhớ mật khẩu" />
                        <Link href="#" fontSize={14} fontWeight="bold" sx={{ color: orange[500], textDecoration: 'none' }}>
                            Quên mật khẩu ?
                        </Link>
                    </Box>

                    <Box display="flex" justifyContent="center">
                        <Button
                            width="100%"
                            variant="contained"
                            sx={{
                                backgroundColor: "orange",
                                borderRadius: 5,
                                maxWidth: "80%"
                            }}
                        >
                            ĐĂNG NHẬP
                        </Button>
                    </Box>

                    <Box mt={2} textAlign="center">
                        <Typography fontSize={14}>
                            Bạn chưa có tài khoản?{" "}
                            <Link
                                onClick={handleOpenRegister}
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
                                Đăng ký
                            </Link>
                        </Typography>
                    </Box>
                </DialogContent>
            </Dialog>

            <RegisterDialog
                open={openRegister}
                onClose={handleCloseAll}
                onSwitchToLogin={handleSwitchToLogin}
            />
        </>
    );
};

export default LoginDialog;
