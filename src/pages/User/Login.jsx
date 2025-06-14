import React from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import { Box, Button, Typography } from "@mui/material";

const Login = () => {
    const dispatch = useDispatch();

    const handleLogin = () => {
        const fakeUser = { id: 1, name: "Nguyễn Văn A" };
        const fakeToken = "fake-token-123";
        dispatch(setUser({ user: fakeUser, token: fakeToken }));
    };

    return (
        <Box p={6}>
            <Typography variant="h5" fontWeight="bold" mb={4}>
                Đăng nhập
            </Typography>
            <Button variant="contained" color="primary" onClick={handleLogin}>
                Đăng nhập
            </Button>
        </Box>
    );
};

export default Login;
