// components/UserMenu.jsx
import { useDispatch } from "react-redux";
import { Menu, MenuItem, IconButton, Avatar } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutAndClearCart } from "../../store/userSlice";
const UserMenu = ({ user }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {

        dispatch(logoutAndClearCart());
    };

    const handleProfile = () => {
        handleClose();
        navigate("/profile");
    }

    const handleChanePassword = () => {
        handleClose();
        navigate("/change-password");
    }

    const handleOrderHistory = () => {
        handleClose();
        navigate("/orders/history");
    };

    // This function can be called after a successful login
    // const handleLoginSuccess = (token) => {
    //     localStorage.setItem("token", token);
    //     // Call API to get profile
    //     getProfile(token).then(profileRes => {
    //         dispatch(setUser({ user: profileRes.data.data, token }));
    //     });
    // };

    return (
        <div>
            <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                <Avatar alt={user.name} src={user.image_url} />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 2,
                    sx: {
                        mt: 1.5,
                        minWidth: 180,
                    },
                }}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuItem >{user.name}</MenuItem>
                <MenuItem onClick={handleProfile}>Thông tin tài khoản</MenuItem>
                <MenuItem onClick={handleOrderHistory}>Đơn hàng</MenuItem>
                <MenuItem onClick={handleChanePassword}>Đổi mật khẩu</MenuItem>
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </Menu>
        </div>
    );
};

export default UserMenu;
