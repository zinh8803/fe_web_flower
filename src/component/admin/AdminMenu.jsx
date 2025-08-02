import React, { useState } from "react";
import {
    List, ListItem, ListItemIcon, ListItemText, Collapse, IconButton, Box, Typography
} from "@mui/material";
import {
    Dashboard, LocalOffer, Inventory, Category, ShoppingCart, People,
    ExpandLess, ExpandMore, Add, Edit, Delete, LocalFlorist, ReceiptLong, Spa,
    SupervisorAccount,
    ColorLens
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSelector } from "react-redux";
import { Warehouse } from "lucide-react";
import Logo from "../../assets/img/LOGO_HOA.png";
const AdminMenu = () => {
    const location = useLocation();
    const [openProduct, setOpenProduct] = useState(false);
    const [openDiscount, setOpenDiscount] = useState(false);
    const [openFlowerType, setOpenFlowerType] = useState(false);
    const navigate = useNavigate();
    const user = useSelector(state => state.user.user);



    return (
        <Box
            sx={{
                width: 260,
                bgcolor: "white",
                minHeight: "100vh",
                height: "auto",
                display: "flex",
                flexDirection: "column"
            }}
        >
            {/* Logo Section */}
            <Box
                sx={{
                    p: 1,
                    textAlign: "center",
                    borderBottom: "1px solid #e0e0e0",
                    flexShrink: 0
                }}
            >
                {/* <LocalFlorist sx={{ fontSize: 48, color: "green", mb: 1 }} /> */}
                <img src={Logo} alt="Logo" style={{ width: "100%" }} />
                <Typography variant="h6" fontWeight={700} color="green">
                    FLOWER SHOP
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Admin Dashboard
                </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
                <List component="nav" >
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

                    {user?.role === "admin" && (
                        <>
                            {/* Quản lý loại hoa */}
                            <ListItem
                                button
                                selected={location.pathname.startsWith("/admin/flower-types")}
                                onClick={() => navigate("/admin/flower-types")}
                            >
                                <ListItemIcon sx={{ color: "green" }}><Spa /></ListItemIcon>
                                <ListItemText primary="Quản lý loại hoa" sx={{ color: "black" }} />
                                <IconButton
                                    size="small"
                                    sx={{ ml: 1 }}
                                    onClick={e => {
                                        e.stopPropagation();
                                        setOpenFlowerType(!openFlowerType);
                                    }}
                                >
                                    {openFlowerType ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                            </ListItem>

                            <Collapse in={openFlowerType} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem
                                        button
                                        component={Link}
                                        to="/admin/flower-types/colors"
                                        sx={{ pl: 4 }}
                                        selected={location.pathname === "/admin/flower-types/colors"}
                                    >
                                        <ListItemIcon sx={{ color: "green" }}><ColorLens /></ListItemIcon>
                                        <ListItemText primary="Quản Lý Màu" sx={{
                                            "&.Mui-selected, &.Mui-selected:hover": {
                                                bgcolor: "#e0f2f1",
                                                color: "black"
                                            },
                                            color: "black"
                                        }} />
                                    </ListItem>

                                </List>
                            </Collapse>

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
                            {/* categories */}
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
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <ListItemText primary="Quản lý sản phẩm" />
                                    <IconButton
                                        size="small"
                                        sx={{ ml: 1 }}
                                        onClick={e => {
                                            e.stopPropagation();
                                            setOpenProduct(!openProduct);
                                        }}
                                    >
                                        {openProduct ? <ExpandLess /> : <ExpandMore />}
                                    </IconButton>
                                </Box>
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
                                        <ListItemText primary="Tồn kho" sx={{
                                            "&.Mui-selected, &.Mui-selected:hover": {
                                                bgcolor: "#e0f2f1",
                                                color: "black"
                                            },
                                            color: "black"
                                        }} />
                                    </ListItem>
                                    <ListItem
                                        button
                                        component={Link}
                                        to="/admin/products/trash"
                                        sx={{ pl: 4 }}
                                        selected={location.pathname === "/admin/products/trash"}
                                    >
                                        <ListItemIcon sx={{ color: "green" }}><Delete /></ListItemIcon>
                                        <ListItemText primary="Thùng rác" sx={{
                                            "&.Mui-selected, &.Mui-selected:hover": {
                                                bgcolor: "#e0f2f1",
                                                color: "black"
                                            },
                                            color: "black"
                                        }} />
                                    </ListItem>
                                </List>
                            </Collapse>

                            {/* Quản lý mã giảm giá */}
                            <ListItem
                                button
                                selected={location.pathname.startsWith("/admin/discounts")}
                                onClick={() => navigate("/admin/discounts")}
                                sx={{
                                    "&.Mui-selected, &.Mui-selected:hover": {
                                        bgcolor: "#e0f2f1",
                                        color: "black"
                                    },
                                    color: "black"
                                }}
                            >
                                <ListItemIcon sx={{ color: "green" }}><LocalOffer /></ListItemIcon>
                                <Box sx={{ display: "flex", alignItems: "center", width: '100%' }}>
                                    <ListItemText primary="Quản lý mã giảm giá" />
                                    <IconButton
                                        size="small"
                                        sx={{ ml: 1 }}
                                        onClick={e => {
                                            e.stopPropagation();
                                            setOpenDiscount(!openDiscount);
                                        }}
                                    >
                                        {openDiscount ? <ExpandLess /> : <ExpandMore />}
                                    </IconButton>
                                </Box>
                            </ListItem>
                            <Collapse in={openDiscount} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem
                                        button
                                        component={Link}
                                        to="/admin/discounts/subscribers"
                                        sx={{ pl: 4 }}
                                        selected={location.pathname === "/admin/discounts/subscribers"}
                                    >
                                        <ListItemIcon sx={{ color: "green" }}><People /></ListItemIcon>
                                        <ListItemText primary="Người đăng ký" sx={{
                                            "&.Mui-selected, &.Mui-selected:hover": {
                                                bgcolor: "#e0f2f1",
                                                color: "black"
                                            },
                                            color: "black"
                                        }} />
                                    </ListItem>
                                </List>
                            </Collapse>


                            {/* Quản lý người dùng */}
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
                                component={Link}
                                to="/admin/employees"
                                selected={location.pathname.startsWith("/admin/employees")}
                                sx={{
                                    "&.Mui-selected, &.Mui-selected:hover": {
                                        bgcolor: "#e0f2f1",
                                        color: "black"
                                    },
                                    color: "black"
                                }}
                            >
                                <ListItemIcon sx={{ color: "green" }}><SupervisorAccount /></ListItemIcon>
                                <ListItemText primary="Quản lý nhân viên" />
                            </ListItem>
                        </>
                    )}

                    {/* Đơn hàng và phiếu nhập */}
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


                </List>
            </Box>
        </Box>
    );
};

export default AdminMenu;