import React from "react";
import { Box, Typography, TextField, Button, Avatar, Stack, CircularProgress, Card, CardContent } from "@mui/material";
import Breadcrumb from "../breadcrumb/Breadcrumb";

const ProfileForm = ({ form, onChange, onImageChange, onSubmit, loading }) => (
    <Box maxWidth="1450px" mx="auto" mt={4}>
        <Breadcrumb
            items={[
                { label: "Trang chủ", href: "/" },
                { label: "Thông tin tài khoản" }
            ]}
        />
        <Card>
            <CardContent >
                <Typography variant="h5" fontWeight={700} mb={3}>
                    Thông tin tài khoản
                </Typography>
                <Stack alignItems="center" mb={2}>
                    <Avatar
                        src={form.image ? URL.createObjectURL(form.image) : form.image_url}
                        alt={form.name}
                        sx={{ width: 100, height: 100, mb: 2 }}
                    />
                    <Button variant="outlined" component="label" size="small">
                        Đổi ảnh đại diện
                        <input type="file" hidden accept="image/*" onChange={onImageChange} />
                    </Button>
                </Stack>
                <form onSubmit={onSubmit}>
                    <TextField
                        label="Tên"
                        name="name"
                        value={form.name || ""}
                        onChange={onChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={form.email || ""}
                        fullWidth
                        margin="normal"
                        disabled
                    />
                    <TextField
                        label="Số điện thoại"
                        name="phone"
                        value={form.phone || ""}
                        onChange={onChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Địa chỉ"
                        name="address"
                        value={form.address || ""}
                        onChange={onChange}
                        fullWidth
                        margin="normal"
                    />

                    <Stack direction="row" spacing={2} mt={2} justifyContent="center">
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Lưu"}
                        </Button>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    </Box>
);

export default ProfileForm;