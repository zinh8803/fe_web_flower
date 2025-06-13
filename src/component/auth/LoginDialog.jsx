// src/component/LoginDialog.jsx
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
import RegisterDialog from "./RegisterDialog";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import { login, getProfile } from "../../services/userService";
import { useState } from "react";

const LoginDialog = ({ open, onClose }) => {
    const [openRegister, setOpenRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

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
            onClose(true);
        }, 100);
    };

    const handleLogin = async () => {
        try {
            const res = await login(email, password);
            const token = res.data.token;
            const profileRes = await getProfile(token);

            dispatch(setUser({ user: profileRes.data, token }));

            onClose(false);
        } catch (error) {
            console.error("Login failed:", error);
            alert("Đăng nhập thất bại!");
        }
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                            onClick={handleLogin}
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
