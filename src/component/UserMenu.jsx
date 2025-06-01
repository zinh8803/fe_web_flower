// components/UserMenu.jsx
import { useState } from "react";
import { Menu, MenuItem, IconButton, Avatar } from "@mui/material";

const UserMenu = ({ user }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                <Avatar alt={user.name} src={user.avatar} />
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
                <MenuItem disabled>{user.name}</MenuItem>
                <MenuItem>Thông tin tài khoản</MenuItem>
                <MenuItem>Đơn hàng</MenuItem>
                <MenuItem>Đăng xuất</MenuItem>
            </Menu>
        </div>
    );
};

export default UserMenu;
