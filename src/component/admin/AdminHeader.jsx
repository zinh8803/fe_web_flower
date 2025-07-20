import { useDispatch } from "react-redux";
import { Menu, MenuItem, IconButton, Avatar } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutAndClearCart } from "../../store/userSlice";
import { showNotification } from "../../store/notificationSlice";
const AdminMenuUser = ({ admin }) => {

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
        navigate("/admin/login");
        dispatch(showNotification({
            message: "Đăng xuất thành công!",
            severity: "success"
        }));
    };

    const handleProfile = () => {
        handleClose();
        navigate("/admin/profileAdmin");
    };

    const handleChangePassword = () => {
        handleClose();
        navigate("/admin/change-password");
    };

    return (
        <div>
            <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                <Avatar alt={admin.name} src={admin.image_url} />
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
                <MenuItem>{admin.name}</MenuItem>
                <MenuItem onClick={handleProfile}>Đổi thông tin</MenuItem>
                <MenuItem onClick={handleChangePassword}>Đổi mật khẩu</MenuItem>
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </Menu>
        </div>
    );
};

export default AdminMenuUser;