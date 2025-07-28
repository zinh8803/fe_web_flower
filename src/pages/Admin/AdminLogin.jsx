import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getProfile } from "../../services/userService";
import { Box, TextField, Button, Typography, Paper, CircularProgress, IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AdminLogin = () => {
    document.title = "Đăng nhập Admin";
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showCurrent, setShowCurrent] = useState(false);
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await login(form.email, form.password);
            const token = res.data.token;
            const profileRes = await getProfile(token);
            const user = profileRes.data.data;
            if (user.role !== "admin" && user.role !== "employee") {
                setError("Bạn không có quyền truy cập trang admin.");
                setLoading(false);
                return;
            }
            dispatch(setUser({ user, token, refresh_token: res.data.refresh_token }));
            navigate("/admin/dashboard");
        } catch (err) {
            if (err.response && err.response.status === 403) {
                setError("Tài khoản của bạn đã bị khóa.");
            } else {
                setError("Tài khoản hoặc mật khẩu không đúng!");
            }
            // console.error(err);
            // setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        }
        setLoading(false);
    };

    return (
        <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f5f5">
            <Paper elevation={4} sx={{ p: 5, minWidth: 350, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight={700} color="green" mb={3} textAlign="center">
                    Đăng nhập Admin
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Mật khẩu"
                        name="password"
                        type={showCurrent ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowCurrent((show) => !show)}
                                    edge="end"
                                >
                                    {showCurrent ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            ),
                        }}
                    />
                    {error && (
                        <Typography color="error" fontSize={14} mt={1} mb={1}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        fullWidth
                        sx={{ mt: 2, fontWeight: 700, borderRadius: 2 }}
                        disabled={loading}
                        size="large"
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Đăng nhập"}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default AdminLogin;