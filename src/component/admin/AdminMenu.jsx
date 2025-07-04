import React, { useState } from "react";
import {
    List, ListItem, ListItemIcon, ListItemText, Collapse, IconButton, Box, Typography
} from "@mui/material";
import {
    Dashboard, LocalOffer, Inventory, Category, ShoppingCart, People,
    ExpandLess, ExpandMore, Add, Edit, Delete, LocalFlorist, ReceiptLong, Spa
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { logoutAndClearCart } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { Warehouse } from "lucide-react";

const AdminMenu = () => {
    const location = useLocation();
    const [openProduct, setOpenProduct] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutAndClearCart());
        window.location.href = "/admin/login";
    };

    return (
        <Box>
            {/* Logo Section */}
            <Box
                sx={{
                    p: 3,
                    textAlign: "center",
                    borderBottom: "1px solid #e0e0e0",
                    mb: 2
                }}
            >
                <LocalFlorist sx={{ fontSize: 48, color: "green", mb: 1 }} />
                <Typography variant="h6" fontWeight={700} color="green">
                    FLOWER SHOP
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Admin Dashboard
                </Typography>
            </Box>

            <List component="nav">
                {/* Dashboard */}
                <ListItem
                    button
                    component={Link}
                    to="/admin/dashboard"
                    selected={location.pathname === "/admin/dashboard"}
                    sx={{
                        "&.Mui-selected, &.Mui-selected:hover": {
                            bgcolor: "#e0f2f1",
                            color: "black"
                        },
                        color: "black"
                    }}
                >
                    <ListItemIcon sx={{ color: "green" }}><Dashboard /></ListItemIcon>
                    <ListItemText primary="Dashboard" sx={{ color: "black" }} />
                </ListItem>

                {/* Quản lý loại hoa */}
                <ListItem
                    button
                    component={Link}
                    to="/admin/flower-types"
                    selected={location.pathname.startsWith("/admin/flower-types")}
                    sx={{
                        "&.Mui-selected, &.Mui-selected:hover": {
                            bgcolor: "#e0f2f1",
                            color: "black"
                        },
                        color: "black"
                    }}
                >
                    <ListItemIcon sx={{ color: "green" }}><Spa /></ListItemIcon>
                    <ListItemText primary="Quản lý loại hoa" sx={{ color: "black" }} />
                </ListItem>

                {/* Quản lý hoa */}
                <ListItem
                    button
                    component={Link}
                    to="/admin/flowers"
                    selected={location.pathname.startsWith("/admin/flowers")}
                    sx={{
                        "&.Mui-selected, &.Mui-selected:hover": {
                            bgcolor: "#e0f2f1",
                            color: "black"
                        },
                        color: "black"
                    }}
                >
                    <ListItemIcon sx={{ color: "green" }}><LocalFlorist /></ListItemIcon>
                    <ListItemText primary="Quản lý hoa" sx={{ color: "black" }} />
                </ListItem>
                {/* Các menu khác */}
                <ListItem
                    button
                    component={Link}
                    to="/admin/categories"
                    selected={location.pathname.startsWith("/admin/categories")}
                    sx={{
                        "&.Mui-selected, &.Mui-selected:hover": {
                            bgcolor: "#e0f2f1",
                            color: "black"
                        },
                        color: "black"
                    }}
                >
                    <ListItemIcon sx={{ color: "green" }}><Category /></ListItemIcon>
                    <ListItemText primary="Quản lý danh mục" />
                </ListItem>
                {/* Quản lý sản phẩm xổ xuống */}
                <ListItem
                    button
                    selected={location.pathname.startsWith("/admin/products")}
                    onClick={() => navigate("/admin/products")}
                >
                    <ListItemIcon sx={{ color: "green" }}><Inventory /></ListItemIcon>
                    <ListItemText primary="Quản lý sản phẩm" />
                    <IconButton
                        size="small"
                        onClick={e => {
                            e.stopPropagation();
                            setOpenProduct(!openProduct);
                        }}
                    >
                        {openProduct ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </ListItem>
                <Collapse in={openProduct} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem
                            button
                            component={Link}
                            to="/admin/products/stock"
                            sx={{ pl: 4 }}
                            selected={location.pathname === "/admin/products/stock"}
                        >
                            <ListItemIcon sx={{ color: "green" }}><Warehouse /></ListItemIcon>
                            <ListItemText primary="Xem tồn kho" sx={{
                                "&.Mui-selected, &.Mui-selected:hover": {
                                    bgcolor: "#e0f2f1",
                                    color: "black"
                                },
                                color: "black"
                            }} />
                        </ListItem>

                    </List>
                </Collapse>

                {/* Quản lý phiếu nhập */}
                <ListItem
                    button
                    component={Link}
                    to="/admin/receipts"
                    selected={location.pathname.startsWith("/admin/receipts")}
                    sx={{
                        "&.Mui-selected, &.Mui-selected:hover": {
                            bgcolor: "#e0f2f1",
                            color: "black"
                        },
                        color: "black"
                    }}
                >
                    <ListItemIcon sx={{ color: "green" }}><ReceiptLong /></ListItemIcon>
                    <ListItemText primary="Quản lý phiếu nhập" />
                </ListItem>

                {/* Quản lý mã giảm giá */}
                <ListItem
                    button
                    component={Link}
                    to="/admin/discounts"
                    selected={location.pathname.startsWith("/admin/discounts")}
                    sx={{
                        "&.Mui-selected, &.Mui-selected:hover": {
                            bgcolor: "#e0f2f1",
                            color: "black"
                        },
                        color: "black"
                    }}
                >
                    <ListItemIcon sx={{ color: "green" }}><LocalOffer /></ListItemIcon>
                    <ListItemText primary="Quản lý mã giảm giá" />
                </ListItem>


                <ListItem
                    button
                    component={Link}
                    to="/admin/orders"
                    selected={location.pathname.startsWith("/admin/orders")}
                    sx={{
                        "&.Mui-selected, &.Mui-selected:hover": {
                            bgcolor: "#e0f2f1",
                            color: "black"
                        },
                        color: "black"
                    }}
                >
                    <ListItemIcon sx={{ color: "green" }}><ShoppingCart /></ListItemIcon>
                    <ListItemText primary="Quản lý đơn hàng" />
                </ListItem>
                <ListItem
                    button
                    component={Link}
                    to="/admin/users"
                    selected={location.pathname.startsWith("/admin/users")}
                    sx={{
                        "&.Mui-selected, &.Mui-selected:hover": {
                            bgcolor: "#e0f2f1",
                            color: "black"
                        },
                        color: "black"
                    }}
                >
                    <ListItemIcon sx={{ color: "green" }}><People /></ListItemIcon>
                    <ListItemText primary="Quản lý người dùng" />
                </ListItem>
                <ListItem
                    button
                    onClick={handleLogout}
                    sx={{
                        mt: 2,
                        color: "black",
                        "&:hover": {
                            bgcolor: "#ffeaea",
                            color: "red"
                        },
                        cursor: "pointer",
                    }}
                >
                    <ListItemIcon sx={{ color: "red" }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Đăng xuất" />
                </ListItem>
            </List>
        </Box>
    );
};

export default AdminMenu;