import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getProfile } from "../../services/userService";
import { Box, TextField, Button, Typography, Paper, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";

const AdminLogin = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
            if (user.role !== "admin") {
                setError("Bạn không có quyền truy cập trang admin.");
                setLoading(false);
                return;
            }
            dispatch(setUser({ user, token, refresh_token: res.data.refresh_token }));
            navigate("/admin");
        } catch (err) {
            console.error(err);
            setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
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
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
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