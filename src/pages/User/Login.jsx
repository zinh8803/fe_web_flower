// import React from "react";
// import { useDispatch } from "react-redux";
// import { setUser } from "../../store/userSlice";
// import { getProfile } from "../../services/userService";
// import { Box, Button, Typography } from "@mui/material";

// const Login = () => {
//     const dispatch = useDispatch();

//     const handleLogin = () => {
//         const fakeToken = "123456789";
//         handleLoginSuccess(fakeToken);
//     };

//     const handleLoginSuccess = async (token) => {
//         localStorage.setItem("token", token);
//         const res = await getProfile(token);
//         dispatch(setUser({ user: res.data.data, token }));
//     };

//     return (
//         <Box p={6}>
//             <Typography variant="h5" fontWeight="bold" mb={4}>
//                 Đăng nhập
//             </Typography>
//             <Button variant="contained" color="primary" onClick={handleLogin}>
//                 Đăng nhập
//             </Button>
//         </Box>
//     );
// };

// export default Login;
