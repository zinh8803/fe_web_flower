import React, { useState } from "react";
import { updateEmployee } from "../../services/Employee";
import { showNotification } from "../../store/notificationSlice";
import { Box, Typography, TextField, Button, Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import { getProfile } from "../../services/userService";
const ProfileAdmin = () => {
    const dispatch = useDispatch();
    const admin = useSelector((state) => state.user.user);
    console.log("Admin data:", admin);
    console.log("Admin name:", admin.name);
    const [form, setForm] = useState({
        name: admin.name || "",
        email: admin.email || "",
        phone: admin.phone || "",
        address: admin.address || "",
        image_url: admin.image_url || "",
        image: null
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let payload = { ...form };
            if (form.image) {
                const formData = new FormData();
                formData.append("name", form.name);
                formData.append("phone", form.phone);
                formData.append("address", form.address);
                formData.append("status", true);
                payload = formData;
            }
            await updateEmployee(admin.id, payload);
            getProfile().then(res => {
                setForm(res.data.data);
                dispatch(setUser({ user: res.data.data }));
                dispatch(showNotification({ message: "Cập nhật thông tin thành công!", severity: "success" }));
                setLoading(false);
            });
            dispatch(showNotification({
                message: "Cập nhật thông tin thành công!",
                severity: "success"
            }));

        } catch (err) {
            dispatch(showNotification({
                message: err.response?.data?.message || "Cập nhật thất bại!",
                severity: "error"
            }));
        }
        setLoading(false);
    };

    return (
        <Box maxWidth={1500} mx="auto" mt={4}>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Cập nhật thông tin Admin
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Tên"
                    name="name"
                    fullWidth
                    margin="normal"
                    value={form.name}
                    onChange={handleChange}
                />
                <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    margin="normal"
                    value={form.email}
                    disabled
                />
                <TextField
                    label="Số điện thoại"
                    name="phone"
                    fullWidth
                    margin="normal"
                    value={form.phone}
                    onChange={handleChange}
                />
                <TextField
                    label="Địa chỉ"
                    name="address"
                    fullWidth
                    margin="normal"
                    value={form.address}
                    onChange={handleChange}
                />

                <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? "Đang cập nhật..." : "Cập nhật"}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default ProfileAdmin;